import { useEffect } from "react";
import useAuth from "../../CustomHooks/useAuth";

function Preferences() {
  const { token, Session } = useAuth();

  useEffect(() => {
    Session();
  }, []);

  return (
    <>
      <h2 className="text-2xl mt-2 font-bold">Preferences</h2>
      <p>Protected Content!</p>
    </>
  );
}

export default Preferences;
