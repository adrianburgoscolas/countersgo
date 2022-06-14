import { useState } from "react";
import "./Login.css";
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
    <label>
      <p>{checkpass === ""?"Repeat Password":pass === checkpass?"Password Ok":"Password are not equal!"}</p>
      <input
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
    <div className="login-wrapper">
      <h1>Pro Counter Ultra Max</h1>
      <p className="f">By <a href="https://adrianburgoscolas.github.io/portfolio/" target='_blank' rel='noopener noreferrer'>Adrian Burgos</a></p>
      <h2>{register ? "Register" : "Please Log In"}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input
            type="text"
            placeholder="Enter user"
            value={user}
            maxLength={32}
            onChange={(e) => setUser(e.target.value)}
            required
          />
        </label>
        <label>
          <p>Password</p>
          <input
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
          <button disabled={register?pass !== checkpass || pass === "":false} type="submit">
            Submit
          </button>
        </div>
      </form>
      <div className="register" onClick={() => setRegister((r) => !r)}>
        {register ? "Login" : "Register"}
      </div>
    </div>
  );
}

export default Login;
