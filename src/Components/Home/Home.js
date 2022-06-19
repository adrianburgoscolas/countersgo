import { useEffect } from "react";
import useAuth from "../../CustomHooks/useAuth";
function Home() {
    const { Session } = useAuth();
//     useEffect(()=>{
//       Session()
//   },[]);
    return (
        <h1 className="">Welcome</h1>
    );
}
export default Home;