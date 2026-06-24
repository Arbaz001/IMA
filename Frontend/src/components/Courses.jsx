import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { API_URL } from "../api";
const Courses = () => {
  const [courses, setCourses] = useState([])

  const navigate = useNavigate()
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
        setCourses(response.data.courses)
      })
      .catch(err => {
        console.log(err)
        toast.error('Failed to fetch courses')
      })
  }

  return (
    <div className="space-y-6">
      <h1 className="brutal-title">All Courses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {courses.length > 0 ? (
          courses.map(course => (
            <div
              onClick={() => { navigate('/dashboard/course-detail/' + course._id) }}
              key={course._id}
              className="brutal-card brutal-hover cursor-pointer p-3"
            >
              <img src={course.imageUrl} alt={course.courseName} className="w-full h-40 object-cover border-[3px] border-black mb-3" />
              <p className="text-neutral-900 text-lg mb-2 font-extrabold uppercase tracking-tight leading-tight">{course.courseName}</p>
              <span className="brutal-chip bg-brutal-green">₹{course.price}</span>
            </div>
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center py-32">
            <p className="brutal-card bg-brutal-yellow px-8 py-6 text-2xl font-extrabold uppercase tracking-widest">
              No courses available
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Courses
