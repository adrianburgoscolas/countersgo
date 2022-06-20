package routes

import (
	"net/http"
)

func HandleRoot(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "build/index.html")
}
