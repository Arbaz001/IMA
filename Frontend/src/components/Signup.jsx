// components/Signup.jsx
import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Lottie from "lottie-react";
import { Eye, EyeOff } from "lucide-react";
import Logo from "../assets/Logo";
import { API_URL } from "../api";


function Signup() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [image, setImage] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [isLoading, setLoading] = useState(false)

  const navigate = useNavigate()


  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData()
    formData.append('fullName', fullName)
    formData.append('email', email)
    formData.append('phone', phone)
    formData.append('password', password)
    formData.append('image', image)

    axios.post(`${API_URL}/user/signup`, formData)
      .then(res => {
        setLoading(false)
        toast.success('Your Account Is Created')
        navigate('/login')
      })
      .catch(err => {
        setLoading(false)
        toast.error('Failed to signup')
        console.log(err)
      })
  }

  const filehandler = (e) => {
    setImage(e.target.files[0])
    setImageUrl(URL.createObjectURL(e.target.files[0]))
  }

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
            Create Your Account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="institute" className="brutal-label">Institute Full Name</label>
              <input
                required
                onChange={e => { setFullName(e.target.value) }}
                type='text'
                id="institute"
                placeholder="Enter institute name"
                className="brutal-input"
              />
            </div>
            <div>
              <label htmlFor="email" className="brutal-label">Email</label>
              <input
                required
                onChange={e => { setEmail(e.target.value) }}
                id="email"
                type="email"
                placeholder="Enter your email"
                className="brutal-input"
              />
            </div>
            <div>
              <label htmlFor="phone" className="brutal-label">Phone</label>
              <input
                required
                onChange={e => { setPhone(e.target.value) }}
                id="phone"
                type="tel"
                placeholder="Enter phone number"
                className="brutal-input"
              />
            </div>
            <div>
              <label htmlFor="password" className="brutal-label">Password</label>
              <div className="relative">
                <input
                  required
                  onChange={e => { setPassword(e.target.value) }}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password"
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
            <div>
              <label htmlFor="file" className="brutal-label">Upload Logo</label>
              <input
                required
                onChange={filehandler}
                id="file"
                type="file"
                className="brutal-input cursor-pointer file:mr-3 file:border-2 file:border-black file:bg-brutal-yellow file:font-extrabold file:uppercase file:text-xs file:px-3 file:py-1 file:cursor-pointer"
              />
              {imageUrl && <img className='h-40 mt-3 border-2 border-black shadow-brutal-sm' alt='your logo' src={imageUrl} />}
            </div>

            <button type="submit" className="brutal-btn-red w-full" disabled={isLoading}>
              {isLoading && <i className="fa-solid fa-spinner fa-spin-pulse"></i>}
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </form>
          <p className="mt-5 text-center text-sm font-bold">
            Already have an account?{" "}
            <Link to="/login" className="underline decoration-[3px] decoration-brutal-blue underline-offset-2 hover:bg-brutal-yellow">
              Login With Your Account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Signup;