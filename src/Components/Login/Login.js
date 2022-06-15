import { useState } from "react";
import useToken from "../../CustomHooks/useToken";
import useRegister from "../../CustomHooks/useRegister";

function Login(prop) {
  const loginUser = useToken();
  const registerUser = useRegister();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [checkpass, setCheckPass] = useState("");
  const [register, setRegister] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (pass === checkpass || !register) {
      const tkn = register
        ? await registerUser(user, pass)
        : await loginUser(user, pass);
      setUser("");
      setPass("");
      setCheckPass("");
      prop.setTkn(tkn);
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
    <div className="text-center text-stone-800 py-10 bg-stone-200 min-h-screen">
      <h1 className="text-3xl font-bold">Pro Counter Ultra Max</h1>
      
      <h2 className="text-2xl font-bold">{register ? "Register" : "Please Log In"}</h2>
      <form className="m-5 p-5" onSubmit={handleSubmit}>
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
            maxLength={64}
            onChange={(e) => setPass(e.target.value)}
            required
          />
        </label>
        {register && pass !== "" ? repeatPass : ""}
        <div>
          <button className="bg-sky-600 hover:bg-sky-700 font-bold text-stone-200 p-2 m-5 rounded-xl" disabled={register?pass !== checkpass || pass === "":false} type="submit">
            Submit
          </button>
        </div>
      </form>
      <button className="bg-sky-600 hover:bg-sky-700 font-bold text-stone-200 p-2 rounded-xl" onClick={() => setRegister((r) => !r)}>
        {register ? "Login" : "Register"}
      </button>
      <footer className="text-xs absolute left-0 right-0 bottom-10">By <a className="text-indigo-700" href="https://adrianburgoscolas.github.io/portfolio/" target='_blank' rel='noopener noreferrer'>Adrian Burgos</a></footer>
    </div>
  );
}

export default Login;
