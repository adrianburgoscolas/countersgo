import { useEffect, useState } from "react";
import Counter from "../Counter/Counter";
import useAuth from "../../CustomHooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";

function Dashboard() {
  // const loginUser = useToken();
  let location = useLocation();
  const [newCounter, setNewCounter] = useState("");
  const [handleAddCounter, setHandleAddCounter] = useState();
  const [counters, setCounters] = useState({});
  const [reload, setReload] = useState(true);
  const { token, Session } = useAuth();

  // useEffect(()=>{
  //     (async ()=>{
  //         const tkn = await loginUser();
  //         prop.setTkn((s)=>{ return {...s, open: tkn.open}});
  //     })();
  // // eslint-disable-next-line
  // },[])

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
        <p className="text-xl font-medium">Dashboard</p>
      </header>

      <div>
        <form onSubmit={(e) => setHandleAddCounter(e)}>
          <input
            className="w-52 px-2 rounded-xl"
            maxLength={14}
            placeholder="New counter name"
            value={newCounter}
            onChange={(e) => setNewCounter(e.currentTarget.value)}
          ></input>
          <button
            className="bg-stone-400 hover:bg-stone-300 transition-all rounded-xl px-2 mx-2"
            type="submit"
          >
            Add counter
          </button>
        </form>
        <ul className="mx-auto md:w-[40rem]">{list}</ul>
      </div>
    </dir>
  );
}
export default Dashboard;
