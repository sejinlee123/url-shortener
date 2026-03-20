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
  description = "Public frontend URL (CORS and Lambda FRONTEND_URL)."
}

variable "acm_certificate_domain" {
  type        = string
  default     = "urlshortenerfree.xyz"
  description = "ACM certificate domain (us-east-1) for data lookup."
}

variable "cloudfront_acm_certificate_arn" {
  type        = string
  default     = ""
  description = "ACM certificate ARN (us-east-1). If empty, lookup by acm_certificate_domain."
}
