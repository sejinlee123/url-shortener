package middleware

import (
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

type rateLimiter struct {
	mu        sync.Mutex
	requests  map[string][]time.Time
	limit     int
	window    time.Duration
}

// newRateLimiter creates a simple in-memory rate limiter.
func newRateLimiter(limit int, window time.Duration) *rateLimiter {
	return &rateLimiter{
		requests: make(map[string][]time.Time),
		limit:    limit,
		window:   window,
	}
}

func (r *rateLimiter) allow(key string) bool {
	now := time.Now()
	cutoff := now.Add(-r.window)

	r.mu.Lock()
	defer r.mu.Unlock()

	times := r.requests[key]
	// Drop entries outside the window
	n := 0
	for _, t := range times {
		if t.After(cutoff) {
			times[n] = t
			n++
		}
	}
	times = times[:n]

	if len(times) >= r.limit {
		r.requests[key] = times
		return false
	}

	r.requests[key] = append(times, now)
	return true
}

var shortenLimiter = newRateLimiter(10, time.Minute)

// RateLimitShorten limits POST /api/shorten to 10 requests per IP per minute.
func RateLimitShorten() gin.HandlerFunc {
	return func(c *gin.Context) {
		ip := c.ClientIP()
		if ip == "" {
			ip = "unknown"
		}

		if !shortenLimiter.allow(ip) {
			c.AbortWithStatusJSON(429, gin.H{
				"error": "rate limit exceeded, try again soon",
			})
			return
		}

		c.Next()
	}
}

