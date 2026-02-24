package usecase

import (
	"context"
	"log"
	"time"

	"github.com/redis/go-redis/v9"
	"github.com/sejinlee123/Url_Shortener_Fun/backend/internal/domain"
	"github.com/sejinlee123/Url_Shortener_Fun/backend/internal/pkg/generator"
)

type URLUsecase struct{
	repo domain.ShortURLRepository
	generator *generator.ShortUrlGenerator
	cache *redis.Client
}

func NewURLUsecase(repo domain.ShortURLRepository, gen *generator.ShortUrlGenerator, cache *redis.Client) *URLUsecase {
    return &URLUsecase{
        repo:      repo,
        generator: gen,
        cache:     cache,
    }
}



func (u *URLUsecase) Shorten(ctx context.Context, originalURL  string) (string, error) {
	code, err := u.generateUniqueCode(ctx)
	if err != nil {
		return "", err
	}

	url := &domain.ShortURL{
		OriginalURL: originalURL,
		ShortCode: code,
		VisitCount: 0,
	}

	err = u.repo.Create(ctx, url)
	if err != nil{
		return "", err
	}

	return url.ShortCode, nil
}

func (u *URLUsecase) Resolve(ctx context.Context, code string) (string, error) {
    var longURL string
    var err error

    // 1. Try Cache
    longURL, err = u.cache.Get(ctx, code).Result()

    // 2. If Cache Miss -> Get from DB and Save to Cache
    if err != nil {
        url, dbErr := u.repo.GetByCode(ctx, code)
        if dbErr != nil {
            return "", dbErr // URL doesn't exist
        }
        longURL = url.OriginalURL
        
        // Backfill the cache so the next person gets a Hit
        u.cache.Set(ctx, code, longURL, 24*time.Hour)
    }

    // 3. Increment the counter synchronously
    // This happens for BOTH Cache Hits and Cache Misses.
    if err := u.repo.IncrementVisit(ctx, code); err != nil {
        // We log the error but still return the URL so the user 
        // isn't blocked just because analytics failed.
        log.Printf("Failed to increment visit for %s: %v", code, err)
    }

    return longURL, nil
}

func (u *URLUsecase) GetStats(ctx context.Context, code string) (*domain.ShortURL, error) {
	return u.repo.GetByCode(ctx, code)
	
}

func (u *URLUsecase) generateUniqueCode(ctx context.Context) (string, error) {
    gen := generator.NewShortUrlGenerator(0)
    return gen.GenerateUniqueCode(ctx, u.repo) 
}

