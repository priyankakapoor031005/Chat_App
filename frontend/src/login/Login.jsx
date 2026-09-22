import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();

  const { setAuthUser } = useAuth();

  const [userInput, setUserInput] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    setUserInput({
      ...userInput,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/login", userInput);
      const data = response.data;

      if (data.success === false) {
        setLoading(false);
        console.log("Login failed:", data.message);
      }
      toast.success(data.message);
      localStorage.setItem("chatapp", JSON.stringify(data));
      setAuthUser(data);
      setLoading(false);
      navigate("/home");
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div className="min-h-[600px] flex items-center justify-center  p-4">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white/30 backdrop-blur-lg border bg-gradient-to-br from-blue-100 via-white to-blue-300 border-white/40 transition-all duration-300">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6 tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-800">
            Lax's App
          </span>
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-lg font-semibold text-gray-700"
            >
              Email
            </label>
            <input
              onChange={handleInput}
              id="email"
              type="email"
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 text-gray-600 rounded-xl bg-white bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-lg font-semibold text-gray-700"
            >
              Password
            </label>
            <input
              onChange={handleInput}
              id="password"
              type="password"
              placeholder="Enter your password"
              required
              className="w-full text-gray-600 px-4 py-3 rounded-xl bg-white bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
            />
          </div>
          {loading && (
            <div className="text-center text-blue-700 font-semibold">
              Loading...
            </div>
          )}
          <button
            type="submit"
            className="w-full py-3 mt-2 bg-gradient-to-r from-blue-700 to-indigo-700 text-white font-bold rounded-xl shadow-md hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-700 font-medium">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-700 font-bold hover:underline"
          >
            Register Now
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
