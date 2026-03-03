package main

import (
	"context"
	"fmt"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	ginadapter "github.com/awslabs/aws-lambda-go-api-proxy/gin"

	// Import your generated docs
	_ "github.com/sejinlee123/Url_Shortener_Fun/backend/docs"

	"github.com/sejinlee123/Url_Shortener_Fun/backend/internal/api/handler"
	"github.com/sejinlee123/Url_Shortener_Fun/backend/internal/api/router"
	"github.com/sejinlee123/Url_Shortener_Fun/backend/internal/config"
	"github.com/sejinlee123/Url_Shortener_Fun/backend/internal/data/cache"
	database "github.com/sejinlee123/Url_Shortener_Fun/backend/internal/data/db"
	"github.com/sejinlee123/Url_Shortener_Fun/backend/internal/pkg/generator"
	"github.com/sejinlee123/Url_Shortener_Fun/backend/internal/repository/postgres"
	"github.com/sejinlee123/Url_Shortener_Fun/backend/internal/usecase"
)

var ginLambda *ginadapter.GinLambdaV2

func main() {
    cfg := config.Load()

    // Initialize PostgreSQL/Redis
    db, err := database.NewPostgresDB(cfg.DBHost, cfg.DBUser, cfg.DBPass, cfg.DBName, cfg.DBPort)
    if err != nil {
        panic(err)
    }

    redisClient, err := cache.NewRedisClient(cfg.RedisHost, cfg.RedisPort, cfg.RedisPass)
    if err != nil {
        panic(err)
    }

    // Setup Layers
    repo := postgres.NewURLRepository(db)
    gen := generator.NewShortUrlGenerator(0)
    uc := usecase.NewURLUsecase(repo, gen, redisClient)

    h := handler.NewURLHandler(uc)
    sysH := handler.NewSystemHandler()

    // Create the Gin Engine
    r := router.SetupRouter(h, sysH, cfg.FrontendURL)

    // Check if we are running in the AWS Lambda environment
    if os.Getenv("AWS_LAMBDA_FUNCTION_NAME") != "" {
        // Use the adapter for Lambda
        ginLambda = ginadapter.NewV2(r)
        lambda.Start(Handler)
    } else {
        // Run as a normal web server for local development
        r.Run(":" + cfg.AppPort)
    }
}

// Handler converts the API Gateway V2 Event to a Gin Request and back
func Handler(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
    fmt.Printf("DEBUG: Incoming Path: %s\n", req.RequestContext.HTTP.Path)
    fmt.Printf("DEBUG: Incoming RawPath: %s\n", req.RawPath)
    fmt.Printf("DEBUG: Incoming Method: %s\n", req.RequestContext.HTTP.Method)
    return ginLambda.ProxyWithContext(ctx, req)
}