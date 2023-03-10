function useSession() {
  return async function () {
    return fetch("https://countersgo-backend.onrender.com/session", {
      mode: "cors",
      credentials: "include",
    }).then((data) => data.json());
  };
}
export default useSession;

