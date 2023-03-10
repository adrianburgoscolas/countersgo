import { useEffect, useState } from "react";
import Counter from "../Counter/Counter";
import useAuth from "../../CustomHooks/useAuth";

function Dashboard() {
  const [newCounter, setNewCounter] = useState("");
  const [counters, setCounters] = useState({});
  const [reload, setReload] = useState(true);
  const { auth, Session } = useAuth();
  const userLang = navigator.language || navigator.userLanguage;

  //add counter
  function handleAddCounter(e) {
    fetch("https://countersgo-backend.onrender.com/addcounter", {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCounter }),
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.id) {
          setCounters((state) => {
            return { ...state, [newCounter]: 0 };
          });
        }
      });
    setNewCounter("");
    e.preventDefault();
    Session();
  }

  //get counters
  useEffect(() => {
    setCounters({});
    fetch("https://countersgo-backend.onrender.com/getcounters", {
      mode: "cors",
      credentials: "include"
    })
      .then((data) => data.json())
      .then((data) =>
        data.open === "false" ? setCounters({}) : setCounters(data)
      );
    Session();
    //eslint-disable-next-line
  }, [reload]);

  const list = Object.keys(counters).map((key, i) => {
    return (
      <Counter
        key={i}
        counterName={key}
        counterValue={counters[key]}
        setReload={setReload}
      />
    );
  });

  return (
    <dir className="p-0 m-0">
      <header>
        <h2 className="text-2xl font-bold mt-2">
          {auth.open === "true" ? auth.message : ""}
        </h2>
        <p className="text-xl font-medium">
          {userLang === "es-ES" ? "Panel" : "Dashboard"}
        </p>
      </header>

      <div>
        <form onSubmit={handleAddCounter}>
          <input
            className="w-52 px-2 rounded-xl"
            maxLength={12}
            placeholder={
              userLang === "es-ES" ? "Nombre de contador" : "Counter's name"
            }
            value={newCounter}
            onChange={(e) => setNewCounter(e.currentTarget.value)}
          ></input>
          <button
            className="mt-1 bg-stone-400 hover:bg-stone-300 transition-all rounded-xl px-2 mx-2"
            type="submit"
          >
            {userLang === "es-ES" ? "Añadir contador" : "Add counter"}
          </button>
        </form>
        <ul className="mx-auto md:w-[40rem]">{list}</ul>
      </div>
    </dir>
  );
}
export default Dashboard;
