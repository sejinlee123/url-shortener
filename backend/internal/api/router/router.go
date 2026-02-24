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

    // 1. Middleware applies to EVERYTHING
    r.Use(middleware.SetupCORS(frontendURL))

    // 2. The /api group (Matches your CloudFront/Browser calls)
    api := r.Group("/api")
    {
        // This handles OPTIONS for /api/shorten, /api/health, etc.
        api.OPTIONS("/*any", func(c *gin.Context) {
            c.AbortWithStatus(200)
        })

        api.POST("/shorten", urlH.ShortenURL)
        api.GET("/health", sysH.HealthCheck)
        api.GET("/:code", urlH.ResolveURL)
    }

    // 3. Root-level routes (No wildcard here to avoid the panic)
    r.GET("/health", sysH.HealthCheck)
    r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
    
    // If you need an OPTIONS handler for the root level, 
    // define it for specific paths or use a middleware-based approach 
    // instead of /*any. But for your current bug, the /api group is what matters.

    return r
}