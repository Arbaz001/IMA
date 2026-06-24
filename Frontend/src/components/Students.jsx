import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { API_URL } from "../api";

const Students = () => {
  const [studentList, setStudentList] = useState()
  const Navigate = useNavigate()

  useEffect(()=>{
    getStudentList()
  }, [])
  const getStudentList = () => {
    axios.get(`${API_URL}/student/all-students`, {
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
    <div className="space-y-6">
      <h1 className="brutal-title">Enrolled Students</h1>
      <div className="brutal-card overflow-x-auto">
        <table className="brutal-table">
          <thead>
            <tr>
              <th>Pic</th>
              <th>Student Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {studentList && studentList.length > 0 ? (
              studentList.map((student) => (
                <tr onClick={() => { Navigate('/dashboard/student-detail/' + student._id) }} key={student._id} className="brutal-row">
                  <td>
                    <img src={student.imageUrl} alt="Student Pic" className="w-12 h-12 object-cover border-[3px] border-black" />
                  </td>
                  <td>{student.fullName}</td>
                  <td>{student.phone}</td>
                  <td className="lowercase">{student.email}</td>
                  <td>{student.address}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-8 uppercase tracking-widest opacity-60">No students found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Students