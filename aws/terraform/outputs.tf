output "media_bucket_name" {
  value       = aws_s3_bucket.media_vault.id
  description = "S3 bucket name for media vault"
}

output "dynamodb_table_name" {
  value       = aws_dynamodb_table.pis_store.name
  description = "DynamoDB table name"
}

output "user_pool_id" {
  value       = aws_cognito_user_pool.evoke_pool.id
  description = "Cognito User Pool ID"
}

output "user_pool_client_id" {
  value       = aws_cognito_user_pool_client.web_client.id
  description = "Cognito User Pool Client ID"
}

output "audit_log_group_name" {
  value       = aws_cloudwatch_log_group.audit_trail.name
  description = "CloudWatch Audit Log Group name"
}
