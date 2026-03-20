output "api_endpoint" {
  value = aws_apigatewayv2_api.backend_api.api_endpoint
}

output "api_url" {
  value = aws_apigatewayv2_api.backend_api.api_endpoint
}

output "cloudfront_domain" {
  value = aws_cloudfront_distribution.website_cdn.domain_name
}

output "site_url" {
  value = "https://urlshortenerfree.xyz"
}