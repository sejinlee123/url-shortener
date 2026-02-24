package config

import "os"

type Config struct {
	DBHost    string
	DBUser    string
	DBPass    string
	DBName    string
	DBPort    string
	RedisHost string
	RedisPort string
	RedisPass string
	AppPort   string
	FrontendURL string
}

// Load gathers all environment variables into a single struct
func Load() *Config {
    return &Config{
        DBHost:      getEnv("DB_HOST", ""), // Leave empty to force failure if missing
        DBUser:      getEnv("DB_USER", ""),
        DBPass:      getEnv("DB_PASSWORD", ""),
        DBName:      getEnv("DB_NAME", ""),
        DBPort:      getEnv("DB_PORT", "5432"),
        RedisHost:   getEnv("REDIS_HOST", ""),
        RedisPort:   getEnv("REDIS_PORT", "6379"),
        RedisPass:   getEnv("REDIS_PASSWORD", ""),
        AppPort:     getEnv("APP_PORT", "8080"),
        FrontendURL: getEnv("FRONTEND_URL", "http://localhost:5173"), // Default for dev
    }
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}