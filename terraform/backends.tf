terraform {
  backend "s3" {
    bucket         = "sejin-terraform-backend"
    key            = "url-shortener/terraform.tfstate"
    region         = "us-east-2"  # specify your AWS region
    encrypt        = true
  }
}