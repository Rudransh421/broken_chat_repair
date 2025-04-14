import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import conf from "../../config/conf.js";

const Signup = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); // Store error message

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message on new attempt

    try {
      const response = await axios.post(
        `${conf.backendUrl}/user/signup`,
        formData,
        { withCredentials: true }
      );

      if (response.status >= 200 && response.status < 300) {
        navigate("/login");
      }
    } catch (error) {
      if (error.response?.status === 400) {
        setErrorMessage("User already exists. Please log in.");
      } else {
        console.error("Signup failed", error);
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="userName"
          placeholder="Username"
          onChange={handleChange}
          className="border-black p-2 m-2 rounded-lg"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="border-black p-2 m-2 rounded-lg"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="border-black p-2 m-2 rounded-lg"
          required
        />
        <button
          type="submit"
          className="border-black p-2 m-2 bg-green-600 rounded-2xl text-white"
        >
          Signup
        </button>
      </form>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <Link
        to="/login"
        className="text-blue-500 hover:text-amber-800 active:text-red-600"
      >
        Already have an account? Log in
      </Link>
    </>
  );
};

export default Signup;
