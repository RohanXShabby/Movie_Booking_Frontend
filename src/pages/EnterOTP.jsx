import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EnterOTP = () => {
  const [otp, setOtp] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mail, setMail] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length <= 4 && /^[0-9]*$/.test(value)) {
      setOtp(value);
      setError("");
      setSuccess("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 4) {
      setError("Please enter a valid 4-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const email = sessionStorage.getItem("email");
      if (!email) {
        setError("Email not found in session. Please log in again.");
        setLoading(false);
        return;
      }
      setMail(email);

      const res = await axios.post("http://localhost:3000/api/verify-otp", {
        otp,
        email,
      });
      navigate("/password-reset");
      setSuccess("OTP Verified Successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-dark-primary text-dark-text px-4 py-10'>
      <div className='w-full max-w-md bg-dark-secondary rounded-xl shadow-lg p-8'>
        <h2 className='text-2xl font-bold mb-6 text-center'>
          <span className='text-dark-accent'>OTP</span> Verification
        </h2>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* OTP Input */}
          <div>
            <label className='block text-dark-text mb-1'>Enter OTP</label>
            <input
              type='text'
              maxLength={4}
              value={otp}
              onChange={handleChange}
              placeholder='Enter 4-digit OTP'
              className='w-full px-4 py-2 rounded-lg bg-dark-primary text-dark-text border border-dark-accent focus:outline-none focus:ring-2 focus:ring-dark-accent text-center'
            />
          </div>

          {/* Error/Success Messages */}
          {error && <p className='text-sm text-red-500'>{error}</p>}
          {success && <p className='text-sm text-green-400'>{success}</p>}

          {/* Submit Button */}
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-[#F05454] text-dark-text font-semibold py-2 rounded-lg hover:bg-[#d94343] transition duration-300 disabled:opacity-50'
          >
            {loading ? "Verifying OTP..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EnterOTP;
