import { useContext } from "react";
import { AuthContext } from "../Components/AuthProvider/AuthProvider";

function useAuth(){
    return useContext(AuthContext);
}

export default useAuth;