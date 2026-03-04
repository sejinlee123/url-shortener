package router

import (
	"github.com/gin-gonic/gin"
	"github.com/sejinlee123/Url_Shortener_Fun/backend/internal/api/handler"
	"github.com/sejinlee123/Url_Shortener_Fun/backend/internal/api/middleware"
)

func SetupRouter(urlH *handler.URLHandler, sysH *handler.SystemHandler, frontendURL string) *gin.Engine {
	r := gin.Default()

	r.Use(middleware.SetupCORS(frontendURL))

	// Routes
	r.POST("/api/shorten", middleware.RateLimitShorten(), urlH.ShortenURL)
	r.GET("/api/stats/:code", urlH.GetStats)
	r.GET("/api/:code", urlH.ResolveURL)
	r.GET("/api/health", sysH.HealthCheck)
	r.GET("/r/:code", urlH.ResolveURL)
	r.GET("/:code", urlH.ResolveURL)

	return r
}
