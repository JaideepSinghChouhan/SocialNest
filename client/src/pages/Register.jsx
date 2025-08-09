import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      console.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <form onSubmit={handleRegister} className="w-96 p-6 bg-gray-800 rounded shadow-md">
        <h2 className="text-2xl mb-4 font-bold">Register</h2>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full mb-3 p-2 rounded bg-gray-700"
          onChange={handleChange}
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="w-full mb-3 p-2 rounded bg-gray-700"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full mb-3 p-2 rounded bg-gray-700"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full mb-3 p-2 rounded bg-gray-700"
          onChange={handleChange}
        />
        <button className="bg-green-500 hover:bg-green-600 w-full py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
