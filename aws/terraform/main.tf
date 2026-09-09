terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# ==============================================================================
# 1. S3 Raw Vault (AES-256 Encrypted Ingestion Store)
# ==============================================================================
resource "aws_s3_bucket" "media_vault" {
  bucket        = "${var.s3_bucket_prefix}-${var.environment}"
  force_destroy = false

  tags = {
    Project     = "Evoke"
    Environment = var.environment
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "media_vault_encryption" {
  bucket = aws_s3_bucket.media_vault.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "media_vault_block" {
  bucket = aws_s3_bucket.media_vault.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ==============================================================================
# 2. DynamoDB PIS Store (Invariant I2: Subject-Defined Expiry via native TTL)
# ==============================================================================
resource "aws_dynamodb_table" "pis_store" {
  name         = var.dynamodb_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "pk"
  range_key    = "sk"

  attribute {
    name = "pk"
    type = "S"
  }

  attribute {
    name = "sk"
    type = "S"
  }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }

  point_in_time_recovery {
    enabled = true
  }

  server_side_encryption {
    enabled = true
  }

  tags = {
    Project   = "Evoke"
    Invariant = "I2_Subject_Defined_Expiry"
  }
}

# ==============================================================================
# 3. Amazon Cognito User Pools (Invariant I1: Role Separation)
# ==============================================================================
resource "aws_cognito_user_pool" "evoke_pool" {
  name = "evoke-user-pool-${var.environment}"

  auto_verified_attributes = ["email"]
  username_attributes      = ["email"]

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_uppercase = true
  }
}

resource "aws_cognito_user_pool_client" "web_client" {
  name         = "evoke-web-client"
  user_pool_id = aws_cognito_user_pool.evoke_pool.id

  explicit_auth_flows = [
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_PASSWORD_AUTH"
  ]
}

# Role Group 1: Living Subject (Primary Author - Invariant I3)
resource "aws_cognito_user_pool_group" "living_subject" {
  name         = "LivingSubject"
  user_pool_id = aws_cognito_user_pool.evoke_pool.id
  description  = "Living primary subject with primary calibration authority (Invariant I3)"
  precedence   = 1
}

# Role Group 2: Family Contributor (Advisory Mode)
resource "aws_cognito_user_pool_group" "family_contributor" {
  name         = "FamilyContributor"
  user_pool_id = aws_cognito_user_pool.evoke_pool.id
  description  = "Family contributors in advisory contribution mode"
  precedence   = 2
}

# Role Group 3: Family Auditor (Invariant I4: Transparency)
resource "aws_cognito_user_pool_group" "family_auditor" {
  name         = "FamilyAuditor"
  user_pool_id = aws_cognito_user_pool.evoke_pool.id
  description  = "Family members with read-only access to audit trail (Invariant I4)"
  precedence   = 3
}

# ==============================================================================
# 4. CloudWatch Tamper-Evident Audit Trails (Invariant I4: Auditability)
# ==============================================================================
resource "aws_cloudwatch_log_group" "audit_trail" {
  name              = "/aws/evoke/audit-trail"
  retention_in_days = 365

  tags = {
    Project   = "Evoke"
    Invariant = "I4_Auditability"
  }
}
