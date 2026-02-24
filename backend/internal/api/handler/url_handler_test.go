package handler

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/sejinlee123/Url_Shortener_Fun/backend/internal/domain"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// Define the Mock
type MockUsecase struct {
	mock.Mock
}

func (m *MockUsecase) Shorten(ctx context.Context, longURL string) (string, error) {
	args := m.Called(ctx, longURL)
	return args.String(0), args.Error(1)
}

func (m *MockUsecase) Resolve(ctx context.Context, code string) (string, error) {
	args := m.Called(ctx, code)
	return args.String(0), args.Error(1)
}

func (m *MockUsecase) GetStats(ctx context.Context, code string) (*domain.ShortURL, error) {
	args := m.Called(ctx, code)
	
	// Use .Get(0) and then cast it to the correct pointer type
	res := args.Get(0)
	if res == nil {
		return nil, args.Error(1)
	}
	
	return res.(*domain.ShortURL), args.Error(1)
}
func TestShortenURL_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockUc := new(MockUsecase)
	h := NewURLHandler(mockUc)
	r := gin.Default()
	r.POST("/shorten", h.ShortenURL)

	// Set expectation
	mockUc.On("Shorten", mock.Anything, "https://google.com").Return("abc12345", nil)

	body, _ := json.Marshal(ShortenRequest{LongURL: "https://google.com"})
	req, _ := http.NewRequest("POST", "/shorten", bytes.NewBuffer(body))
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
	assert.Contains(t, w.Body.String(), "abc12345")
}