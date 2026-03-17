package handler

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sejinlee123/Url_Shortener_Fun/backend/internal/domain"
)

type ShortenRequest struct {
	LongURL string `json:"long_url" binding:"required,url" example:"https://www.google.com"`
}

type ShortenResponse struct {
	ShortURL string `json:"short_url"`
}

type URLHandler struct {
	usecase     domain.ShortURLUsecase
	frontendURL string
}

func NewURLHandler(u domain.ShortURLUsecase, frontendURL string) *URLHandler {
	return &URLHandler{
		usecase:     u,
		frontendURL: frontendURL,
	}
}


func (h *URLHandler) ShortenURL(c *gin.Context) {
	var req ShortenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid URL provided"})
		return
	}

	if h.frontendURL == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "shortener service is misconfigured"})
		return
	}

	shortCode, err := h.usecase.Shorten(c.Request.Context(), req.LongURL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create short link"})
		return
	}

	fullShortURL := h.frontendURL + "/r/" + shortCode
	c.JSON(http.StatusCreated, ShortenResponse{ShortURL: fullShortURL})
}

func (h *URLHandler) ResolveURL(c *gin.Context) {
	code := c.Param("code")

	longURL, err := h.usecase.Resolve(c.Request.Context(), code)
	if err != nil {
		switch {
		case errors.Is(err, domain.ErrURLNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "The short link does not exist"})
			return
		case errors.Is(err, domain.ErrURLExpired):
			c.JSON(http.StatusGone, gin.H{"error": "The short link has expired"})
			return
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to resolve short link"})
			return
		}
	}

	c.Redirect(http.StatusMovedPermanently, longURL)
}

func (h *URLHandler) GetStats(c *gin.Context) {
	code := c.Param("code")
	url, err := h.usecase.GetStats(c.Request.Context(), code)
	if err != nil {
		switch {
		case errors.Is(err, domain.ErrURLNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "The short link does not exist"})
			return
		case errors.Is(err, domain.ErrURLExpired):
			c.JSON(http.StatusGone, gin.H{"error": "The short link has expired"})
			return
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch stats"})
			return
		}
	}
	c.JSON(http.StatusOK, gin.H{
		"visit_count":  url.VisitCount,
		"original_url": url.OriginalURL,
	})
}