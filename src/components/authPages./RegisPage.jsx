import React from "react";
import { useState, useEffect } from "react";
import api from "../../api";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
const Register = () => {
  const navigate = useNavigate();
  // check if user already loged in

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      navigate("/home");  
    }
  }, []);

  const [FormdData, setFormdData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  // console.log(FormdData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/register", FormdData);
      if (response.status === 201) {
        navigate("/home");
      }
      console.log(response);
    } catch (error) {
      toast.error("something went wrong");
      console.error("Error registering", error);
    }
  };

  const handleChange = (e) => {
    setFormdData({
      ...FormdData,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div>
        <Toaster />
      </div>
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Register</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={FormdData.name}
              onChange={handleChange}
              name="name"
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring focus:ring-opacity-50 focus:ring-blue-400"
              placeholder="Enter your name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={FormdData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring focus:ring-opacity-50 focus:ring-blue-400"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={FormdData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring focus:ring-opacity-50 focus:ring-blue-400"
              placeholder="Enter your phone number"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={FormdData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring focus:ring-opacity-50 focus:ring-blue-400"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Register
          </button>
        </form>

        <div className="mt-4 text-center">
          <p>
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
