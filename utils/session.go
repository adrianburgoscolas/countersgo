package utils

import (
	"net/http"
	"time"
	"encoding/json"
	"os"

	"github.com/golang-jwt/jwt/v4"
)

//time of token and cookies expiracy in minutes
const exp = 15

type myToken struct {
	Open string `json:"open"` 
	Message string `json:"message"`

}


//jwt key for signature
var MySigningKey = []byte(os.Getenv("JWT_SIG_KEY"))

//claims
type MyCustomClaims struct {
	User string `json:"user"`
	jwt.RegisteredClaims
}


func SessionValidation(w http.ResponseWriter, r *http.Request) (MyCustomClaims, error) {
	sessionToken, err := r.Cookie("session_token")
	if err != nil {
		// For any other type of error, return a bad request status
		return MyCustomClaims{}, err
	} 
	token, err := jwt.ParseWithClaims(sessionToken.Value, &MyCustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		return MySigningKey, nil
	})

	if claims, ok := token.Claims.(*MyCustomClaims); ok && token.Valid{
		return *claims, nil
	} else {
		return MyCustomClaims{}, err
	}
}

func SetSession(user string, w http.ResponseWriter) {
	claims := MyCustomClaims{
		user,
		jwt.RegisteredClaims{
			// Also fixed dates can be used for the NumericDate
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(exp * time.Minute)),
			Issuer:    "GoReactApp",
		},
	}

	//creating jwt token with custom and registered claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	ss, _ := token.SignedString(MySigningKey)

	//storing jwt on a session cookie
	http.SetCookie(w, &http.Cookie{
		Name:    "session_token",
		Value:   ss,
		Expires: time.Now().Add(exp * time.Minute),
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
	})
	json.NewEncoder(w).Encode(myToken{"true", user})
}