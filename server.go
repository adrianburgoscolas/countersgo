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

func main() {
	//root entry point, serving main html page
	http.HandleFunc("/", chain(routes.HandleRoot, middleware.Method("GET"), middleware.RedirectTLS(), middleware.Logger()))

	//serving static files(css, jsvsscript, img)
	fs := http.FileServer(http.Dir("./build/static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))
	fs1 := http.FileServer(http.Dir("./build"))
	http.Handle("/favicon.ico", fs1)
	fs2 := http.FileServer(http.Dir("./build"))
	http.Handle("/logo192.png", fs2)
	fs3 := http.FileServer(http.Dir("./build"))
	http.Handle("/logo512.png", fs3)
	fs4 := http.FileServer(http.Dir("./build"))
	http.Handle("/manifest.json", fs4)
	fs5 := http.FileServer(http.Dir("./build"))
	http.Handle("/robots.txt", fs5)
	fs6 := http.FileServer(http.Dir("./build"))
	http.Handle("/asset-manifest.json", fs6)

	//API entry points
	//login
	http.HandleFunc("/login", chain(routes.HandlerLogin, middleware.Method("POST"), middleware.Logger(), middleware.Cors()))

	//register
	http.HandleFunc("/register", chain(routes.HandlerRegister, middleware.Method("POST"), middleware.Logger(), middleware.Cors()))

	//logout
	http.HandleFunc("/logout", chain(routes.HandlerLogout, middleware.Method("POST"), middleware.Logger(), middleware.Cors()))

	//add counter
	http.HandleFunc("/addcounter", chain(routes.HandlerAddCounter, middleware.Method("POST"), middleware.Logger(), middleware.Cors()))

	//get counters
	http.HandleFunc("/getcounters", chain(routes.HandlerGetCounters, middleware.Method("GET"), middleware.Logger(), middleware.Cors()))

	//set counter
	http.HandleFunc("/setcounter", chain(routes.HandlerSetCounter, middleware.Method("POST"), middleware.Logger(), middleware.Cors()))

	//set counter
	http.HandleFunc("/delcounter", chain(routes.HandlerDelCounter, middleware.Method("POST"), middleware.Logger(), middleware.Cors()))

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
