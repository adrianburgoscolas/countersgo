import React, { useEffect, useState } from "react";
import useAuth from "../../CustomHooks/useAuth";

function Counter(prop) {
    const [value, setValue] = useState(prop.counterValue);
    const [name, setName] = useState(prop.counterName);
    const [counterHandler, setCounterHandler] = useState();
    const [delCounterHandler, setDelCounterHandler] = useState();
    const { Session } = useAuth();
    
    useEffect(()=>{
        if(counterHandler) {
            
            fetch("/setcounter", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({name, value})
            })
            .then(data => data.json())
            .then(data => data.id);
            counterHandler.preventDefault()
        }
        Session()
    },[counterHandler]);

    //del counter
    useEffect(()=>{
        if(delCounterHandler) {
            fetch("/delcounter",{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({name, value:"0"})
            })
            .then(data => data.json())
            .then(data => {
                prop.setReload(state => !state);
            });
        }
    },[delCounterHandler]);

    return (
        <li className={`flex mt-2 px-2`}>
            <div className={"mx-1 flex-1 text-left px-2 rounded-xl bg-stone-300"}>{name}</div>
            <form className="mx-1 flex-none" onChange={e => setCounterHandler(e)}>
                <input className="w-20 rounded-xl px-2 text-left" min={0} max={10000} type="number" value={value<=10000?value:10000} onChange={e => setValue(e.currentTarget.value)} ></input>
            </form>
            <button className="mx-1 flex-none bg-stone-400 hover:bg-stone-300 transition-all rounded-xl px-2" onClick={e => setDelCounterHandler(e)}>Del</button>
        </li>
    );
}
export default Counter;