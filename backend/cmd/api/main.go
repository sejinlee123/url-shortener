package main

import (
	"context"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	ginadapter "github.com/awslabs/aws-lambda-go-api-proxy/gin"

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


    ginLambda = ginadapter.NewV2(r)
    lambda.Start(Handler)

}

// Handler converts the API Gateway V2 Event to a Gin Request and back
func Handler(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
    //eventJSON, _ := json.Marshal(req)
    //fmt.Printf("DEBUG: FULL EVENT PAYLOAD: %s\n", string(eventJSON))
    return ginLambda.ProxyWithContext(ctx, req)
}