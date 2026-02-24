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

    // 1. Apply CORS to everything
    r.Use(middleware.SetupCORS(frontendURL))

    // 2. Create a handler function for the OPTIONS 200 OK
    optionsHandler := func(c *gin.Context) {
        c.AbortWithStatus(200)
    }

    // 3. The "Double-Map" Strategy
    // This ensures that /api/shorten AND /shorten both work
    routes := []string{"", "/api"}
    
    for _, prefix := range routes {
        group := r.Group(prefix)
        {
            group.OPTIONS("/*any", optionsHandler)
            group.POST("/shorten", urlH.ShortenURL)
            group.GET("/health", sysH.HealthCheck)
            group.GET("/:code", urlH.ResolveURL)
        }
    }

    // Swagger documentation
    r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

    return r
}