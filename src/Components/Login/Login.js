import { useState, useEffect } from "react";
import useAuth from "../../CustomHooks/useAuth";
import { useNavigate } from "react-router-dom";

function Login() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [checkpass, setCheckPass] = useState("");
  const [register, setRegister] = useState(false);
  const { token, Register, Login, Session } = useAuth();
  const navigate = useNavigate();

  const userLang = navigator.language || navigator.userLanguage;

  useEffect(() => {
    Session();
    //eslint-disable-next-line
  }, []);

  if (token.open === "true") {
    navigate("/dashboard");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (pass === checkpass || !register) {
      register ? Register(user, pass) : Login(user, pass);
      setUser("");
      setPass("");
      setCheckPass("");
    }
  }

  const repeatPass = (
    <label className="m-5 mx-auto">
      <p className="mt-5 mb-2 font-bold">
        {checkpass === ""
          ? "Repeat Password"
          : pass === checkpass
          ? "Password Ok"
          : "Password are not equal!"}
      </p>
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
      <h2 className="text-2xl font-bold flex-1">
        {register ? (
          <div>
            <p>{userLang === "es-ES" ? "Registrese" : "Register"}</p>
            <p className="text-sm font-normal text-stone-600">
              {userLang === "es-ES"
                ? "para crear su cuenta"
                : "to create a new account"}
            </p>
          </div>
        ) : (
          <div>
            <p>{userLang === "es-ES" ? "Por Favor Acceda" : "Please LogIn"}</p>
            <p className="text-sm font-normal text-stone-600">
              {userLang === "es-ES"
                ? "si tiene una cuenta"
                : "if you have an account"}
            </p>
          </div>
        )}
      </h2>
      <div className="text-red-800 font-medium">
        {/user/i.test(token.message) ? token.message : " "}
      </div>
      <form
        className="w-80 mx-auto my-5 py-5 border-4 border-stone-400 rounded-xl"
        onSubmit={handleSubmit}
      >
        <label>
          <p className="mb-2 font-bold">
            {userLang === "es-ES" ? "Usuario" : "Username"}
          </p>
          <input
            className="text-center rounded-xl p-2"
            type="text"
            placeholder={userLang === "es-ES" ? "Usuario" : "Enter user"}
            value={user}
            maxLength={32}
            onChange={(e) => setUser(e.target.value)}
            required
          />
        </label>
        <label>
          <p className="mt-5 mb-2 font-bold">
            {userLang === "es-ES" ? "Contraseña" : "Password"}
          </p>
          <input
            className="text-center rounded-xl p-2"
            type="password"
            placeholder={userLang === "es-ES" ? "Contraseña" : "Password"}
            value={pass}
            maxLength={256}
            onChange={(e) => setPass(e.target.value)}
            required
          />
        </label>
        {register && pass !== "" ? repeatPass : ""}
        <div>
          <button
            className="bg-sky-700 hover:bg-sky-900 border-4 border-sky-700 hover:border-sky-900 transition-all font-bold text-stone-200 p-2 m-5 rounded-xl"
            disabled={register ? pass !== checkpass || pass === "" : false}
            type="submit"
          >
            {register
              ? userLang === "es-ES"
                ? "Registrar"
                : "Register"
              : userLang === "es-ES"
              ? "Acceder"
              : "LogIn"}
          </button>
        </div>
      </form>
      <p className="text-sm font-normal text-stone-600">
        {userLang === "es-ES" ? "o" : "or"}
      </p>
      <button
        className="border-4 border-stone-400 hover:bg-stone-400 transition-all font-bold text-stone-800 p-2 rounded-xl"
        onClick={() => setRegister((r) => !r)}
      >
        {register
          ? userLang === "es-ES"
            ? "Acceder"
            : "LogIn"
          : userLang === "es-ES"
          ? "Registrar"
          : "Register"}
      </button>
      <p>
        {register ? (
          <p className="text-sm font-normal text-stone-600">
            {userLang === "es-ES"
              ? "si tiene una cuenta"
              : "if you have an account"}
          </p>
        ) : (
          <p className="text-sm font-normal text-stone-600">
            {userLang === "es-ES"
              ? "para crear su cuenta"
              : "to create a new account"}
          </p>
        )}
      </p>
    </div>
  );
}

export default Login;
