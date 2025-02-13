// components/Signup.jsx
import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Lottie from "lottie-react";
import Logo from "../assets/Logo";


function Signup() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
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

    axios.post('http://localhost:4200/user/signup', formData)
      .then(res => {
        setLoading(false)
        toast.success('Your Account Is Created')
        navigate('/login')
        console.log(res)
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
          <h2 className="text-2xl font-extrabold mb-8 text-center">Create Your Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="institute" className="block text-sm font-medium">
                Institute Full Name
              </label>
              <input
                required
                onChange={e => { setFullName(e.target.value) }}
                type='text'
                id="institute"
                placeholder="Enter institute name"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                required
                onChange={e => { setEmail(e.target.value) }}
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium">
                Phone
              </label>
              <input
                required
                onChange={e => { setPhone(e.target.value) }}
                id="phone"
                type="tel"
                placeholder="Enter phone number"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                required
                onChange={e => { setPassword(e.target.value) }}
                id="password"
                type="password"
                placeholder="Create password"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="file" className="block text-sm font-medium">
                Upload File
              </label>
              <input
                required
                onChange={filehandler}
                id="file"
                type="file"
                className="w-full cursor-pointer"
              />
              {imageUrl && <img className='h-40' alt='your logo' src={imageUrl} />}
            </div>

            <button
              type="submit"
              className={`w-full font-extrabold flex items-center justify-center gap-2 bg-[#FF4E62] hover:bg-[#ff3a51] active:bg-[#e6344a] focus:ring-4 focus:ring-[#ff9aa3] text-white py-2 px-4 rounded-lg shadow-md transition-all duration-300 ${isLoading ? 'cursor-not-allowed opacity-75' : ''
                }`}
              disabled={isLoading}
            >
              {isLoading && <i className="fa-solid fa-spinner fa-spin-pulse mr-2"></i>}
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>

          </form>
          <p className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-[#6C63FF] hover:underline">
              Login With Your Account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Signup;