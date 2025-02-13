import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const Courses = () => {
  const [courses, setCourses] = useState([])

  const navigate = useNavigate()
  useEffect(() => {
    getCourse()
  }, [])

  const getCourse = () => {
    axios.get('http://localhost:4200/course/all-courses', {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-2">
      {courses.length > 0 ? (
        courses.map(course => (
          <div onClick={()=>{navigate('/dashboard/course-detail/'+course._id)}} key={course.id} className="bg-white rounded-2xl  py-1 px-2 border-2 shadow-xl shadow-black cursor-pointer">
            <img src={course.imageUrl} alt={course.title} className="w-full h-40  border-2 border-black  rounded-lg mb-2" />
            <p className="text-base font-bold text-center text-green-600 mb-1">Price: ₹{course.price}</p>
            <p className="text-neutral-800 text-center text-xl mb-2 font-extrabold">{course.courseName}</p>
          </div>
        ))
      ) : (
        <p className="text-center p-[200px] text-3xl font-extrabold w-full col-span-full">No courses available.</p>
      )}
    </div>
  )
}

export default Courses
