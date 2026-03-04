output "api_endpoint" {
  value = aws_apigatewayv2_api.backend_api.api_endpoint
}

# Used by CI for VITE_API_URL when building frontend. Use site_url when serving via custom domain.
output "api_url" {
  value = aws_apigatewayv2_api.backend_api.api_endpoint
}

output "cloudfront_domain" {
  value = aws_cloudfront_distribution.website_cdn.domain_name
}

output "site_url" {
  value       = "https://urlshortenerfree.xyz"
  description = "Custom domain for the app (frontend and API via CloudFront)."
}