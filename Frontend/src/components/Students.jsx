import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const Students = () => {
  const [studentList, setStudentList] = useState()

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
         <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-4">Enrolled Students</h2>
         <table className="w-full text-left border-collapse mt-4">
         <thead>
                <tr className="bg-gray-200">
                  <th className="border-b p-3 text-red-600">Student's Pic</th>
                  <th className="border-b p-3 text-red-600">Student Name</th>
                  <th className="border-b p-3 text-red-600">Phone</th>
                  <th className="border-b p-3 text-red-600">Email</th>
                  <th className="border-b p-3 text-red-600">Address</th>
                </tr>
          </thead>
          <tbody>
            {studentList && studentList.map((student) => (
              <tr key={student._id} className='hover:bg-gray-100'>
                <td className="border-b px-4 py-3">
                  <img src={student.imageUrl} alt="Student Pic" className="h-12 w-12 rounded-full border-2 border-purple-500" />
                </td>
                <td className="border-b p-3">{student.fullName}</td>
                <td className="border-b p-3">{student.phone}</td>
                <td className="border-b p-3">{student.email}</td>
                <td className="border-b p-3">{student.address}</td>
              </tr>
            ))}
          </tbody>
         </table>
    </div>
  )
}

export default Students