provider "aws" {
  region  = var.aws_region
  #profile = var.aws_profile
}

resource "null_resource" "invalidate_cache" {
  triggers = {
    # This triggers the invalidation whenever any file in your frontend changes
    hash = md5(join("", [for f in fileset("${path.module}/dist", "**") : filemd5("${path.module}/dist/${f}")]))
  }

  provisioner "local-exec" {
    command = "aws cloudfront create-invalidation --distribution-id ${aws_cloudfront_distribution.website_cdn.id} --paths '/*'"
  }
}