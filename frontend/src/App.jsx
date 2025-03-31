import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ForgotPass, Login, Signup, ResetPassword, Logout } from "./components/authentication";

import Home from "./components/messaging/Home.jsx";


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/forgot-password" element={<ForgotPass />} />
          <Route
            path="/reset-password/:resetToken"
            element={<ResetPassword />}
          />
          
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
