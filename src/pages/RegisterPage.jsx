import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    if (!minLength) errors.push("Password must be at least 8 characters");
    if (!hasUpperCase) errors.push("Password must contain an uppercase letter");
    if (!hasNumber) errors.push("Password must contain a number");
    if (!hasSpecialChar)
      errors.push("Password must contain a special character");

    return {
      isValid: minLength && hasUpperCase && hasNumber && hasSpecialChar,
      errors: errors,
    };
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");

    if (e.target.name === "password") {
      const validation = validatePassword(e.target.value);
      if (!validation.isValid) {
        setError(validation.errors.join("\n"));
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = formData;

    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    if (!validatePassword(password).isValid) {
      setError("Password must be 8+ chars, include 1 uppercase & 1 number.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await axios.post("http://localhost:3000/api/register", {
        name,
        email,
        password,
      });

      setSuccess("Registration successful!");
      setFormData({ name: "", email: "", password: "" });
      navigate("/checkmail");
    } catch (err) {
      console.log(err);
      const errorMsg = err.response?.data?.message;
      if (errorMsg.includes("duplicate key")) {
        return setError(
          "Email already exist!. \n Try again with different Email or log in to exixting account",
        );
      }
      setError(errorMsg || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-dark-primary text-dark-text px-4 py-10'>
      <div className='w-full max-w-md bg-dark-secondary rounded-xl shadow-lg p-8'>
        <h2 className='text-2xl font-bold  mb-6 text-center'>
          Register to <span className='text-dark-accent'> MovieSquare</span>{" "}
        </h2>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Name */}
          <div>
            <label className='block text-dark-text mb-1'>Name</label>
            <input
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
              placeholder='Enter your name'
              className='w-full px-4 py-2 rounded-lg bg-dark-primary text-dark-text border border-dark-accent focus:outline-none focus:ring-2 focus:ring-[#F05454]'
            />
          </div>

          {/* Email */}
          <div>
            <label className='block text-dark-text mb-1'>Email</label>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='Enter your email'
              className='w-full px-4 py-2 rounded-lg bg-dark-primary text-dark-text border border-dark-accent focus:outline-none focus:ring-2 focus:ring-[#F05454]'
            />
          </div>

          {/* Password */}
          <div>
            <label className='block text-dark-text mb-1'>Password</label>
            <div className='relative'>
              <input
                type={showPassword ? "text" : "password"}
                name='password'
                value={formData.password}
                onChange={handleChange}
                placeholder='Enter your password'
                className='w-full px-4 py-2 rounded-lg bg-dark-primary text-dark-text border border-dark-accent focus:outline-none focus:ring-2 focus:ring-[#F05454]'
              />
              <button
                type='button'
                onClick={togglePasswordVisibility}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-dark-accent'
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Error or Success */}
          {error && (
            <p className='text-sm whitespace-pre-line text-red-500'>{error}</p>
          )}
          {success && <p className='text-sm text-green-400'>{success}</p>}

          {/* Submit */}
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-dark-accent cursor-pointer text-dark-text font-semibold py-2 rounded-lg hover:bg-dark-accent/80 transition duration-300 disabled:opacity-50'
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
