resource "aws_apigatewayv2_api" "backend_api" {
  name          = "url-shortener-gateway"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = [var.frontend_url] # Uses the variable
    allow_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allow_headers = ["Content-Type", "Authorization"]
    max_age       = 300
  }
}

# Integration remains the same, but we reuse it for both routes
resource "aws_apigatewayv2_integration" "lambda_handler" {
  api_id             = aws_apigatewayv2_api.backend_api.id
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
  integration_uri    = aws_lambda_function.api.invoke_arn
}

# Route 1: Catch all API calls (Handles /api/shorten, /api/health, etc.)
resource "aws_apigatewayv2_route" "api_routes" {
  api_id    = aws_apigatewayv2_api.backend_api.id
  route_key = "ANY /api/{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_handler.id}"
}

# Route 2: Handle root-level short-code redirection (/:code)
resource "aws_apigatewayv2_route" "root_redirect" {
  api_id    = aws_apigatewayv2_api.backend_api.id
  route_key = "GET /{code}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_handler.id}"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.backend_api.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_lambda_permission" "api_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.backend_api.execution_arn}/*/*"
}