import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const CourseDetail = () => {
  const params = useParams()
  const [course, setCourse] = useState(null)
  const [studentList, setStudentList] = useState([])

  useEffect(() => {
    getCourseDetail()
  }, [])

  const getCourseDetail = () => {
    axios
      .get(`http://localhost:4200/course/course-detail/${params.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        setCourse(response.data.course)
        setStudentList(response.data.studentList)
      })
      .catch((err) => {
        toast.error('Failed to fetch course details')
      })
  }

  return (
    <div className="flex-1 bg-gray-100 w-full min-h-screen p-0">
      {course ? (
        <div className="bg-white p-4">
          <div className="flex gap-6">
            <img
              src={course.imageUrl}
              alt={course.courseName}
              className="w-96 h-56 object-cover rounded-xl shadow-sm"
            />
            <div>
              <h1 className="text-3xl font-bold text-blue-700 mb-2">{course.courseName}</h1>
              <p className="text-gray-700 mb-1 text-lg">Price: ₹{course.price}</p>
              <p className="text-gray-700 mb-1">Starting Date: {course.startingDate}</p>
              <p className="text-gray-700 mb-1">End Date: {course.endDate}</p>
              <p className="text-gray-600 mt-4 leading-relaxed">{course.description}</p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-4">Enrolled Students</h2>

          {studentList.length === 0 ? (
            <div className="text-center mt-10">
              <p className="text-xl text-gray-500">🎓 No Students Enrolled Yet!</p>
              <p className="text-md text-gray-400 mt-2">Students will appear here once enrolled.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse mt-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border-b p-3 text-red-600">Student's Pic</th>
                  <th className="border-b p-3 text-red-600">Student Name</th>
                  <th className="border-b p-3 text-red-600">Phone</th>
                  <th className="border-b p-3 text-red-600">Email</th>
                </tr>
              </thead>
              <tbody>
                {studentList.map((student, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="p-3">
                      <img
                        src={student.imageUrl}
                        alt={student.fullName}
                        className="w-12 h-12 rounded-full object-cover border"
                      />
                    </td>
                    <td className="p-3 font-medium text-gray-800">{student.fullName}</td>
                    <td className="p-3 text-gray-700">{student.phone}</td>
                    <td className="p-3 text-gray-700">{student.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <p className="text-xl text-gray-600">Loading course details...</p>
        </div>
      )}
    </div>
  )
}

export default CourseDetail
