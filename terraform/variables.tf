variable "aws_profile" {
  description = "AWS profile name"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "bucket_name" {
  default = "bucket_name"
  type = string
}

variable "created_by" {
  default = "your name" 
  type = string
}

variable "object_ownership" {
  default = "BucketOwnerPreferred"
  type = string
}