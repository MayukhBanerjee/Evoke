"""
Evoke Serverless Ingestion Lambda (Phase 1 -> Phase 2 Bridge).
Triggered by Amazon S3 ObjectCreated:Put events on evoke-media-vault.
Initiates an Amazon Transcribe diarization job to isolate the target speaker.
"""
import os
import urllib.parse
import boto3
import time

s3_client = boto3.client('s3')
transcribe_client = boto3.client('transcribe')

OUTPUT_BUCKET = os.environ.get('TRANSCRIPT_OUTPUT_BUCKET', '')

def lambda_handler(event, context):
    """
    Handles S3 upload event, extracts vault_id and filename,
    and initiates diarized speech-to-text.
    """
    for record in event.get('Records', []):
        bucket = record['s3']['bucket']['name']
        key = urllib.parse.unquote_plus(record['s3']['object']['key'])
        
        # S3 key format: audio/{vault_id}/{filename}
        parts = key.split('/')
        if len(parts) >= 3 and parts[0] == 'audio':
            vault_id = parts[1]
            filename = parts[2]
        else:
            vault_id = f"vault-{int(time.time())}"
            filename = os.path.basename(key)
            
        job_name = f"evoke-transcribe-{vault_id}-{int(time.time())}"
        media_uri = f"s3://{bucket}/{key}"
        
        # Audio format inference
        ext = filename.split('.')[-1].lower()
        media_format = 'mp3' if ext in ['mp3', 'm4a'] else 'wav'
        
        print(f"Starting Transcribe job: {job_name} for {media_uri}")
        
        try:
            transcribe_client.start_transcription_job(
                TranscriptionJobName=job_name,
                Media={'MediaFileUri': media_uri},
                MediaFormat=media_format,
                LanguageCode='en-US',
                Settings={
                    'ShowSpeakerLabels': True,
                    'MaxSpeakerLabels': 2,
                },
                OutputBucketName=OUTPUT_BUCKET if OUTPUT_BUCKET else bucket,
                OutputKey=f"transcripts/{vault_id}/{job_name}.json"
            )
            print(f"Successfully dispatched transcription job: {job_name}")
        except Exception as e:
            print(f"Error initiating Transcribe job: {str(e)}")
            raise e

    return {
        'statusCode': 200,
        'body': 'Ingestion dispatched successfully.'
    }
