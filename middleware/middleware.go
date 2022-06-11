package middleware

import (
	"net/http"
	"time"
	"log"
)

type Middleware func(http.HandlerFunc) http.HandlerFunc

func Logger() Middleware {
	//create new middleware
	return func(hf http.HandlerFunc) http.HandlerFunc {
		//define http.HandlerFunc
		return func(w http.ResponseWriter, r *http.Request) {
			//do middleware
			start := time.Now()
			defer func() { log.Println(r.URL.Path, time.Since(start)) }()
			//call next
			hf(w, r)
		}

	}
}