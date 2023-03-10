import React, { useState } from "react";
import useAuth from "../../CustomHooks/useAuth";

function Counter(prop) {
  const [value, setValue] = useState(prop.counterValue);
  const name = prop.counterName;
  const { Session } = useAuth();
  const userLang = navigator.language || navigator.userLanguage;

  function counterHandler(value) {
    fetch("https://countersgo-backend.onrender.com/setcounter", {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, value: Number(value) }),
    })
      .then((data) => data.json())
      .then((data) => data.id);
    Session();
  }

  function delCounterHandler() {
    fetch("https://countersgo-backend.onrender.com/delcounter", {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, value: 0 }),
    })
      .then((data) => data.json())
      .then(() => {
        prop.setReload((state) => !state);
      });
    Session();
  }

  return (
    <li className={`flex mt-2 px-2`}>
      <div className={"mx-1 flex-1 text-left px-2 rounded-xl bg-stone-300"}>
        {name}
      </div>
      <form className="m-0 flex-none" >
        <input
          className="w-20 rounded-xl px-2 text-left"
          min={0}
          max={10000}
          type="number"
          value={value <= 10000 ? value : 10000}
          onChange={(e) => {
              counterHandler(e.currentTarget.value);
              setValue(e.currentTarget.value);
              e.preventDefault();
          }}
        ></input>
      </form>
      <button
        className="mx-1 flex-none bg-stone-400 hover:bg-stone-300 transition-all rounded-xl px-2"
        onClick={delCounterHandler}
      >
        {userLang === "es-ES" ? "Borrar" : "Del"}
      </button>
    </li>
  );
}
export default Counter;
