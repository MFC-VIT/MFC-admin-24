import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginFailed from "./pages/LoginFailed";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import {ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Users from "./pages/Users";

function App() {
  return (
    <>
    <ToastContainer/>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginRoutes />} />
        <Route path="/home" element={<Home />} />
        <Route path="/users" element={<Users/>}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

const LoginRoutes = () => (
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/failed" element={<LoginFailed />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default App;
