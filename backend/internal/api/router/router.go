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

    // 1. Setup CORS Middleware first
    r.Use(middleware.SetupCORS(frontendURL))

    // 2. Handle the /api group to match your CloudFront/API Gateway calls
    // This solves the 'GET /' and '404' issue
    api := r.Group("/api")
    {
        // Global OPTIONS catcher inside the group
        api.OPTIONS("/*any", func(c *gin.Context) {
            c.AbortWithStatus(200)
        })

        // Business Routes now respond to /api/shorten and /api/:code
        api.POST("/shorten", urlH.ShortenURL)
        api.GET("/health", sysH.HealthCheck)
        api.GET("/:code", urlH.ResolveURL)
    }

    // 3. Keep root-level routes for health checks and local dev
    r.GET("/health", sysH.HealthCheck)
    r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
    
    // Catch-all OPTIONS for the root level just in case
    r.OPTIONS("/*any", func(c *gin.Context) {
        c.AbortWithStatus(200)
    })

    return r
}