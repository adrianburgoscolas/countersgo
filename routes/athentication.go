package routes

import (
	"encoding/json"
	"errors"
	"fmt"
	"goreact/db"
	"goreact/utils"
	"log"
	"net/http"
	"regexp"
	"time"
	"unicode/utf8"

	"github.com/golang-jwt/jwt/v4"
)

type credentials struct {
	Password string `json:"password"`
	User     string `json:"user"`
}

type myToken struct {
	Open    string `json:"open"`
	Message string `json:"message"`
}

//claims
type MyCustomClaims struct {
	User string `json:"user"`
	jwt.RegisteredClaims
}

//time of token and cookies expiracy in minutes
const exp = 15

func failedSession(w http.ResponseWriter, err error) {
	w.WriteHeader(http.StatusUnauthorized)
	json.NewEncoder(w).Encode(myToken{"false", fmt.Sprint(err)})
}

//login entry point
func HandlerLogin(w http.ResponseWriter, r *http.Request) {
	var creds credentials
	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if creds.User == "" && creds.Password == "" {
		//client session validation
		if clientClaims, err := utils.SessionValidation(w, r); err != nil {
			fmt.Printf("Unauthorized: %s ,", err)
			failedSession(w, err)
			return
		} else {
			fmt.Printf("user: %v, issuer: %v ,", clientClaims.User, clientClaims.RegisteredClaims.Issuer)
			json.NewEncoder(w).Encode(myToken{"true", clientClaims.User})
			return
		}
	}

	//user and password string validation
	reg := regexp.MustCompile(`[[:graph:]]+`)
	if !reg.MatchString(creds.User) || !reg.MatchString(creds.Password) || utf8.RuneCountInString(creds.User) > 32 || utf8.RuneCountInString(creds.Password) > 256 {
		failedSession(w, errors.New("Bad user or password caracters"))
		return
	}

	//athentication
	if err := db.AthenticateUser(creds.User, creds.Password); err != nil {
		fmt.Printf("%s ,", err)
		failedSession(w, err)
		return
	}

	utils.SetSession(creds.User, w)
	log.Printf("User: %s logged in", creds.User)
}

//registering entry point
func HandlerRegister(w http.ResponseWriter, r *http.Request) {
	var creds credentials

	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	//user and password string validation
	reg := regexp.MustCompile(`[[:graph:]]+`)
	if !reg.MatchString(creds.User) || !reg.MatchString(creds.Password) || utf8.RuneCountInString(creds.User) > 32 || utf8.RuneCountInString(creds.Password) > 256 {
		failedSession(w, errors.New("Bad user or password caracters"))
		return
	}

	//todo: hashing password and register user in db
	if _, err := db.RegisterUser(creds.User, creds.Password); err != nil {
		fmt.Printf("%s ,", err)
		failedSession(w, err)
		return
	}

	//set session
	log.Printf("User: %s logged in", creds.User)
	utils.SetSession(creds.User, w)
}

//Logout entry point
func HandlerLogout(w http.ResponseWriter, r *http.Request) {
	if clientClaims, err := utils.SessionValidation(w, r); err != nil {
		fmt.Printf("Unauthorized: %s ,", err)
		failedSession(w, err)
		return
	} else {
		fmt.Printf("user: %v, issuer: %v ,", clientClaims.User, clientClaims.RegisteredClaims.Issuer)
		http.SetCookie(w, &http.Cookie{
			Name:     "session_token",
			Value:    "",
			Expires:  time.Date(1970, 1, 1, 0, 0, 0, 0, time.UTC),
			HttpOnly: true,
			SameSite: http.SameSiteLaxMode,
		})

		fmt.Print("Logged out ")
		failedSession(w, err)
		return
	}
}
