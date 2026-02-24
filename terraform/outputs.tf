output "cloudfront_url" {
  value       = aws_cloudfront_distribution.website_cdn.domain_name
  description = "The URL of your website"
}

output "api_url" {
  value       = aws_apigatewayv2_api.backend_api.api_endpoint
  description = "The API Gateway URL for the backend"
}

# FIX: Changed "main" to "backend_api" to match your actual resource name
output "api_endpoint" {
  value = aws_apigatewayv2_api.backend_api.api_endpoint
}

output "cloudfront_domain" {
  value = aws_cloudfront_distribution.website_cdn.domain_name
}