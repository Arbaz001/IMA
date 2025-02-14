import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

const StudentDetail = () => {
    const Navigate = useNavigate()
    const [student, setStudent] = useState({})
    const [paymentList, setPaymentList] = useState([])
    const [isEditing, setIsEditing] = useState(false)
    const [editedStudent, setEditedStudent] = useState({})
    const [imageFile, setImageFile] = useState(null)
    const [course, setCourse] = useState({})

    const params = useParams()

    useEffect(() => {
        getStudentDetail()
    }, [])

    const getStudentDetail = () => {
        axios
            .get(`http://localhost:4200/student/student-detail/${params.id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            .then((response) => {
                setStudent(response.data.studentDetail || {})
                setEditedStudent(response.data.studentDetail || {})
                setPaymentList(response.data.feeDetail || [])
                setCourse(response.data.courseDetail || {})
            })
            .catch(() => {
                toast.error('Failed to fetch student details')
            })
    }

    const handleEditToggle = () => {
        setIsEditing(!isEditing)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setEditedStudent((prev) => ({ ...prev, [name]: value }))
    }

    const handleUpdate = () => {
        axios
            .put(`http://localhost:4200/student/${params.id}`, editedStudent, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            .then(() => {
                toast.success('Student details updated successfully')
                setIsEditing(false)
                getStudentDetail()
            })
            .catch(() => {
                toast.error('Failed to update student details')
            })
    }

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            axios
                .delete(`http://localhost:4200/student/${params.id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                })
                .then(() => {
                    toast.success('Student deleted successfully')
                    Navigate('/dashboard/all-students')
                })
                .catch(() => {
                    toast.error('Failed to delete student')
                })
        }
    }

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0])
    }

    return (
        <div className="flex-1 bg-gray-100 w-full min-h-screen p-0">
            {student ? (
                <div className="bg-white p-4">
                    <div className="flex gap-6">
                        <div className="relative">
                            <img
                                src={imageFile ? URL.createObjectURL(imageFile) : student.imageUrl}
                                alt={student.fullName || "Student Image"}
                                className="w-56 h-56 object-cover rounded-full shadow-xl shadow-slate-600"
                            />
                            {isEditing && (
                                <input
                                    type="file"
                                    onChange={handleImageChange}
                                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            )}
                        </div>
                        <div className="ml-5 mt-7">
                            <h1 className="text-3xl font-extrabold mb-1 text-blue-700">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={editedStudent.fullName || ""}
                                        onChange={handleInputChange}
                                        className="border pl-3 text-balance font-extrabold rounded"
                                    />
                                ) : (
                                    student.fullName || "N/A"
                                )}
                            </h1>
                            <p className="font-bold text-gray-700 mb-1">
                                Phone: {isEditing ? (
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={editedStudent.phone || ""}
                                        onChange={handleInputChange}
                                        className="border p-1 rounded"
                                    />
                                ) : (
                                    student.phone || "N/A"
                                )}
                            </p>
                            <p className="font-bold text-gray-700 mb-1">
                                Address: {isEditing ? (
                                    <input
                                        type="text"
                                        name="address"
                                        value={editedStudent.address || ""}
                                        onChange={handleInputChange}
                                        className="border p-1 rounded"
                                    />
                                ) : (
                                    student.address || "N/A"
                                )}
                            </p>
                            <p className="font-bold text-gray-700 mb-1">
                                Email: {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={editedStudent.email || ""}
                                        onChange={handleInputChange}
                                        className="border p-1 rounded"
                                    />
                                ) : (
                                    student.email || "N/A"
                                )}
                            </p>
                            <p
                                onClick={() => Navigate('/dashboard/course-detail/' + (course._id || ""))}
                                className="font-extrabold text-gray-700 mb-1 cursor-pointer"
                            >
                                Course: {course.courseName || "N/A"}
                            </p>
                        </div>
                        <div className="ml-40 mt-12">
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
                                        Edit Student
                                    </button>
                                )}
                                <button
                                    onClick={handleDelete}
                                    className="bg-red-500 font-bold text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                >
                                    Delete Student
                                </button>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-2xl text-center font-extrabold text-gray-800 mt-5 mb-4">Payment History</h2>

                    {paymentList.length === 0 ? (
                        <div className="text-center mt-10">
                            <p className="text-xl text-gray-500">🎓 No Student fee Submitted</p>
                            <p className="text-md text-gray-400 mt-2">Students will Submit fees.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse mt-4">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border-b p-3 text-red-600">Date</th>
                                    <th className="border-b p-3 text-red-600">Amount</th>
                                    <th className="border-b p-3 text-red-600">Remark</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paymentList.map((payment) => (
                                    <tr key={payment._id} className="hover:bg-gray-100">
                                        <td className="p-3 text-gray-700">{new Date(payment.createdAt).toLocaleDateString()} {/* ✅ Date Formatting */}</td>
                                        <td className="p-3 font-medium text-gray-800">{payment.amount}</td>
                                        <td className="p-3 text-gray-700">{payment.remark}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            ) : (
                <div className="flex items-center justify-center h-screen">
                    <p className="text-xl text-gray-600">Loading Student details...</p>
                </div>
            )}
        </div>
    )
}

export default StudentDetail
