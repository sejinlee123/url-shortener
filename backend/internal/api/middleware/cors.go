package middleware

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupCORS(frontendURL string) gin.HandlerFunc {
    // If empty, we still provide a safe local fallback
    if frontendURL == "" {
        frontendURL = "http://localhost:5173"
    }

    return cors.New(cors.Config{
        AllowOrigins: []string{
            frontendURL,            // Value from Terraform/Config
            "http://127.0.0.1:5173",
        },
        AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
        MaxAge:           12 * time.Hour,
    })
}