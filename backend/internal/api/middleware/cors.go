package middleware

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupCORS() gin.HandlerFunc {
    return cors.New(cors.Config{
        // Add both just to be safe, plus the 127.0.0.1 variant
        AllowOrigins: []string{
            "http://localhost:5173", 
            "http://127.0.0.1:5173",
            "http://localhost:3000", // Keep this if you use it sometimes
        },
        AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
        MaxAge:           12 * time.Hour,
    })
}