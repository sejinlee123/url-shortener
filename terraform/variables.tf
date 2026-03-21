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

variable "neon_database_url" {
  type        = string
  sensitive   = true
  description = "PostgreSQL connection URI from Neon (Connection string with sslmode=require)."
}

variable "frontend_url" {
  type        = string
  default     = "https://placeholder.cloudfront.net"
  description = "Public frontend URL (CORS and Lambda FRONTEND_URL)."
}

variable "cloudfront_acm_certificate_arn" {
  type        = string
  description = "ISSUED ACM certificate ARN in us-east-1 (CloudFront requirement)."
  validation {
    condition = (
      length(trimspace(var.cloudfront_acm_certificate_arn)) > 0 &&
      can(regex("^arn:aws:acm:us-east-1:[0-9]{12}:certificate/.+", var.cloudfront_acm_certificate_arn))
    )
    error_message = "cloudfront_acm_certificate_arn must be a non-empty ACM ARN in us-east-1 (console: ACM → N. Virginia → copy certificate ARN)."
  }
}
