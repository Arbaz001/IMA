// components/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Lottie from "lottie-react";
import { Eye, EyeOff } from "lucide-react";
import Logo from "../assets/Logo";
import { API_URL } from '../api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await axios.post(`${API_URL}/user/login`, {
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
      <div className="w-full lg:w-1/2 bg-brutal-blue p-8 flex flex-col items-center justify-center text-white border-b-2 lg:border-b-0 lg:border-r-2 border-black">
        <div className="max-w-md text-center">
          <div className="bg-white border-2 border-black shadow-brutal-lg p-4">
            <Lottie animationData={Logo} loop={true} />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight mt-6">
            Institute Management App
          </h1>
          <p className="inline-block bg-brutal-yellow text-black border-2 border-black px-3 py-1 font-extrabold uppercase text-sm tracking-wide mt-4 shadow-brutal-sm">
            Manage all your data the easy way
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 p-6 md:p-8 flex items-center justify-center">
        <div className="max-w-md w-full brutal-card p-6 md:p-8 animate-pop">
          <h2 className="text-2xl font-extrabold uppercase tracking-tight mb-6 text-center">
            Login To Your Account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="brutal-label">Email</label>
              <input
                required
                onChange={handleEmailChange}
                id="email"
                type="email"
                placeholder="Enter your email"
                className="brutal-input"
              />
            </div>
            <div>
              <label htmlFor="password" className="brutal-label">Password</label>
              <div className="relative">
                <input
                  required
                  onChange={handlePasswordChange}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  className="brutal-input pr-14"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-brutal-yellow border-2 border-black shadow-brutal-xs hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-150"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" className="brutal-btn-red w-full" disabled={isLoading}>
              {isLoading && <i className="fa-solid fa-spinner fa-spin-pulse"></i>}
              {isLoading ? "Logging In..." : "Login"}
            </button>
          </form>
          <p className="mt-5 text-center text-sm font-bold">
            Don't have an account?{" "}
            <Link to="/" className="underline decoration-[3px] decoration-brutal-blue underline-offset-2 hover:bg-brutal-yellow">
              Create Your Account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Login; 
