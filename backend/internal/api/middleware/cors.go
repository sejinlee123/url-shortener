package middleware

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupCORS(frontendURL string) gin.HandlerFunc {
    origins := []string{}
    if frontendURL != "" {
        origins = []string{frontendURL}
    }

    return cors.New(cors.Config{
        AllowOrigins:     origins,
        AllowMethods:     []string{"GET", "POST", "OPTIONS", "PUT", "DELETE"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
        MaxAge:           12 * time.Hour,
    })
}