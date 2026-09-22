import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [inputdata, setInputdata] = useState({});
  const [image, setImage] = useState(null); // Track image file

  const handleInput = (e) => {
    setInputdata({
      ...inputdata,
      [e.target.id]: e.target.value,
    });
  };

  const selectgender = (selected) => {
    setInputdata((prev) => ({
      ...prev,
      gender: selected === inputdata.gender ? "" : selected,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Fixing the password validation issue
    if (inputdata.password !== inputdata.conformpassword) {
      setLoading(false);
      return toast.error("Password Doesn't Match");
    }

    try {
      const formData = new FormData();

      // Append form fields (excluding confirm password)
      Object.entries(inputdata).forEach(([key, value]) => {
        if (key !== "conformpassword") {
          formData.append(key, value);
        }
      });

      // Append image (if provided)
      if (image) {
        formData.append("profilePic", image); // Ensure this matches the backend field name
      }

      // Send form data to the server
      const register = await axios.post("/api/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = register.data;

      if (data.success === false) {
        setLoading(false);
        return toast.error(data.message);
      }

      toast.success(data.message);
      localStorage.setItem("chatapp", JSON.stringify(data));
      setAuthUser(data);
      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-300 px-4 py-10">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto p-8 rounded-3xl shadow-2xl bg-white/30 backdrop-blur-lg border border-white/40 transition-all duration-300 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-transparent">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8 tracking-tight drop-shadow-sm">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-800">
            Join chatss
          </span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input fields */}
          {[
            { id: "fullname", label: "Full Name", type: "text" },
            { id: "username", label: "Username", type: "text" },
            { id: "email", label: "Email", type: "email" },
            { id: "password", label: "Password", type: "password" },
            {
              id: "conformpassword",
              label: "Confirm Password",
              type: "password",
            },
          ].map(({ id, label, type }) => (
            <div key={id}>
              <label
                htmlFor={id}
                className="block mb-1 text-lg font-semibold text-gray-700"
              >
                {label}
              </label>
              <input
                onChange={handleInput}
                id={id}
                type={type}
                placeholder={`Enter your ${label.toLowerCase()}`}
                required
                className="w-full text-gray-600 px-4 py-3 rounded-xl bg-white bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
              />
            </div>
          ))}

          {/* Gender selection */}
          <div className="flex items-center gap-6 pt-2">
            <span className="font-semibold text-gray-700">Gender:</span>
            {["male", "female"].map((gender) => (
              <label
                key={gender}
                className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all ${
                  inputdata.gender === gender
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white/80 text-gray-700 hover:bg-blue-100"
                }`}
              >
                <input
                  type="radio"
                  name="gender"
                  className="hidden"
                  onChange={() => selectgender(gender)}
                  checked={inputdata.gender === gender}
                />
                {gender.charAt(0).toUpperCase() + gender.slice(1)}
              </label>
            ))}
          </div>

          {/* Profile Image Upload */}
          <div>
            <label className="block mb-1 text-lg font-semibold text-gray-700">
              Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full text-gray-600 px-4 py-3 rounded-xl bg-white bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 bg-gradient-to-r from-blue-700 to-indigo-700 text-white font-bold rounded-xl shadow-md hover:scale-105 transition-transform duration-300 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
