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
    <div className="space-y-6">
      {course ? (
        <>
          <div className="brutal-card p-5 animate-pop">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="relative shrink-0">
                <img
                  src={imageFile ? URL.createObjectURL(imageFile) : course.imageUrl}
                  alt={course.courseName}
                  className="w-full md:w-96 h-56 object-cover border-[3px] border-black shadow-brutal"
                />
                {isEditing && (
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-extrabold uppercase tracking-tight mb-3">
                  {isEditing ? (
                    <input type="text" name="courseName" value={editedCourse.courseName} onChange={handleInputChange} className="brutal-input" />
                  ) : (
                    course.courseName
                  )}
                </h1>
                <div className="space-y-2 font-bold">
                  <p className="flex items-center gap-2">Price:{" "}
                    {isEditing ? (
                      <input type="number" name="price" value={editedCourse.price} onChange={handleInputChange} className="brutal-input max-w-[160px]" />
                    ) : (
                      <span className="brutal-chip bg-brutal-green">₹{course.price}</span>
                    )}
                  </p>
                  <p>Starting Date:{" "}
                    {isEditing ? (
                      <input type="date" name="startingDate" value={editedCourse.startingDate} onChange={handleInputChange} className="brutal-input max-w-[200px] inline-block" />
                    ) : (
                      course.startingDate
                    )}
                  </p>
                  <p>End Date:{" "}
                    {isEditing ? (
                      <input type="date" name="endDate" value={editedCourse.endDate} onChange={handleInputChange} className="brutal-input max-w-[200px] inline-block" />
                    ) : (
                      course.endDate
                    )}
                  </p>
                  <div className="pt-2 leading-relaxed text-neutral-700">
                    {isEditing ? (
                      <textarea name="description" value={editedCourse.description} onChange={handleInputChange} className="brutal-input h-24 resize-none" />
                    ) : (
                      course.description
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-row md:flex-col gap-3 shrink-0">
                {isEditing ? (
                  <button onClick={handleUpdate} className="brutal-btn-green">Save</button>
                ) : (
                  <button onClick={handleEditToggle} className="brutal-btn-yellow">Edit Course</button>
                )}
                <button onClick={handleDelete} className="brutal-btn-red">Delete Course</button>
              </div>
            </div>
          </div>

          <h2 className="brutal-title !text-2xl">Enrolled Students</h2>

          {studentList.length === 0 ? (
            <div className="brutal-card p-10 text-center">
              <p className="text-xl font-extrabold uppercase tracking-wide">🎓 No Students Enrolled Yet</p>
              <p className="text-sm font-bold opacity-60 mt-2">Students will appear here once enrolled.</p>
            </div>
          ) : (
            <div className="brutal-card overflow-x-auto">
              <table className="brutal-table">
                <thead>
                  <tr>
                    <th>Pic</th>
                    <th>Student Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {studentList.map((student) => (
                    <tr onClick={() => { navigate('/dashboard/student-detail/' + student._id) }} key={student._id} className="brutal-row">
                      <td>
                        <img src={student.imageUrl} alt={student.fullName} className="w-12 h-12 object-cover border-[3px] border-black" />
                      </td>
                      <td>{student.fullName}</td>
                      <td>{student.phone}</td>
                      <td className="lowercase">{student.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center h-[60vh]">
          <p className="brutal-card bg-brutal-yellow px-8 py-6 text-xl font-extrabold uppercase tracking-widest">Loading course details...</p>
        </div>
      )}
    </div>
  )
}

export default CourseDetail
