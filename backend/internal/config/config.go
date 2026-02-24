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
}

// Load gathers all environment variables into a single struct
func Load() *Config {
	return &Config{
		DBHost:    getEnv("DB_HOST", "localhost"),
		DBUser:    getEnv("DB_USER", "user"),
		DBPass:    getEnv("DB_PASSWORD", "password"),
		DBName:    getEnv("DB_NAME", "url_shortener"),
		DBPort:    getEnv("DB_PORT", "5432"),
		RedisHost: getEnv("REDIS_HOST", "localhost"),
		RedisPort: getEnv("REDIS_PORT", "6379"),
		RedisPass: getEnv("REDIS_PASSWORD", ""),
		AppPort:   getEnv("APP_PORT", "8080"),
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}