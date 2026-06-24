import React, { useState } from 'react';
import { toast } from 'react-toastify'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from "../api";
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

    axios.post(`${API_URL}/course/add-course`, formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    })
      .then(res => {
        setIsLoading(false)
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
    <div className="w-full flex items-start justify-center py-2">
      <div className="w-full max-w-[600px] brutal-card p-5 md:p-8 animate-pop">
        <h2 className="text-2xl font-extrabold uppercase tracking-tight mb-6 text-center bg-brutal-yellow border-2 border-black px-4 py-2 shadow-brutal-sm">Add New Course</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            required
            onChange={e => { setCourseName(e.target.value) }}
            type="text"
            placeholder="Course Name"
            className="brutal-input"
          />
          <textarea
            required
            onChange={e => { setDescription(e.target.value) }}
            placeholder="Description"
            className="brutal-input resize-none h-24"
          />
          <input
            required
            onChange={e => { setPrice(e.target.value) }}
            type="number"
            placeholder="Price"
            className="brutal-input"
          />
          <input
            required
            onChange={e => { setStartingDate(e.target.value) }}
            type="text"
            placeholder="Starting Date (DD-MM-YY)"
            className="brutal-input"
          />
          <input
            required
            onChange={e => { setEndDate(e.target.value) }}
            type="text"
            placeholder="End Date (DD-MM-YY)"
            className="brutal-input"
          />
          <input
            required
            onChange={filehandler}
            type="file"
            className="brutal-input cursor-pointer file:mr-3 file:border-2 file:border-black file:bg-brutal-yellow file:font-extrabold file:uppercase file:text-xs file:px-3 file:py-1 file:cursor-pointer"
          />
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Course"
              className="w-[200px] h-[150px] object-cover border-2 border-black shadow-brutal-sm mx-auto"
            />
          )}

          <button type="submit" className="brutal-btn-red w-full" disabled={!!isLoading}>
            {isLoading && <i className="fa-solid fa-spinner fa-spin-pulse"></i>}
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCourses;
