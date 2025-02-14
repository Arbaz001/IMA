import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddFee = () => {
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [amount, setAmount] = useState('')
  const [remark, setRemark] = useState('')
  const [course, setCourse] = useState('')

  //------------------------------------------------//
  const [courseList, setCourseList] = useState([])
  //------------------------------------------------//  

  const [isLoading, setIsLoading] = useState('')

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData()
    formData.append('fullName', fullName)
    formData.append('phone', phone)
    formData.append('amount', amount)
    formData.append('remark', remark)
    formData.append('courseId', course)

    axios.post('https://ima-fp5f.onrender.com/fee/add-fee', formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    })
      .then(res => {
        setIsLoading(false)
        toast.success('Student submit fee Successfully')
        navigate('/dashboard/payment-history')
      })
      .catch(err => {
        setIsLoading(false)
        console.log(err)
        toast.error('Failed to submit Submit Student fee')
      })
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
        <h2 className="text-xl md:text-2xl font-extrabold mb-4 md:mb-6 text-center">Collect Fee</h2>
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
            onChange={e => { setAmount(e.target.value) }}
            type='text'
            placeholder="Student Amount"
            className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none text-sm md:text-base"
          />
          <input
            required
            onChange={e => { setRemark(e.target.value) }}
            type='text'
            placeholder="Student Remark"
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

export default AddFee;
