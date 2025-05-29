import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axiosInstance from "../Services/axiosInstance";
import { useAuth } from "../context/AuthContext";

const LoginPage = ({ className }) => {
  const { refreshAuth } = useAuth();

  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    } try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.post("/userlogin", {
        email: formData.email,
        password: formData.password
      });


      if (response.data && response.data.token) {
        const token = response.data.token;
        localStorage.setItem('token', token);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        setSuccess("Login successful!");
        await refreshAuth(); // Refresh auth context
        navigate("/account");
      } else {
        throw new Error('No token received from server');
      }
    } catch (err) {
      console.error('Login error:', err); // Debug log
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex items-center justify-center bg-dark-primary text-dark-text px-4 py-10 ${className}`}>
      <div className='w-full max-w-md bg-dark-secondary rounded-xl shadow-lg p-8'>
        <h2 className='text-2xl font-bold  mb-6 text-center'>
          Login to <span className='text-dark-accent'> MovieSquare</span>
        </h2>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Email */}
          <div>
            <label className='block text-dark-text mb-1'>Email</label>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='Enter your email'
              className='w-full px-4 py-2 rounded-lg bg-dark-primary text-dark-text border border-dark-accent focus:outline-none focus:ring-2 focus:ring-dark-accent'
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
                autoComplete="on"
                placeholder='Enter your password'
                className='w-full px-4 py-2 rounded-lg bg-dark-primary text-dark-text border border-dark-accent focus:outline-none focus:ring-2 focus:ring-dark-accent'
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

          {/* Error/Success */}
          <div>
            <Link to='/emailforotp'>Forget Password?</Link>
            {error && <p className='text-sm text-red-500'>{error}</p>}
            {success && <p className='text-sm text-green-400'>{success}</p>}
          </div>
          {/* Submit */}
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-[#F05454] text-dark-text font-semibold py-2 rounded-lg hover:bg-[#d94343] transition duration-300 disabled:opacity-50'
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
