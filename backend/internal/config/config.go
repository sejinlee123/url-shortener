package config

import (
	"fmt"
	"os"
	"strings"
)

type Config struct {
	DatabaseURL string
	DBHost      string
	DBUser      string
	DBPass      string
	DBName      string
	DBPort      string
	AppPort     string
	FrontendURL string
}

// PostgresDSN returns a libpq/pgx DSN. Prefer DATABASE_URL from Neon; otherwise
// discrete DB_* env vars (local dev).
func (c *Config) PostgresDSN() string {
	if s := strings.TrimSpace(c.DatabaseURL); s != "" {
		return s
	}
	return fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=require",
		c.DBHost, c.DBUser, c.DBPass, c.DBName, c.DBPort)
}

func Load() *Config {
	return &Config{
		DatabaseURL: getEnv("DATABASE_URL", ""),
		DBHost:      getEnv("DB_HOST", ""),
		DBUser:      getEnv("DB_USER", ""),
		DBPass:      getEnv("DB_PASSWORD", ""),
		DBName:      getEnv("DB_NAME", ""),
		DBPort:      getEnv("DB_PORT", "5432"),
		AppPort:     getEnv("APP_PORT", "8080"),
		FrontendURL: getEnv("FRONTEND_URL", ""),
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
