// components/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Lottie from "lottie-react";
import Logo from "../assets/Logo";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await axios.post('https://ima-fp5f.onrender.com/user/login', {
        email,
        password
      });
      setLoading(false);
      localStorage.setItem('token',res.data.token);
      localStorage.setItem('fullname',res.data.fullName);
      localStorage.setItem('imageurl',res.data.imageUrl);
      localStorage.setItem('imageId',res.data.imageId);
      localStorage.setItem('email',res.data.email);
      localStorage.setItem('token',res.data.token);
      toast.success('Logged In Successfully');
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      toast.error('Invalid Email or Password');
      console.log(err);
    }
  };

  return (
    <main className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section */}
      <div className="w-full lg:w-1/2 bg-[#6C63FF] p-8 flex flex-col items-center justify-center text-white">
        <div className="max-w-md text-center">
        <Lottie animationData={Logo} loop={true}/>
          <h1 className="text-3xl font-extrabold mb-2">Institute Management App</h1>
          <p className="text-yellow-300 font-bold">Manage Your All data in Easy Way...</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 p-8 flex items-center justify-center">
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-extrabold mb-8 text-center">Login With Your Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-bold">
                Email
              </label>
              <input
                required
                onChange={handleEmailChange}
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-bold">
                Password
              </label>
              <input
                required
                onChange={handlePasswordChange}
                id="password"
                type="password"
                placeholder="Enter password"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <button
              type="submit"
              className={`w-full font-extrabold flex items-center justify-center gap-2 bg-[#FF4E62] hover:bg-[#ff3a51] active:bg-[#e6344a] focus:ring-4 focus:ring-[#ff9aa3] text-white py-2 px-4 rounded-lg shadow-md transition-all duration-300 ${isLoading ? 'cursor-not-allowed opacity-75' : ''}`}
              disabled={isLoading}
            >
              {isLoading && <i className="fa-solid fa-spinner fa-spin-pulse mr-2"></i>}
              {isLoading ? 'Logging...' : 'Login'}
            </button>
          </form>
          <p className="mt-4 text-center text-sm font-semibold">
            Don't have an account?{' '}
            <Link to="/" className="text-[#6C63FF] hover:underline">
              Create Your Account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Login; 
