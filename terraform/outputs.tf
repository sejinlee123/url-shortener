output "cloudfront_url" {
  value = aws_cloudfront_distribution.website_cdn.domain_name
  description = "The URL of your website"
}