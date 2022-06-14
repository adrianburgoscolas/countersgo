function useToken() {
    return async function(user = "", password = "") {
        return fetch("/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({user, password}),
        }).then((data) => data.json());
    }
}
export default useToken;