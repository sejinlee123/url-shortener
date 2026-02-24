package router

import (
	"github.com/gin-gonic/gin"
	_ "github.com/sejinlee123/Url_Shortener_Fun/backend/docs"
	"github.com/sejinlee123/Url_Shortener_Fun/backend/internal/api/handler"
	"github.com/sejinlee123/Url_Shortener_Fun/backend/internal/api/middleware"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func SetupRouter(urlH *handler.URLHandler, sysH *handler.SystemHandler, frontendURL string) *gin.Engine {
    r := gin.Default()

    // 1. Setup CORS Middleware
    r.Use(middleware.SetupCORS(frontendURL))

    // 2. ADD THIS: Global OPTIONS handler
    // This ensures every preflight request gets a 200 OK status.
    r.OPTIONS("/*any", func(c *gin.Context) {
        c.AbortWithStatus(200)
    })

    // Swagger documentation
    r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

    // System Routes
    r.GET("/health", sysH.HealthCheck)

    // Business Routes
    r.POST("/shorten", urlH.ShortenURL)
    r.GET("/:code", urlH.ResolveURL)

    return r
}