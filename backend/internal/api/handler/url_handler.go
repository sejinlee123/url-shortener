package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sejinlee123/Url_Shortener_Fun/backend/internal/domain"
)

type ShortenRequest struct {
	LongURL string `json:"long_url" binding:"required,url" example:"https://www.google.com"`
}

type ShortenResponse struct {
	ShortURL string `json:"short_url" example:"http://localhost:8080/a4fee6e7"`
}

type URLHandler struct {
	usecase domain.ShortURLUsecase
}

func NewURLHandler(u domain.ShortURLUsecase) *URLHandler {
	return &URLHandler{usecase: u}
}

// ShortenURL godoc
// @Summary      Create a short URL
// @Tags         URLs
// @Accept       json
// @Produce      json
// @Param        request  body      ShortenRequest  true  "Long URL to shorten"
// @Success      201      {object}  ShortenResponse
// @Failure      400      {object}  map[string]string
// @Router       /shorten [post]
func (h *URLHandler) ShortenURL(c *gin.Context) {
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

	fullShortURL := "http://localhost:8080/" + shortCode
	c.JSON(http.StatusCreated, ShortenResponse{ShortURL: fullShortURL})
}

// ResolveURL godoc
// @Summary      Resolve and Redirect
// @Description  Takes a short code, increments the visit count in the background, and redirects the user to the original destination URL.
// @Tags         URLs
// @Accept       json
// @Produce      json
// @Param        code  path      string  true  "The 8-character unique short code (e.g., a4fee6e7)"
// @Success      301   {string}  string  "Redirecting to the original URL..."
// @Header       301   {string}  Location "The destination URL"
// @Failure      404   {object}  map[string]string "Error: The short link does not exist"
// @Failure      500   {object}  map[string]string "Internal server error"
// @Router       /{code} [get]
func (h *URLHandler) ResolveURL(c *gin.Context) {
	code := c.Param("code")

	longURL, err := h.usecase.Resolve(c.Request.Context(), code)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "The short link does not exist"})
		return
	}

	c.Redirect(http.StatusMovedPermanently, longURL)
}