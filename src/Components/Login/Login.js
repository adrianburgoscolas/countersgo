import { useState, useEffect } from "react";
import useAuth from "../../CustomHooks/useAuth";
import { useNavigate } from "react-router-dom";


function Login() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [checkpass, setCheckPass] = useState("");
  const [register, setRegister] = useState(false);
  const {token, Register, Login, Session} = useAuth();
  const navigate = useNavigate()

  useEffect(()=>{
    Session()
  },[]);

  if(token.open === "true"){
    navigate("/dashboard")
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (pass === checkpass || !register) {
      register
        ? Register(user, pass)
        : Login(user, pass);
      setUser("");
      setPass("");
      setCheckPass("");
    }
  }

  const repeatPass = (
    <label className="m-5 mx-auto">
      <p className="mt-5 mb-2 font-bold">{checkpass === ""?"Repeat Password":pass === checkpass?"Password Ok":"Password are not equal!"}</p>
      <input
        className="text-center rounded-xl m-auto p-2"
        type="password"
        placeholder="Repeat password"
        value={checkpass}
        maxLength={64}
        onChange={(e) => setCheckPass(e.target.value)}
        required
      />
    </label>
  );

  return (
    <div className="text-center text-stone-800 bg-stone-200">
        <h2 className="text-2xl font-bold flex-1">{register ? "Register" : "Please LogIn"}</h2>
        <div className="text-red-800 font-medium">{/user/i.test(token.message)?token.message:" "}</div>
      <form className="w-80 mx-auto my-5 py-5 border-4 border-stone-300 rounded-xl" onSubmit={handleSubmit}>
        <label>
          <p className="mb-2 font-bold">Username</p>
          <input
            className="text-center rounded-xl p-2"
            type="text"
            placeholder="Enter user"
            value={user}
            maxLength={32}
            onChange={(e) => setUser(e.target.value)}
            required
          />
        </label>
        <label>
          <p className="mt-5 mb-2 font-bold">Password</p>
          <input
            className="text-center rounded-xl p-2"
            type="password"
            placeholder="Enter password"
            value={pass}
            maxLength={256}
            onChange={(e) => setPass(e.target.value)}
            required
          />
        </label>
        {register && pass !== "" ? repeatPass : ""}
        <div>
          <button className="bg-sky-700 hover:bg-sky-800 transition-all font-bold text-stone-200 p-2 m-5 rounded-xl" disabled={register?pass !== checkpass || pass === "":false} type="submit">
          {register ? "Register" : "LogIn"}
          </button>
        </div>
      </form>
      <button className=" hover:text-stone-600 transition-all font-bold text-stone-800 p-2 rounded-xl" onClick={() => setRegister((r) => !r)}>
        {register ? "Login" : "Register"}
      </button>
      
    </div>
  );
}

export default Login;
