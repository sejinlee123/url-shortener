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
        DialTimeout:  5 * time.Second,  
        ReadTimeout:  3 * time.Second,  
        WriteTimeout: 3 * time.Second,  
        PoolSize:     10,               
    })

	if err := rdb.Ping(context.Background()).Err(); err != nil {
		return nil, err
	}
	return rdb, nil
}