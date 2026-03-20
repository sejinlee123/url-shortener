data "aws_acm_certificate" "cloudfront" {
  count = var.cloudfront_acm_certificate_arn == "" ? 1 : 0

  provider = aws.use1

  domain      = var.acm_certificate_domain
  most_recent = true
  statuses    = ["ISSUED"]
}

locals {
  cloudfront_acm_arn = var.cloudfront_acm_certificate_arn != "" ? var.cloudfront_acm_certificate_arn : data.aws_acm_certificate.cloudfront[0].arn
}
