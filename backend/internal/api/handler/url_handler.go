package handler

import (
	"net/http"
	"os"

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
	usecase domain.ShortURLUsecase
}

func NewURLHandler(u domain.ShortURLUsecase) *URLHandler {
	return &URLHandler{usecase: u}
}


func (h *URLHandler) ShortenURL(c *gin.Context) {
	FRONTEND_URL := os.Getenv("FRONTEND_URL")
	var req ShortenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid URL provided"})
		return
	}

	shortCode, err := h.usecase.Shorten(c.Request.Context(), req.LongURL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create short link"})
		return
	}

	fullShortURL := FRONTEND_URL + "/r/" + shortCode
	c.JSON(http.StatusCreated, ShortenResponse{ShortURL: fullShortURL})
}

func (h *URLHandler) ResolveURL(c *gin.Context) {
	code := c.Param("code")

	longURL, err := h.usecase.Resolve(c.Request.Context(), code)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "The short link does not exist"})
		return
	}

	c.Redirect(http.StatusMovedPermanently, longURL)
}

func (h *URLHandler) GetStats(c *gin.Context) {
	code := c.Param("code")
	url, err := h.usecase.GetStats(c.Request.Context(), code)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "The short link does not exist"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"visit_count":  url.VisitCount,
		"original_url": url.OriginalURL,
	})
}