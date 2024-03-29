package routes

import (
	"encoding/json"
	"fmt"
	"net/http"
	"regexp"
	"unicode/utf8"

	"goreact/db"
	"goreact/utils"
)

type Counter struct {
	Value int `json:"value"`
	Name  string `json:"name"`
}

type CounterResponse struct {
	Id int64 `json:"id"`
}

//Add counter entry point handler
func HandlerAddCounter(w http.ResponseWriter, r *http.Request) {
  if r.Method == "OPTIONS" {
    return
  }
	clientClaims, err := utils.SessionValidation(w, r)
	if err != nil {
		fmt.Printf("Unauthorized: %s ,", err)
		failedSession(w, err)
		return
	}

	counter := Counter{}

	if err := json.NewDecoder(r.Body).Decode(&counter); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	//new counter validation
	reg := regexp.MustCompile(`\w+`)
	if !reg.MatchString(counter.Name) || utf8.RuneCountInString(counter.Name) > 14 {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	id, err := db.AddCounter(clientClaims.User, counter.Name)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(CounterResponse{id})
}

//Get counters entry point handler
func HandlerGetCounters(w http.ResponseWriter, r *http.Request) {
	clientClaims, err := utils.SessionValidation(w, r)
	if err != nil {
		fmt.Printf("Unauthorized: %s ,", err)
		failedSession(w, err)
		return
	}

	counters, err := db.GetCounters(clientClaims.User)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(counters)
}

//Set counter entry point handler
func HandlerSetCounter(w http.ResponseWriter, r *http.Request) {
  if r.Method == "OPTIONS" {
    return
  }

	clientClaims, err := utils.SessionValidation(w, r)
	if err != nil {
		fmt.Printf("Unauthorized: %s ,", err)
		failedSession(w, err)
		return
	}

	counter := Counter{}

	if err := json.NewDecoder(r.Body).Decode(&counter); err != nil {
    fmt.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	//set counter validation
	reg := regexp.MustCompile(`\w+`)
	if !reg.MatchString(counter.Name) || utf8.RuneCountInString(counter.Name) > 14 || counter.Value > 10000 {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	id, err := db.SetCounter(clientClaims.User, counter.Name, counter.Value)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(CounterResponse{id})
}

//Del counter entry point handler
func HandlerDelCounter(w http.ResponseWriter, r *http.Request) {
  if r.Method == "OPTIONS" {
    return
  }
	clientClaims, err := utils.SessionValidation(w, r)
	if err != nil {
		fmt.Printf("Unauthorized: %s ,", err)
		failedSession(w, err)
		return
	}

	counter := Counter{}

	if err := json.NewDecoder(r.Body).Decode(&counter); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	//new counter validation
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	reg := regexp.MustCompile(`\w+`)
	if !reg.MatchString(counter.Name) || utf8.RuneCountInString(counter.Name) > 14 || counter.Value > 10000 {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	id, err := db.DelCounter(clientClaims.User, counter.Name)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(CounterResponse{id})
}
