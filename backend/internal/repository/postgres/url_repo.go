package postgres

import (
	"context"
	"errors"

	"github.com/sejinlee123/Url_Shortener_Fun/backend/internal/domain"
	"gorm.io/gorm"
)

type urlRepository struct {
	db *gorm.DB
}


func NewURLRepository(db *gorm.DB) domain.ShortURLRepository {
	return &urlRepository{db: db}
}


func (r *urlRepository) Create(ctx context.Context, url *domain.ShortURL) error {
	return r.db.WithContext(ctx).Create(url).Error
}

func (r *urlRepository) GetByCode(ctx context.Context, code string) (*domain.ShortURL, error) {
    var url domain.ShortURL
    err := r.db.WithContext(ctx).Where("short_code = ?", code).First(&url).Error

    if err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            // Return a specific "not found" error so the handler knows to 404
            return nil, errors.New("url not found") 
        }
        return nil, err
    }
    return &url, nil
}

func (r *urlRepository) Update(ctx context.Context, url *domain.ShortURL) error {
	return r.db.WithContext(ctx).Save(url).Error
}

func (r *urlRepository) Delete(ctx context.Context, code string) error {
	return r.db.WithContext(ctx).Where("short_code = ?", code).Delete(&domain.ShortURL{}).Error
}

func (r *urlRepository) IncrementVisit(ctx context.Context, code string) error {
    result := r.db.WithContext(ctx).
        Model(&domain.ShortURL{}).
        Where("short_code = ?", code).
        UpdateColumn("visit_count", gorm.Expr("visit_count + ?", 1))

    if result.Error != nil {
        return result.Error
    }

    if result.RowsAffected == 0 {
        return errors.New("no record found with that short code")
    }

    return nil
}
func (r *urlRepository) Exists(ctx context.Context, code string) (bool, error) {
	var count int64
	err := r.db.WithContext(ctx).Model(&domain.ShortURL{}).Where("short_code = ?", code).Count(&count).Error

	return count > 0, err
}




