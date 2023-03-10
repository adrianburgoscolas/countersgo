package middleware

import (
	"log"
	"net/http"
	"time"
	"os"
)

type Middleware func(http.HandlerFunc) http.HandlerFunc

func  RedirectTLS() Middleware {
	return func(hf http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			if goEnv := os.Getenv("GO_ENV"); goEnv != "development" {
				if r.Header.Get("x-forwarded-proto") != "https" {
					http.Redirect(w, r, "https://"+r.Host+r.RequestURI, http.StatusMovedPermanently)
				}
			}
			hf(w, r)
		}
	}
}




func Cors() Middleware {
	//create new middleware
	return func(hf http.HandlerFunc) http.HandlerFunc {
		//define http.HandlerFunc
		return func(w http.ResponseWriter, r *http.Request) {
			//do middleware
      w.Header().Set("Access-Control-Allow-Origin", "https://countersgo.onrender.com")
      w.Header().Set("Access-Control-Allow-Credentials", "true")
      w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
      w.Header().Set("Access-Control-Allow-Headers", "Content-type")
			//call next
			hf(w, r)
		}

	}
}

func Logger() Middleware {
	//create new middleware
	return func(hf http.HandlerFunc) http.HandlerFunc {
		//define http.HandlerFunc
		return func(w http.ResponseWriter, r *http.Request) {
			//do middleware
			start := time.Now()
			defer func() { log.Println(r.Method, r.URL.Path, time.Since(start)) }()
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
			if r.Method != m && r.Method != "OPTIONS"{
				http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
				return
			}
			// Call the next middleware/handler in chain
			f(w, r)
		}
	}
}
