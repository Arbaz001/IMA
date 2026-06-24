import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from "../api";

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

    axios.post(`${API_URL}/fee/add-fee`, formData, {
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
        <h2 className="text-2xl font-extrabold uppercase tracking-tight mb-6 text-center bg-brutal-green border-[3px] border-black px-4 py-2 shadow-brutal-sm">Collect Fee</h2>
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
            onChange={e => { setAmount(e.target.value) }}
            type='number'
            placeholder="Amount (₹)"
            className="brutal-input"
          />
          <input
            required
            onChange={e => { setRemark(e.target.value) }}
            type='text'
            placeholder="Remark"
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
          <button type="submit" className="brutal-btn-red w-full" disabled={!!isLoading}>
            {isLoading && <i className="fa-solid fa-spinner fa-spin-pulse"></i>}
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFee;
