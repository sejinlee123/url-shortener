package cache

import (
	"context"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

func NewRedisClient(host, port, password string) (*redis.Client, error) {
rdb := redis.NewClient(&redis.Options{
        Addr:         fmt.Sprintf("%s:%s", host, port),
        Password:     password,
        DB:           0,
        DialTimeout:  5 * time.Second,  // Don't wait forever to connect
        ReadTimeout:  3 * time.Second,  // Don't wait forever to read
        WriteTimeout: 3 * time.Second,  // Don't wait forever to write
        PoolSize:     10,               // Allow 10 simultaneous connections
    })

	if err := rdb.Ping(context.Background()).Err(); err != nil {
		return nil, err
	}
	return rdb, nil
}