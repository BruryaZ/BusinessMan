import { useContext } from "react";
import { globalContext } from "../context/GlobalContext";

const Home = () => {
  const globalContextDetails = useContext(globalContext);
  return (
    <div>
      <h1>Home page</h1>
      <h2>Hello {globalContextDetails.user.firstName} {globalContextDetails.user.lastName}</h2>
    </div>
  )
}

export default Home
