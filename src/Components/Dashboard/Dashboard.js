import { useEffect, useState } from "react";
import useToken from "../../CustomHooks/useToken";
import Counter from "../Counter/Counter";

function Dashboard(prop) {

    const loginUser = useToken();
    const [newCounter, setNewCounter] = useState("");
    const [handleAddCounter, setHandleAddCounter] = useState()
    const [counters, setCounters] = useState({});
    // const [countersList, setCountersList] = useState([])
    // const [delCounter, setDelCounter] = useState();
    const [reload, setReload] = useState(true)

    useEffect(()=>{
        (async ()=>{
            const tkn = await loginUser();
            prop.setTkn((s)=>{ return {...s, open: tkn.open}});
        })();
    // eslint-disable-next-line
    },[])

    //add counter
     useEffect(()=>{
        if(handleAddCounter){
            fetch("/addcounter", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({name: newCounter})
            })
            .then(data => data.json())
            .then(data => {
                if(data.id) {
                    setCounters(state => { return{...state,[newCounter]: 0} })
                }
            });
            setNewCounter("")
            handleAddCounter.preventDefault();
        }
    }, [handleAddCounter]);

    useEffect(()=>{
        setCounters({})
        fetch("/getcounters")
        .then(data => data.json())
        .then(data => setCounters(data));
    }, [reload]);

    const list = Object.keys(counters).map((key, i) => {
        return <Counter key={i} counterName={key} counterValue={counters[key]} setReload={setReload} />
    }); 

    return (
        <>
            <h2>Dashboard</h2>
            <div>
                <form onSubmit={e => setHandleAddCounter(e)}>
                    <input placeholder="New counter name" value={newCounter} onChange={e => setNewCounter(e.currentTarget.value)}>
                    </input>
                    <button type="submit">Add counter</button>
                </form>
                <ul>{list}</ul>
            </div>
        </>
    );
}
export default Dashboard;