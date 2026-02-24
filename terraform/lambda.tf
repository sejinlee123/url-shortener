data "archive_file" "lambda_zip" {
  type        = "zip"
  source_file = "${path.module}/../backend/bootstrap"
  output_path = "${path.module}/lambda_function.zip"
}

resource "aws_lambda_function" "api" {
  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  
  function_name = "url-shortener-api"
  role          = aws_iam_role.lambda_exec.arn
  
  # For Go on AL2023, handler is always 'bootstrap'
  handler       = "bootstrap"
  runtime       = "provided.al2023"
  architectures = ["arm64"]

  vpc_config {
    subnet_ids         = [aws_subnet.private_1.id, aws_subnet.private_2.id]
    security_group_ids = [aws_security_group.db_sg.id]
  }

  environment {
    variables = {
      DB_HOST      = aws_db_instance.postgres.address
      DB_USER      = var.db_user
      DB_PASSWORD  = var.db_password
      DB_NAME      = var.db_name
      REDIS_HOST   = aws_elasticache_cluster.redis.cache_nodes[0].address
      FRONTEND_URL = "https://${aws_cloudfront_distribution.website_cdn.domain_name}"
    }
  }
}