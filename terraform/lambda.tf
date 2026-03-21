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

  handler     = "bootstrap"
  runtime     = "provided.al2023"
  architectures = ["arm64"]

  environment {
    variables = {
      DATABASE_URL = var.neon_database_url
      FRONTEND_URL = var.frontend_url
    }
  }
}
