package main

import (
	"net/http"
	"os"
	"log"

	"goreact/middleware"
	"goreact/routes"
)

//middlewares chaining
func chain(f http.HandlerFunc, middelwares ...middleware.Middleware) http.HandlerFunc {
	for _, middleware := range(middelwares) {
		f = middleware(f)
	}
	return f
}

func main() {
	//root entry point, serving main html page
    http.HandleFunc("/", chain(routes.HandleRoot, middleware.Logger()))

	//serving static files(css, jsvsscript, img)
	fs := http.FileServer(http.Dir("build/static/"))
    http.Handle("/static/", http.StripPrefix("/static", fs))

	//API entry points
	//login
	http.HandleFunc("/login", chain(routes.HandlerLogin, middleware.Logger()))

	//register
	http.HandleFunc("/register", chain(routes.HandlerRegister, middleware.Logger()))

	//logout
	http.HandleFunc("/logout", chain(routes.HandlerLogout, middleware.Logger()))

	//add counter
	http.HandleFunc("/addcounter", chain(routes.HandlerAddCounter, middleware.Logger()))

	//get counters
	http.HandleFunc("/getcounters", chain(routes.HandlerGetCounters, middleware.Logger()))

	//set counter
	http.HandleFunc("/setcounter", chain(routes.HandlerSetCounter, middleware.Logger()))

	//set counter
	http.HandleFunc("/delcounter", chain(routes.HandlerDelCounter, middleware.Logger()))

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

    if err := http.ListenAndServe(addr, nil); err != nil {
        panic(err)
    }
}