import { useEffect, useState } from "react";
import Counter from "../Counter/Counter";
import useAuth from "../../CustomHooks/useAuth";

function Dashboard() {
  const [newCounter, setNewCounter] = useState("");
  const [handleAddCounter, setHandleAddCounter] = useState();
  const [counters, setCounters] = useState({});
  const [reload, setReload] = useState(true);
  const { token, Session } = useAuth();
  const userLang = navigator.language || navigator.userLanguage;

  //add counter
  useEffect(() => {
    if (handleAddCounter) {
      fetch("/addcounter", {
        method: "POST",
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
      handleAddCounter.preventDefault();
      Session();
    }
    // eslint-disable-next-line
  }, [handleAddCounter]);

  useEffect(() => {
    setCounters({});
    fetch("/getcounters")
      .then((data) => data.json())
      .then((data) =>
        data.open === "false" ? setCounters({}) : setCounters(data)
      );
    Session();
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
          {token.open === "true" ? token.message : ""}
        </h2>
        <p className="text-xl font-medium">
          {userLang === "es-ES" ? "Panel" : "Dashboard"}
        </p>
      </header>

      <div>
        <form onSubmit={(e) => setHandleAddCounter(e)}>
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
            className="bg-stone-400 hover:bg-stone-300 transition-all rounded-xl px-2 mx-2"
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
