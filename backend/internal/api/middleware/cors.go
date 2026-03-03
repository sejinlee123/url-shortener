package middleware

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupCORS(frontendURL string) gin.HandlerFunc {
    if frontendURL == "" {
        frontendURL = "http://localhost:5173"
    }

    return cors.New(cors.Config{
        // Add only the origins you trust
        AllowOrigins:     []string{frontendURL},
        AllowMethods:     []string{"GET", "POST", "OPTIONS", "PUT", "DELETE"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
        MaxAge:           12 * time.Hour,
    })
}