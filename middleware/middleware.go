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

func Method(m string) Middleware {
    // Create a new Middleware
    return func(f http.HandlerFunc) http.HandlerFunc {
        // Define the http.HandlerFunc
        return func(w http.ResponseWriter, r *http.Request) {
            // Do middleware things
            if r.Method != m {
                http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
                return
            }
            // Call the next middleware/handler in chain
            f(w, r)
        }
    }
}