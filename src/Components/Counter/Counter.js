import React, { useEffect, useState } from "react";

function Counter(prop) {
    const [value, setValue] = useState(prop.counterValue);
    const [name, setName] = useState(prop.counterName);
    const [counterHandler, setCounterHandler] = useState();
    const [delCounterHandler, setDelCounterHandler] = useState();
    
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
                console.log(data)
                prop.setReload(state => !state);
            });
            console.log("del")
            
        }
    },[delCounterHandler]);

    return (
        <li>
            {name}
            <form onChange={e => setCounterHandler(e)}>
                <input min={0} max={1000} type="number" value={value} onChange={e => setValue(e.currentTarget.value)} ></input>
            </form>
            <button onClick={e => setDelCounterHandler(e)}>Del</button>
        </li>
    );
}
export default Counter;