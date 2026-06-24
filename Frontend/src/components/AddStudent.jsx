import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from "../api";

const AddStudent = () => {
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [course, setCourse] = useState('')
  const [image, setImage] = useState(null)

  //------------------------------------------------//
  const [courseList, setCourseList] = useState([])
  //------------------------------------------------//  

  const [imageUrl, setImageUrl] = useState('')
  const [isLoading, setIsLoading] = useState('')

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData()
    formData.append('fullName', fullName)
    formData.append('phone', phone)
    formData.append('email', email)
    formData.append('address', address)
    formData.append('courseId', course)
    formData.append('image', image)

    axios.post(`${API_URL}/student/add-student`, formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    })
      .then(res => {
        setIsLoading(false)
        toast.success('Student Added Successfully')
        navigate('/dashboard/all-students')
      })
      .catch(err => {
        setIsLoading(false)
        console.log(err)
        toast.error('Failed to Add Student')
      })
  }

  const filehandler = (e) => {
    setImage(e.target.files[0])
    setImageUrl(URL.createObjectURL(e.target.files[0]))
  }

  //---------------------------------------------------------//
  useEffect(() => {
    getCourse()
  }, [])

  const getCourse = () => {
    axios.get(`${API_URL}/course/all-courses`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    })
      .then(response => {
        setCourseList(response.data.courses)
      })
      .catch(err => {
        console.log(err)
        toast.error('Failed to fetch courses')
      })
  }
  //---------------------------------------------------------//



  return (
    <div className="w-full flex items-start justify-center py-2">
      <div className="w-full max-w-[600px] brutal-card p-5 md:p-8 animate-pop">
        <h2 className="text-2xl font-extrabold uppercase tracking-tight mb-6 text-center bg-brutal-pink border-[3px] border-black px-4 py-2 shadow-brutal-sm">Add New Student</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            required
            onChange={e => { setFullName(e.target.value) }}
            type="text"
            placeholder="Student name"
            className="brutal-input"
          />
          <input
            required
            onChange={e => { setPhone(e.target.value) }}
            type='tel'
            placeholder="Phone number"
            className="brutal-input"
          />
          <input
            required
            onChange={e => { setEmail(e.target.value) }}
            type='email'
            placeholder="Student email"
            className="brutal-input"
          />
          <input
            required
            onChange={e => { setAddress(e.target.value) }}
            type='text'
            placeholder="Student address"
            className="brutal-input"
          />

          <select
            required
            onChange={e => { setCourse(e.target.value) }}
            className="brutal-input cursor-pointer">
            <option>Select Course</option>
            {courseList.map(course => (
              <option key={course._id} value={course._id}>
                {course.courseName}
              </option>
            ))}
          </select>

          <input
            required
            onChange={filehandler}
            type="file"
            className="brutal-input cursor-pointer file:mr-3 file:border-[3px] file:border-black file:bg-brutal-yellow file:font-extrabold file:uppercase file:text-xs file:px-3 file:py-1 file:cursor-pointer"
          />
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Student"
              className="w-[200px] h-[150px] object-cover border-[3px] border-black shadow-brutal-sm mx-auto"
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

export default AddStudent;
