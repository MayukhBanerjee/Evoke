import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env and .env.local from project root or backend folder
root_env = Path(__file__).resolve().parent.parent / ".env"
root_env_local = Path(__file__).resolve().parent.parent / ".env.local"
backend_env = Path(__file__).resolve().parent / ".env"

if root_env.exists():
    load_dotenv(root_env)
if root_env_local.exists():
    load_dotenv(root_env_local, override=True)
elif backend_env.exists():
    load_dotenv(backend_env)
else:
    load_dotenv()


OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "meta-llama/llama-3.3-70b-instruct")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID", "")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY", "")
DYNAMODB_TABLE = os.getenv("DYNAMODB_TABLE") or os.getenv("DYNAMODB_TABLE_NAME", "evoke-vaults")
S3_BUCKET = os.getenv("S3_BUCKET") or os.getenv("S3_BUCKET_NAME", "evoke-media-vault-455840954393-ap-south-1")
COGNITO_USER_POOL_ID = os.getenv("COGNITO_USER_POOL_ID", "")
COGNITO_APP_CLIENT_ID = os.getenv("COGNITO_APP_CLIENT_ID", "")
EPISTEMIC_HUMILITY_THRESHOLD = float(os.getenv("HUMILITY_THRESHOLD", "0.70"))
GROQ_MODEL = "llama-3.3-70b-versatile"
GEMINI_MODEL = "gemini-1.5-flash"
USE_AWS = bool(AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY)

# Amazon Bedrock & Mantle Settings
USE_BEDROCK = os.getenv("USE_BEDROCK", "true").lower() in ("true", "1", "yes")
BEDROCK_REGION = os.getenv("BEDROCK_REGION") or os.getenv("AWS_REGION", "ap-south-1")
BEDROCK_MODEL_ID = os.getenv("BEDROCK_MODEL_ID", "deepseek.v3.2")
BEDROCK_MANTLE_API_KEY = os.getenv("BEDROCK_MANTLE_API_KEY", "")
BEDROCK_MANTLE_ENDPOINT = os.getenv("BEDROCK_MANTLE_ENDPOINT", f"https://bedrock-mantle.{BEDROCK_REGION}.api.aws/v1/chat/completions")
