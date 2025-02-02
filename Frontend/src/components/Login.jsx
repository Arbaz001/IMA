// components/Login.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Login() {
  return (
    <main className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section */}
      <div className="w-full lg:w-1/2 bg-[#6C63FF] p-8 flex flex-col items-center justify-center text-white">
        <div className="max-w-md text-center">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20(11)-K7TiqSe85FNRVAZlbDmQ38rXA4NniV.png"
            alt="Books Illustration"
            className="mx-auto mb-8 w-[200px] h-[200px]"
          />
          <h1 className="text-3xl font-bold mb-2">Institute Management App</h1>
          <p className="text-yellow-300">Manage Your All data in Easy Way...</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 p-8 flex items-center justify-center">
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-bold mb-8 text-center">Login With Your Account</h2>
          <form className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter password"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-[#FF4E62] hover:bg-[#ff3a51] text-white py-2 px-4 rounded-md transition-colors"
            >
              Submit
            </button>
          </form>
          <p className="mt-4 text-center text-sm">
            Don't have an account?{" "}
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