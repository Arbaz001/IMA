import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { API_URL } from "../api";

const CourseDetail = () => {
  const params = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [studentList, setStudentList] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [editedCourse, setEditedCourse] = useState({})
  const [imageFile, setImageFile] = useState(null)

  useEffect(() => {
    getCourseDetail()
  }, [params.id])

  const getCourseDetail = () => {
    axios
      .get(`${API_URL}/course/course-detail/${params.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        setCourse(response.data.course)
        setEditedCourse(response.data.course)
        setStudentList(response.data.studentList)
      })
      .catch((err) => {
        console.log(err)
        toast.error('Failed to fetch course details')
      })
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedCourse({ ...editedCourse, [name]: value })
  }

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0])
  }

  const handleUpdate = () => {
    const formData = new FormData()
    for (const key in editedCourse) {
      formData.append(key, editedCourse[key])
    }
    if (imageFile) {
      formData.append('image', imageFile)
    }

    axios
      .put(`${API_URL}/course/${params.id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        toast.success('Course updated successfully')
        setIsEditing(false)
        getCourseDetail()
      })
      .catch((err) => {
        toast.error('Failed to update course')
      })
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      axios
        .delete(`${API_URL}/course/${params.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then(() => {
          toast.success('Course deleted successfully')
          navigate('/dashboard/all-courses')
        })
        .catch((err) => {
          toast.error('Failed to delete course')
        })
    }
  }

  return (
    <div className="flex-1 bg-gray-100 w-full min-h-screen p-0">
      {course ? (
        <div className="bg-white p-4">
          <div className="flex gap-6">
            <div className="relative">
              <img
                src={imageFile ? URL.createObjectURL(imageFile) : course.imageUrl}
                alt={course.courseName}
                className="w-96 h-56 object-cover rounded-xl  border-2 border-black shadow-black shadow-lg"
              />
              {isEditing && (
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                />
              )}
            </div>
            <div className='ml-7 mb-2'>
            <h1 className="text-3xl font-bold mb-3 text-blue-700">
                {isEditing ? (
                  <input
                    type="text"
                    name="courseName"
                    value={editedCourse.courseName}
                    onChange={handleInputChange}
                    className="border p-2 rounded w-full"
                  />
                ) : (
                  course.courseName
                )}
              </h1>
              <p className="text-gray-700 font-bold mb-2 text-lg">
                Price: ₹{isEditing ? (
                  <input
                    type="number"
                    name="price"
                    value={editedCourse.price}
                    onChange={handleInputChange}
                    className="border p-1 rounded"
                  />
                ) : (
                  course.price
                )}
              </p>
              <p className="text-gray-700 font-bold mb-2 text-lg">
                Starting Date: {isEditing ? (
                  <input
                    type="date"
                    name="startingDate"
                    value={editedCourse.startingDate}
                    onChange={handleInputChange}
                    className="border p-1 rounded"
                  />
                ) : (
                  course.startingDate
                )}
              </p>
              <p className="text-gray-700 font-bold mb-2 text-lg">
                End Date: {isEditing ? (
                  <input
                    type="date"
                    name="endDate"
                    value={editedCourse.endDate}
                    onChange={handleInputChange}
                    className="border p-1 rounded"
                  />
                ) : (
                  course.endDate
                )}
              </p>
              <p className="text-gray-600 font-bold mt-4 leading-relaxed text-lg">
                {isEditing ? (
                  <textarea
                    name="description"
                    value={editedCourse.description}
                    onChange={handleInputChange}
                    className="border p-2 w-full rounded"
                  />
                ) : (
                  course.description
                )}
              </p>
            </div>
            <div className='ml-40'>
            <div className="space-x-2">
              {isEditing ? (
                <button
                  onClick={handleUpdate}
                  className="bg-green-500 font-bold text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={handleEditToggle}
                  className="bg-yellow-500 font-bold text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                >
                  Edit Course
                </button>
              )}
              <button
                onClick={handleDelete}
                className="bg-red-500 font-bold text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Delete Course
              </button>
            </div>
            </div>
          </div>

          <h2 className="text-2xl font-extrabold  text-gray-800 mt-8 mb-4">Enrolled Students..</h2>

          {studentList.length === 0 ? (
            <div className="text-center mt-10">
              <p className="text-xl font-extrabold text-gray-500">🎓 No Students Enrolled Yet!</p>
              <p className="text-md font-bold text-gray-400 mt-2">Students will appear here once enrolled.</p>
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
                {studentList.map((student) => (
                  <tr onClick={()=>{navigate('/dashboard/student-detail/'+student._id)}}  key={student._id} className="hover:bg-gray-100 cursor-pointer">
                    <td className="p-3">
                      <img
                        src={student.imageUrl}
                        alt={student.fullName}
                        className="w-12 h-12 rounded-full object-cover border"
                      />
                    </td>
                    <td className="p-3 font-extrabold text-gray-800">{student.fullName}</td>
                    <td className="p-3 font-extrabold text-gray-700">{student.phone}</td>
                    <td className="p-3 font-extrabold text-gray-700">{student.email}</td>
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
