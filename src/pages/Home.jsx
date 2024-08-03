import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const getUser = async () => {
    try {
      const response = await axios.get("http://localhost:8080/login/success", {
        withCredentials: true,
      });

      console.log("response", response.data);
    } catch (error) {
      navigate("*");
    }
  };
  useEffect(() => {
    getUser();
  }, []);
  return <div>Home</div>;
};

export default Home;
