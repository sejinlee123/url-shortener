variable "aws_profile" {
  description = "AWS profile name from your local ~/.aws/credentials (optional)"
  type        = string
  default     = ""
}

variable "aws_region" {
  description = "The AWS region to deploy resources into"
  type        = string
}

variable "bucket_name" {
  description = "Globally unique name for the S3 frontend bucket"
  type        = string
}

variable "created_by" {
  description = "Tag to identify resource ownership"
  type        = string
}

variable "object_ownership" {
  description = "S3 Object Ownership setting"
  default     = "BucketOwnerPreferred"
  type        = string
}


# Database Variables
variable "db_user" { 
  type = string 
}

variable "db_name" { 
  type = string 
}

variable "db_password" {
  type        = string
  sensitive   = true
  description = "The master password for the database"
}

variable "frontend_url" {
  type        = string
  default     = "https://placeholder.cloudfront.net"
  description = "Full URL of the frontend (e.g. https://your-distribution.cloudfront.net). Used for API Gateway CORS and Lambda FRONTEND_URL. After first apply, run 'terraform output cloudfront_domain' and set this to https://<that-value>, then apply again."
}
