package main

import (
	"log"
	"net/http"
	"os"

	"goreact/middleware"
	"goreact/routes"
)

//middlewares chaining
func chain(f http.HandlerFunc, middelwares ...middleware.Middleware) http.HandlerFunc {
	for _, middleware := range middelwares {
		f = middleware(f)
	}
	return f
}

func redirectTLS(w http.ResponseWriter, r *http.Request) {
	if r.Header.Get("x-forwarded-proto") != "https" {
		http.Redirect(w, r, "https://" + r.Host + r.RequestURI, http.StatusMovedPermanently)
	}
    
}

func main() {
	//root entry point, serving main html page
	http.HandleFunc("/", chain(routes.HandleRoot, middleware.Logger()))

	//serving static files(css, jsvsscript, img)
	fs := http.FileServer(http.Dir("build/static/"))
	http.Handle("/static/", http.StripPrefix("/static", fs))

	//API entry points
	//login
	http.HandleFunc("/login", chain(routes.HandlerLogin, middleware.Method("POST"), middleware.Logger()))

	//register
	http.HandleFunc("/register", chain(routes.HandlerRegister, middleware.Method("POST"), middleware.Logger()))

	//logout
	http.HandleFunc("/logout", chain(routes.HandlerLogout, middleware.Method("POST"), middleware.Logger()))

	//add counter
	http.HandleFunc("/addcounter", chain(routes.HandlerAddCounter, middleware.Method("POST"), middleware.Logger()))

	//get counters
	http.HandleFunc("/getcounters", chain(routes.HandlerGetCounters, middleware.Method("GET"), middleware.Logger()))

	//set counter
	http.HandleFunc("/setcounter", chain(routes.HandlerSetCounter, middleware.Method("POST"), middleware.Logger()))

	//set counter
	http.HandleFunc("/delcounter", chain(routes.HandlerDelCounter, middleware.Method("POST"), middleware.Logger()))

	//Get environment listten port
	var addr string
	port := os.Getenv("PORT")
	goEnv := os.Getenv("GO_ENV")
	if port == "" || goEnv == "development" {
		addr = ":3001"
	} else {
		addr = ":" + port
	}
	log.Printf("Listening address%s", addr)



	if goEnv == "development" {
		if err := http.ListenAndServe(addr, nil); err != nil {
			panic(err)
		}
	} else {
		if err := http.ListenAndServe(addr, http.HandlerFunc(redirectTLS)); err != nil {
			panic(err)
		}
	}

	
}
