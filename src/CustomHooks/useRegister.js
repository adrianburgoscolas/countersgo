function useRegister() {
  return async function (user = "", password = "") {
    return fetch("https://countersgo-backend.onrender.com/register", {
      method: "POST",
        mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user, password }),
    }).then((data) => data.json());
  };
}
export default useRegister;
