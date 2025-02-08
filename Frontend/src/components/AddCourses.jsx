import React, { useState } from 'react';
import { toast } from 'react-toastify'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddCourses = () => {
  const [courseName, setCourseName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [startingDate, setStartingDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [image, setImage] = useState(null)

  const [imageUrl, setImageUrl] = useState('')
  const [isLoading, setIsLoading] = useState('')

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData()
    formData.append('courseName', courseName)
    formData.append('description', description)
    formData.append('price', price)
    formData.append('startingDate', startingDate)
    formData.append('endDate', endDate)
    formData.append('image', image)

    axios.post('http://localhost:4200/course/add-course', formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    })
      .then(res => {
        setIsLoading(false)
        console.log(res.data)
        toast.success('Course Added Successfully')
        navigate('/dashboard/all-courses')
      })
      .catch(err => {
        setIsLoading(false)
        console.log(err)
        toast.error('Failed to Add Course')
      })
  }

  const filehandler = (e) => {
    setImage(e.target.files[0])
    setImageUrl(URL.createObjectURL(e.target.files[0]))
  }

  return (
    <div className="w-full font-bold flex items-center justify-center  bg-gray-50 py-2 px-10">
      <div className="w-full max-w-[600px] p-[1rem] md:p-8 bg-white rounded-xl shadow-lg shadow-slate-500 transform hover transition-all duration-300">
        <h2 className="text-xl md:text-2xl font-extrabold mb-4 md:mb-6 text-center">Add New Course</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2 md:space-y-4">
          <input
            required
            onChange={e => { setCourseName(e.target.value) }}
            type="text"
            placeholder="Course Name"
            className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none text-sm md:text-base"
          />
          <textarea
            required
            onChange={e => { setDescription(e.target.value) }}
            placeholder="Description"
            className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none resize-none h-20 md:h-24 text-sm md:text-base"
          />
          <input
            required
            onChange={e => { setPrice(e.target.value) }}
            type="price"
            placeholder="Price"
            className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none text-sm md:text-base"
          />
          <input
            required
            onChange={e => { setStartingDate(e.target.value) }}
            type="text"
            placeholder="Starting Date (DD-MM-YY)"
            className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none text-sm md:text-base"
          />
          <input
            required
            onChange={e => { setEndDate(e.target.value) }}
            type="text"
            placeholder="End Date (DD-MM-YY)"
            className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none text-sm md:text-base"
          />
          <div className="relative">
            <input
              required
              onChange={filehandler}
              type="file"
              className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none file:mr-3 md:file:mr-4 file:py-1.5 md:file:py-2 file:px-3 md:file:px-4 file:rounded-full file:border-0 file:text-xs md:file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 text-sm md:text-base"
            />
          </div>
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Course Image"
              className="w-[200px] h-[150px] object-cover rounded-lg mx-auto md:w-[200px]"
            />
          )}

          <button
            type="submit"
            className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 active:bg-red-700 transition-all duration-200 transform hover:scale-[0.98] text-sm md:text-base font-medium"
          >
            {isLoading && <i className="fa-solid fa-spinner fa-spin-pulse mr-2"></i>}
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCourses;
