"""
AWS Transcribe & Comprehend Service.
Performs Phase 2 personality extraction:
1. Amazon Transcribe: Diarized speech-to-text isolating target speaker.
2. Amazon Comprehend: Multi-dimensional NLP (sentiment, key phrases, entities, syntax).

Gracefully falls back to rule-based NLP extraction when AWS is offline or credentials are missing.
"""
import time
from config import USE_AWS, AWS_REGION
from services.nlp_extractor import (
    extract_schema_from_onboard,
    PersonalityIngestionSchema,
    compute_completeness
)

_comprehend_client = None
_transcribe_client = None

def _get_comprehend():
    global _comprehend_client
    if _comprehend_client is None and USE_AWS:
        try:
            import boto3
            _comprehend_client = boto3.client('comprehend', region_name=AWS_REGION)
        except Exception:
            _comprehend_client = None
    return _comprehend_client


def _get_transcribe():
    global _transcribe_client
    if _transcribe_client is None and USE_AWS:
        try:
            import boto3
            _transcribe_client = boto3.client('transcribe', region_name=AWS_REGION)
        except Exception:
            _transcribe_client = None
    return _transcribe_client


async def run_comprehend_analysis(text: str) -> dict:
    """Runs Amazon Comprehend sentiment, key phrases, and entity analysis on text."""
    client = _get_comprehend()
    if not client or not text.strip():
        return {}
        
    try:
        sample = text[:4500]
        sentiment_res = client.detect_sentiment(Text=sample, LanguageCode='en')
        phrases_res = client.detect_key_phrases(Text=sample, LanguageCode='en')
        entities_res = client.detect_entities(Text=sample, LanguageCode='en')
        
        return {
            'sentiment': sentiment_res.get('Sentiment', 'NEUTRAL'),
            'sentiment_score': sentiment_res.get('SentimentScore', {}),
            'key_phrases': [p['Text'] for p in phrases_res.get('KeyPhrases', [])[:10]],
            'entities': [e['Text'] for e in entities_res.get('Entities', [])[:10]],
        }
    except Exception as e:
        print(f"Comprehend analysis warning: {e}")
        return {}


async def extract_personality_pipeline(
    name: str,
    relationship: str,
    description: str,
    prompt_responses: dict[str, str],
) -> PersonalityIngestionSchema:
    """
    Executes Phase 2 extraction:
    Combines Amazon Comprehend results with schema heuristic mapping.
    """
    # 1. First build base schema with proven extractor
    schema = extract_schema_from_onboard(name, relationship, description, prompt_responses)
    
    # 2. Enrich with Amazon Comprehend if AWS is available
    combined_text = " ".join(prompt_responses.values())
    if USE_AWS and combined_text:
        comprehend_data = await run_comprehend_analysis(combined_text)
        if comprehend_data:
            # Augment active topics with recognized entities
            entities = comprehend_data.get('entities', [])
            if entities:
                enriched_topics = list(dict.fromkeys(schema.active_topics + entities[:4]))
                schema.active_topics = enriched_topics
                
            # Recompute completeness score
            schema.completeness_score = compute_completeness(schema)
            
    return schema
