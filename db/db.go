package db

import (
	"database/sql"
	"errors"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	id        int64
	username  string
	password  string
	createdAt time.Time
}

type Counter struct {
	countername  string
	countervalue int
}

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 12)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func ConnectDb() (*sql.DB, error) {
	db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@(%s)/%s?parseTime=true", os.Getenv("DBUSER"), os.Getenv("DBPASS"), os.Getenv("DBADDR"), os.Getenv("DBNAME")))
	if err != nil {
		log.Fatal(err)
		return &sql.DB{}, err
	}

	pingErr := db.Ping()
	if pingErr != nil {
		log.Fatal(pingErr)
		return &sql.DB{}, pingErr
	}

	return db, nil
}

func AthenticateUser(userString, password string) error {
	db, err := ConnectDb()
	defer db.Close()
	if err != nil {
		return err
	}
	user := User{}
	row := db.QueryRow("SELECT * FROM users WHERE username = ?", userString)
	if err := row.Scan(&user.id, &user.username, &user.password, &user.createdAt); err != nil {
		if err == sql.ErrNoRows {
			return fmt.Errorf("Wrong user: %s!", userString)
		}
		return fmt.Errorf("User %s: %v", userString, err)
	}

	if match := CheckPasswordHash(password, user.password); match {
		return nil
	}
	return errors.New("Wrong password")
}

func RegisterUser(userString, password string) (int64, error) {
	db, err := ConnectDb()
	defer db.Close()
	if err != nil {
		return 0, err
	}
	hash, _ := HashPassword(password)
	result, err := db.Exec("INSERT INTO users (username,password,created_at) VALUES(?,?,?)", userString, hash, string(time.Now().Format("2006-01-02 15:04:05")))
	if err != nil {
		return 0, err
	}
	if id, err := result.LastInsertId(); err != nil {
		return 0, err
	} else {
		return id, nil
	}

}

func AddCounter(userString, counter string) (int64, error) {
	db, err := ConnectDb()
	defer db.Close()
	if err != nil {
		return 0, err
	}

	user := User{}
	row := db.QueryRow("SELECT * FROM users WHERE username = ?", userString)
	if err := row.Scan(&user.id, &user.username, &user.password, &user.createdAt); err != nil {
		if err == sql.ErrNoRows {
			return 0, fmt.Errorf("%s: no such user", userString)
		}
		return 0, fmt.Errorf("User %s: %v", userString, err)
	}

	result, err := db.Exec("INSERT INTO counters (countername,countervalue,userid) VALUES(?,?,?)", counter, 0, user.id)
	if err != nil {
		return 0, err
	}
	if id, err := result.LastInsertId(); err != nil {
		return 0, err
	} else {
		return id, nil
	}
}

func GetCounters(userString string) (map[string]int, error) {
	counters := make(map[string]int)
	db, err := ConnectDb()
	defer db.Close()
	if err != nil {
		return map[string]int{}, err
	}

	rows, err := db.Query("select counters.countername, counters.countervalue from users  join counters on users.id = counters.userid where username=?", userString)
	if err != nil {
		return map[string]int{}, err
	}

	for rows.Next() {
		var counter Counter
		if err := rows.Scan(&counter.countername, &counter.countervalue); err != nil {
			return map[string]int{}, err
		}
		counters[counter.countername] = counter.countervalue
	}

	if err := rows.Err(); err != nil {
		return map[string]int{}, err
	}
	return counters, nil
}

func SetCounter(userString, name string, value int) (int64, error) {
	//
	db, err := ConnectDb()
	defer db.Close()
	if err != nil {
		return 0, err
	}

	result, err := db.Exec("update counters join users on counters.userid = users.id set countervalue=? where countername=? and username=?", value, name, userString)
	if err != nil {
		return 0, err
	}
	if _, err := result.LastInsertId(); err != nil {
		return 0, err
	} else {

		return 1, nil
	}
}

func DelCounter(userString, name string) (int64, error) {
	//"asd""a";
	db, err := ConnectDb()
	defer db.Close()
	if err != nil {
		return 0, err
	}

	result, err := db.Exec("delete counters from counters join users on counters.userid = users.id where countername=? and username=?", name, userString)
	if err != nil {
		return 0, err
	}
	if _, err := result.LastInsertId(); err != nil {
		return 0, err
	} else {
		return 1, nil
	}
}
