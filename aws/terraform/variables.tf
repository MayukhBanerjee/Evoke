variable "aws_region" {
  type        = string
  default     = "us-east-1"
  description = "AWS deployment region"
}

variable "environment" {
  type        = string
  default     = "prod"
  description = "Deployment environment name"
}

variable "s3_bucket_prefix" {
  type        = string
  default     = "evoke-media-vault"
  description = "Prefix for S3 media vault bucket"
}

variable "dynamodb_table_name" {
  type        = string
  default     = "evoke-vaults"
  description = "DynamoDB table for PIS storage"
}
