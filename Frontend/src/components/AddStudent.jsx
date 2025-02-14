import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

    axios.post('https://ima-fp5f.onrender.com/student/add-student', formData, {
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
    axios.get('https://ima-fp5f.onrender.com/course/all-courses', {
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
    <div className="w-full font-bold flex items-center justify-center  bg-gray-50 py-2 px-10">
      <div className="w-full max-w-[600px] p-[1rem] md:p-8 bg-white rounded-xl shadow-lg shadow-slate-500 transform hover transition-all duration-300">
        <h2 className="text-xl md:text-2xl font-extrabold mb-4 md:mb-6 text-center">Add New Student</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2 md:space-y-4">
          <input
            required
            onChange={e => { setFullName(e.target.value) }}
            type="text"
            placeholder="Student name"
            className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none text-sm md:text-base"
          />
          <input
            required
            onChange={e => { setPhone(e.target.value) }}
            type='tel'
            placeholder="Phone number"
            className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none text-sm md:text-base"
          />
          <input
            required
            onChange={e => { setEmail(e.target.value) }}
            type='email'
            placeholder="Student email"
            className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none text-sm md:text-base"
          />
          <input
            required
            onChange={e => { setAddress(e.target.value) }}
            type='address'
            placeholder="Student address"
            className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none text-sm md:text-base"
          />

          <select
            required
            onChange={e => { setCourse(e.target.value) }}
            className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none text-sm md:text-base">
            <option>Select Course</option>
            {courseList.map(course => (
              <option key={course._id} value={course._id}>
                {course.courseName}
              </option>
            ))}
          </select>


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

export default AddStudent;
