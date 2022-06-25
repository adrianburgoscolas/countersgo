import { useEffect } from "react";
import useAuth from "../../CustomHooks/useAuth";

function Preferences() {
  const { token, Session } = useAuth();
  const userLang = navigator.language || navigator.userLanguage;

  useEffect(() => {
    Session();
  }, []);

  return (
    <>
      <h2 className="text-2xl mt-2 font-bold">
        {userLang === "es-ES" ? "Preferencias" : "Preferences"}
      </h2>
      <p>
        {userLang === "es-ES" ? "Contenido protegido!" : "Protected Content!"}
      </p>
    </>
  );
}

export default Preferences;
