package router

import (
	"github.com/gin-gonic/gin"
	_ "github.com/sejinlee123/Url_Shortener_Fun/backend/docs"
	"github.com/sejinlee123/Url_Shortener_Fun/backend/internal/api/handler"
	"github.com/sejinlee123/Url_Shortener_Fun/backend/internal/api/middleware"
)

func SetupRouter(urlH *handler.URLHandler, sysH *handler.SystemHandler, frontendURL string) *gin.Engine {
    r := gin.Default()

    // 1. Global CORS - This handles OPTIONS requests automatically
    r.Use(middleware.SetupCORS(frontendURL))
    //r.Use(cors.Default())

    // 2. Grouped Routes

    r.POST("/api/shorten", urlH.ShortenURL)
    r.GET("/api/:code", urlH.ResolveURL)
    r.GET("/api/health", sysH.HealthCheck)
    r.GET("/r/:code", urlH.ResolveURL) 
    return r
}