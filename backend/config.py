import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID", "")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY", "")
DYNAMODB_TABLE = os.getenv("DYNAMODB_TABLE", "evoke-vaults")
S3_BUCKET = os.getenv("S3_BUCKET", "evoke-media")
EPISTEMIC_HUMILITY_THRESHOLD = float(os.getenv("HUMILITY_THRESHOLD", "0.70"))
GROQ_MODEL = "llama-3.3-70b-versatile"
GEMINI_MODEL = "gemini-1.5-flash"
USE_AWS = bool(AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY)
