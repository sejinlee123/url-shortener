package router

import (
	"github.com/gin-gonic/gin"
	_ "github.com/sejinlee123/Url_Shortener_Fun/backend/docs"
	"github.com/sejinlee123/Url_Shortener_Fun/backend/internal/api/handler"
	"github.com/sejinlee123/Url_Shortener_Fun/backend/internal/api/middleware"
)

func SetupRouter(urlH *handler.URLHandler, sysH *handler.SystemHandler, frontendURL string) *gin.Engine {
    r := gin.Default()

    // 1. MUST BE FIRST: Global CORS
    r.Use(middleware.SetupCORS(frontendURL))

    // 2. The "Preflight Catcher": Handle OPTIONS at both / and /api/
    // This ensures no 404s ever happen for preflights.
    r.OPTIONS("/*any", func(c *gin.Context) {
        c.Status(200)
        c.Abort()
    })

    // 3. Handle both prefixed and non-prefixed routes
    // This addresses the "404 on preflight" you saw in your network logs
    apiRoutes := r.Group("/api")
    {
        apiRoutes.POST("/shorten", urlH.ShortenURL)
        apiRoutes.GET("/:code", urlH.ResolveURL)
    }

    // Fallback for non-prefixed calls
    r.POST("/shorten", urlH.ShortenURL)
    r.GET("/:code", urlH.ResolveURL)
    r.GET("/health", sysH.HealthCheck)

    return r
}