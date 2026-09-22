import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./login/Login";
import Register from "./register/Register";
import Home from "./home/Home";
import { VerifyUser } from "./utils/VerifyUser";

function App() {
  return (
    <>
      <div className="w-screen min-h-screen flex items-center justify-center p-2">
        <Routes>
          {/* Redirect from root to /register */}
          {/* <Route path="/register" element={<Navigate to="/register" />} /> */}

          {/* Public routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} />

          {/* Protected route */}
          <Route element={<VerifyUser />}>
            <Route path="/home" element={<Home />} />
          </Route>
        </Routes>
        <ToastContainer position="top-right" autoClose={5000} />
      </div>
    </>
  );
}

export default App;
