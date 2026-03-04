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
  default_root_object = "index.html"

  # --- ORIGINS ---
  
  # Origin 1: Your S3 Bucket (Frontend)
  origin {
    domain_name              = aws_s3_bucket.deployment_bucket.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.cloudfront_oac.id
    origin_id                = "origin-bucket-${aws_s3_bucket.deployment_bucket.id}"
  }

  # Origin 2: Your API Gateway (Backend)
  origin {
    # Remove https:// from the endpoint for CloudFront
    domain_name = replace(aws_apigatewayv2_api.backend_api.api_endpoint, "https://", "")
    origin_id   = "origin-api-gateway"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  # --- CACHE BEHAVIORS (Order Matters!) ---

  # 1. Behavior for API Calls (/api/*)
  ordered_cache_behavior {
    path_pattern     = "/api/*"
    target_origin_id = "origin-api-gateway"

    allowed_methods  = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods   = ["GET", "HEAD"]
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = true
      headers      = ["Origin", "Authorization", "Content-Type"]
      cookies {
        forward = "all"
      }
    }

    min_ttl     = 0
    default_ttl = 0
    max_ttl     = 0
  }

  # 2. Behavior for Redirects (/r/*)
  ordered_cache_behavior {
    path_pattern     = "/r/*"
    target_origin_id = "origin-api-gateway"

    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = true
      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0
    default_ttl = 0
    max_ttl     = 0
  }

  # 3. Default Behavior: S3 (Everything else)
  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"] # Cleaned up for S3
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "origin-bucket-${aws_s3_bucket.deployment_bucket.id}"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0
    default_ttl = 300
    max_ttl     = 1200
  }

  # --- SETTINGS ---

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  # Fixed for React SPA support: Redirect 403/404 back to index.html
  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
  }

  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Created_By = var.created_by
  }
}