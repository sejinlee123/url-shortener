package main

import (
	"context"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	ginadapter "github.com/awslabs/aws-lambda-go-api-proxy/gin"

	"github.com/sejinlee123/Url_Shortener_Fun/backend/internal/api/handler"
	"github.com/sejinlee123/Url_Shortener_Fun/backend/internal/api/router"
	"github.com/sejinlee123/Url_Shortener_Fun/backend/internal/config"
	database "github.com/sejinlee123/Url_Shortener_Fun/backend/internal/data/db"
	"github.com/sejinlee123/Url_Shortener_Fun/backend/internal/pkg/generator"
	"github.com/sejinlee123/Url_Shortener_Fun/backend/internal/repository/postgres"
	"github.com/sejinlee123/Url_Shortener_Fun/backend/internal/usecase"
)

var ginLambda *ginadapter.GinLambdaV2

func main() {
	cfg := config.Load()

	db, err := database.NewPostgresDB(cfg)
	if err != nil {
		panic(err)
	}

	repo := postgres.NewURLRepository(db)
	gen := generator.NewShortUrlGenerator(0)
	uc := usecase.NewURLUsecase(repo, gen)

	h := handler.NewURLHandler(uc, cfg.FrontendURL)
	sysH := handler.NewSystemHandler()

	r := router.SetupRouter(h, sysH, cfg.FrontendURL)

	ginLambda = ginadapter.NewV2(r)
	lambda.Start(Handler)
}

func Handler(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	return ginLambda.ProxyWithContext(ctx, req)
}
