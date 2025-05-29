import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PasswordReset = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate()

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid: minLength && hasUpperCase && hasNumber && hasSpecialChar,
      errors: {
        minLength: !minLength ? "Password must be at least 8 characters" : "",
        hasUpperCase: !hasUpperCase
          ? "Password must contain an uppercase letter"
          : "",
        hasNumber: !hasNumber ? "Password must contain a number" : "",
        hasSpecialChar: !hasSpecialChar
          ? "Password must contain a special character"
          : "",
      },
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "newPassword") {
      const validation = validatePassword(value);
      if (!validation.isValid) {
        const errors = Object.values(validation.errors).filter(
          (error) => error !== "",
        );
        setError(errors.join("\n"));
      } else {
        setError("");
      }
    } else if (name === "confirmPassword") {
      if (value !== formData.newPassword) {
        setError("Passwords do not match!");
      } else {
        setError("");
      }
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    const email = sessionStorage.getItem("email");
    const { newPassword, confirmPassword } = formData;

    if (!email || !newPassword) {
      setError("Email or password is missing!");
      return;
    }

    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      const errors = Object.values(validation.errors).filter(
        (error) => error !== "",
      );
      setError(errors.join("\n"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await axios.post(
        "http://localhost:3000/api/password-reset",
        {
          email,
          newPassword,
        },
      );
      setSuccess("Password reset successful!");
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-dark-primary text-dark-text'>
      <div className='w-full max-w-md p-6 bg-dark-secondary rounded-lg shadow-md'>
        <h2 className='text-2xl font-bold text-center text-dark-text mb-6'>
          Reset Your <span className='text-dark-accent'>Password</span>
        </h2>
        <form onSubmit={handlePasswordReset} className='space-y-4'>
          <div>
            <label
              htmlFor='newPassword'
              className='block text-sm font-medium text-dark-text'
            >
              New Password
            </label>
            <div className='relative'>
              <input
                type={showPassword.new ? "text" : "password"}
                id='newPassword'
                name='newPassword'
                value={formData.newPassword}
                onChange={handleChange}
                required
                className='w-full mt-1 px-4 py-2 border border-dark-accent rounded-md shadow-sm focus:ring-dark-accent outline-none bg-dark-primary'
              />
              <button
                type='button'
                onClick={() => togglePasswordVisibility("new")}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-dark-accent'
              >
                {showPassword.new ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div>
            <label
              htmlFor='confirmPassword'
              className='block text-sm font-medium text-dark-text'
            >
              Confirm Password
            </label>
            <div className='relative'>
              <input
                type={showPassword.confirm ? "text" : "password"}
                id='confirmPassword'
                name='confirmPassword'
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className='w-full mt-1 px-4 py-2 border border-dark-accent rounded-md shadow-sm focus:ring-dark-accent outline-none bg-dark-primary'
              />
              <button
                type='button'
                onClick={() => togglePasswordVisibility("confirm")}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-dark-accent'
              >
                {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          {error && <p className='text-red-500 text-sm whitespace-pre-line'>{error}</p>}
          {success && <p className='text-green-500 text-sm'>{success}</p>}
          <button
            type='submit'
            disabled={loading}
            className='w-full px-4 py-2 text-white bg-dark-accent rounded-md hover:bg-dark-accent/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
