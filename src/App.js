import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes} from "react-router-dom" 
import "./App.css";

import Dashboard from "./Components/Dashboard/Dashboard"
import Prefences from "./Components/Preferences/Preferences"
import Layout from "./Components/Layout/Layout";
import NoPage from "./Components/NoPage/NoPage";
import Login from "./Components/Login/Login";
import useToken from "./CustomHooks/useToken";
import useLogout from "./CustomHooks/useLogout";



function App() {

  // const [sessionData, setSessionData] = useState({user: ""})
  const [session, setSession] = useState({open: "false"})
  const loginUser = useToken()
  const logout = useLogout()

  useEffect(()=>{
      (async ()=>{
          const tkn = await loginUser();
          setSession(tkn)
          // setSessionData({user: tkn.message})
      })();
  },[])

  async function handleLogout() {
    const tkn = await logout();
    setSession(tkn)
  }

  if(session.open === "false") {
    if(/user|pass/i.test(session.message)){
      let alertText = /Error 1062: Duplicate entry/i.test(session.message)?"User already exist!":session.message
      alert("Error, " + alertText)
    }
    
    return <Login setTkn={setSession} />
  }
  return (
    <div className="App">
      <div className="logout" onClick={handleLogout}>Logout</div>
      <h1>
        <div>Pro Counter</div>
        <div>Hi "{session.message}"</div>
      </h1>
     <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard setTkn={setSession}/>} />
            <Route path="preferences" element={<Prefences />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
