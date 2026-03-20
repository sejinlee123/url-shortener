  resource "aws_cloudfront_origin_access_control" "cloudfront_oac" {
    name                              = "${var.bucket_name}-OAC"
    description                       = "OAC for ${var.bucket_name}"
    origin_access_control_origin_type = "s3"
    signing_behavior                  = "always"
    signing_protocol                  = "sigv4"
  }
  
  resource "aws_cloudfront_distribution" "website_cdn" {
    enabled             = true
    price_class         = "PriceClass_100"
    aliases             = ["urlshortenerfree.xyz", "*.urlshortenerfree.xyz"]

    origin {
      domain_name              = aws_s3_bucket.deployment_bucket.bucket_regional_domain_name
      origin_access_control_id = aws_cloudfront_origin_access_control.cloudfront_oac.id
      origin_id                = "origin-bucket-${aws_s3_bucket.deployment_bucket.id}"
    }

    # API Gateway: backend API (Go/Lambda)
    origin {
      domain_name = replace(replace(aws_apigatewayv2_api.backend_api.api_endpoint, "https://", ""), "http://", "")
      origin_id   = "MyGolangBackend"

      custom_origin_config {
        http_port              = 80
        https_port             = 443
        origin_protocol_policy = "https-only"
        origin_ssl_protocols   = ["TLSv1.2"]
      }
    }

    default_root_object = "index.html"

    default_cache_behavior {
      allowed_methods        = ["GET", "HEAD", "OPTIONS"]
      cached_methods         = ["GET", "HEAD"]
      target_origin_id       = "origin-bucket-${aws_s3_bucket.deployment_bucket.id}"
      viewer_protocol_policy = "redirect-to-https"
      compress               = true
      cache_policy_id        = "658327ea-f89d-4fab-a63d-7e88639e58f6"
    }

    ordered_cache_behavior {
      path_pattern           = "/api/*"
      target_origin_id       = "MyGolangBackend"
      viewer_protocol_policy = "redirect-to-https"
      allowed_methods        = ["GET", "HEAD", "OPTIONS", "PUT", "PATCH", "POST", "DELETE"]
      cached_methods         = ["GET", "HEAD"]
      cache_policy_id        = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad"
      origin_request_policy_id = "b689b0a8-53d0-40ab-baf2-68738e2966ac"
      compress               = true
    }

    restrictions {
      geo_restriction {
        restriction_type = "none"
      }
    }

    custom_error_response {
      error_caching_min_ttl = 300
      error_code            = 403
      response_code         = "200"
      response_page_path    = "/index.html"
    }

    custom_error_response {
      error_caching_min_ttl = 300
      error_code            = 404
      response_code         = "200"
      response_page_path    = "/index.html"
    }

    viewer_certificate {
      acm_certificate_arn      = var.cloudfront_acm_certificate_arn
      ssl_support_method       = "sni-only"
      minimum_protocol_version = "TLSv1.2_2021"
    }

    tags = {
      Created_By = var.created_by
    }
  }