package db

import (
	"fmt"
	"strings"

	"github.com/sejinlee123/Url_Shortener_Fun/backend/internal/config"
	"github.com/sejinlee123/Url_Shortener_Fun/backend/internal/domain"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func NewPostgresDB(cfg *config.Config) (*gorm.DB, error) {
	dsn := cfg.PostgresDSN()
	if strings.TrimSpace(dsn) == "" {
		return nil, fmt.Errorf("database: set DATABASE_URL (Neon) or DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME")
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	if err := db.AutoMigrate(&domain.ShortURL{}); err != nil {
		return nil, fmt.Errorf("failed to migrate database: %w", err)
	}

	return db, nil
}
