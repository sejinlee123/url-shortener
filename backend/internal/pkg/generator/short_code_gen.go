package generator

import (
	"context"
	"strings"

	"github.com/google/uuid"
	"github.com/sejinlee123/Url_Shortener_Fun/backend/internal/domain"
)

type ShortUrlGenerator struct {
	length int
}

func NewShortUrlGenerator(length int) *ShortUrlGenerator {
	if length <= 0 {
			length = domain.ShortCodeLength
	}

	if length > domain.MaxShortCodeLength {
        length = domain.MaxShortCodeLength
    }

	return &ShortUrlGenerator{
		length: length,
	}
}

type CodeChecker interface {
    Exists(ctx context.Context, code string) (bool, error)
}

func (g *ShortUrlGenerator) GenerateUniqueCode(ctx context.Context, repo CodeChecker) (string, error) {
    for {
        raw := uuid.New().String()
        shortCode := strings.ReplaceAll(raw, "-", "")[:g.length]

        exists, err := repo.Exists(ctx, shortCode)
        if err != nil {
            return "", err
        }

        if !exists {
            return shortCode, nil
        }
    }
}