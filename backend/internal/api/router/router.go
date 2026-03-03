package router

import (
	"github.com/gin-gonic/gin"
	_ "github.com/sejinlee123/Url_Shortener_Fun/backend/docs"
	"github.com/sejinlee123/Url_Shortener_Fun/backend/internal/api/handler"
)

func SetupRouter(urlH *handler.URLHandler, sysH *handler.SystemHandler, frontendURL string) *gin.Engine {
    r := gin.Default()

    // 1. Global CORS - This handles OPTIONS requests automatically
    //r.Use(middleware.SetupCORS(frontendURL))
    //r.Use(cors.Default())

    // 2. Grouped Routes
    api := r.Group("/api")
    {
        api.POST("/shorten", urlH.ShortenURL)
        api.GET("/:code", urlH.ResolveURL)
        api.GET("/health", sysH.HealthCheck)
    }

    // 3. Optional: Redirect root or specific calls to the API group 
    // instead of duplicating the logic entirely.
    r.GET("/:code", urlH.ResolveURL) 

    return r
}