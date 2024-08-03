import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginFailed from "./pages/LoginFailed";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginRoutes />} />
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
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
