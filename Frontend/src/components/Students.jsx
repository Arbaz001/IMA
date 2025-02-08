import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const Students = () => {
  const [studentList, setStudentList] = useState()
  const Navigate = useNavigate()

  useEffect(()=>{
    getStudentList()
  })
  const getStudentList = () => {
    axios.get('http://localhost:4200/student/all-students', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        setStudentList(response.data.students)
      })
      .catch((err) => {
        toast.error('Failed to fetch all students')
      })
  }
  return (
    <div>
         <h2 className="text-3xl text-center font-extrabold text-gray-800 mt-5 mb-4">Enrolled Students</h2>
         <table className="w-full text-left border-collapse mt-4">
         <thead>
                <tr className="bg-gray-200">
                  <th className="border-b font-extrabold p-3 text-red-600">Student's Pic</th>
                  <th className="border-b font-extrabold p-3 text-red-600">Student Name</th>
                  <th className="border-b font-extrabold p-3 text-red-600">Phone</th>
                  <th className="border-b font-extrabold p-3 text-red-600">Email</th>
                  <th className="border-b font-extrabold p-3 text-red-600">Address</th>
                </tr>
          </thead>
          <tbody>
            {studentList && studentList.map((student) => (
              <tr onClick={()=>{Navigate('/dashboard/student-detail/'+student._id)}} key={student._id} className='hover:bg-gray-100'>
                <td className="border-b px-4 py-3">
                  <img src={student.imageUrl} alt="Student Pic" className="w-12 h-12 rounded-full object-cover border" />
                </td>
                <td className="border-b font-bold p-2">{student.fullName}</td>
                <td className="border-b font-bold p-2">{student.phone}</td>
                <td className="border-b font-bold p-2">{student.email}</td>
                <td className="border-b font-bold p-2">{student.address}</td>
              </tr>
            ))}
          </tbody>
         </table>
    </div>
  )
}

export default Students