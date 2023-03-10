function useToken() {
  return async function (user = "", password = "") {
    return fetch("https://countersgo-backend.onrender.com/login", {
      method: "POST",
        mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user, password }),
    }).then((data) => data.json());
  };
}
export default useToken;
