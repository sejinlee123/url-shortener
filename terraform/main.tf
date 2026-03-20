provider "aws" {
  region = var.aws_region
}

provider "aws" {
  alias  = "use1"
  region = "us-east-1"
}

data "aws_caller_identity" "current" {}

resource "null_resource" "invalidate_cache" {
  triggers = {
    hash = md5(join("", [for f in fileset("${path.module}/dist", "**") : filemd5("${path.module}/dist/${f}")]))
  }

  provisioner "local-exec" {
    command = "aws cloudfront create-invalidation --distribution-id ${aws_cloudfront_distribution.website_cdn.id} --paths '/*'"
  }
}