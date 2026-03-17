package domain

import (
	"context"
	"errors"
	"time"
)

const (
    ShortCodeLength = 8
	MaxShortCodeLength = 32 // UUIDs without hyphens
)

type ShortURL struct {
    ID          int64      `gorm:"primaryKey" json:"id"`
    OriginalURL string     `gorm:"column:original_url;not null" json:"original_url"`
    ShortCode   string     `gorm:"column:short_code;uniqueIndex;not null" json:"short_code"`
    VisitCount  int64      `gorm:"column:visit_count;default:0" json:"visit_count"`
    CreatedAt   time.Time  `gorm:"column:created_at" json:"created_at"`
    UpdatedAt   time.Time  `gorm:"column:updated_at" json:"updated_at"`
    ExpiresAt   *time.Time `gorm:"column:expires_at" json:"expires_at,omitempty"`
}

var (
	ErrURLNotFound = errors.New("url not found")
	ErrURLExpired  = errors.New("url expired")
)

type ShortURLRepository interface{

	Create(ctx context.Context, url *ShortURL) error
	GetByCode(ctx context.Context, code string) (*ShortURL, error)
	Update(ctx context.Context, url *ShortURL) error
	Delete(ctx context.Context, code string) error

	IncrementVisit(ctx context.Context, code string) error
	Exists(ctx context.Context, code string) (bool, error)
}

type ShortURLUsecase interface{
	Shorten(ctx context.Context, originalURL  string) (string, error)
	Resolve(ctx context.Context, code string) (string, error) // returns original URL
	GetStats(ctx context.Context, code string) (*ShortURL, error)
}
