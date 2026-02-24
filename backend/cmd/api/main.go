package main

import (

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

    // Handlers and Router
    h := handler.NewURLHandler(uc)
    sysH := handler.NewSystemHandler()

    // Pass the FrontendURL from your config into the router
    r := router.SetupRouter(h, sysH, cfg.FrontendURL)

    r.Run(":" + cfg.AppPort)
}