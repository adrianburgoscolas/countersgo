package routes

import (
	"net/http"
	"encoding/json"
	"fmt"
	"strconv"

	"goreact/db"
	"goreact/utils"
)

type Counter struct {
	Value string `json:"value"`
	Name string `json:"name"`
}

type CounterResponse struct {
	Id int64 `json:"id"`
}

//Add counter entry point handler
func HandlerAddCounter(w http.ResponseWriter, r *http.Request) {
	clientClaims, err := utils.SessionValidation(w, r)
	if  err != nil {
		fmt.Printf("Unauthorized: %s ,", err)
		failedSession(w, err)
		return
	}

	counter := Counter{}
	
	if err := json.NewDecoder(r.Body).Decode(&counter); err != nil {
		w.WriteHeader(http.StatusBadRequest)
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
	if  err != nil {
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
	clientClaims, err := utils.SessionValidation(w, r)
	if  err != nil {
		fmt.Printf("Unauthorized: %s ,", err)
		failedSession(w, err)
		return
	}

	counter := Counter{}
	
	if err := json.NewDecoder(r.Body).Decode(&counter); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	
	value, err := strconv.Atoi(counter.Value)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	id, err := db.SetCounter(clientClaims.User, counter.Name, value)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(CounterResponse{id})
}

//Del counter entry point handler
func HandlerDelCounter(w http.ResponseWriter, r *http.Request) {
	clientClaims, err := utils.SessionValidation(w, r)
	if  err != nil {
		fmt.Printf("Unauthorized: %s ,", err)
		failedSession(w, err)
		return
	}

	counter := Counter{}
	
	if err := json.NewDecoder(r.Body).Decode(&counter); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	
	id, err := db.DelCounter(clientClaims.User, counter.Name)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(CounterResponse{id})
}