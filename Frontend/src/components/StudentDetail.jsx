import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { API_URL } from "../api";

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
            .get(`${API_URL}/student/student-detail/${params.id}`, {
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
            .put(`${API_URL}/student/${params.id}`, editedStudent, {
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
                .delete(`${API_URL}/student/${params.id}`, {
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
        <div className="space-y-6">
            {student ? (
                <>
                    <div className="brutal-card p-5 animate-pop">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="relative shrink-0 mx-auto md:mx-0">
                                <img
                                    src={imageFile ? URL.createObjectURL(imageFile) : student.imageUrl}
                                    alt={student.fullName || "Student Image"}
                                    className="w-48 h-48 object-cover border-2 border-black shadow-brutal"
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
                                        <input type="text" name="fullName" value={editedStudent.fullName || ""} onChange={handleInputChange} className="brutal-input" />
                                    ) : (
                                        student.fullName || "N/A"
                                    )}
                                </h1>
                                <div className="space-y-2 font-bold">
                                    <p>Phone: {isEditing ? (
                                        <input type="tel" name="phone" value={editedStudent.phone || ""} onChange={handleInputChange} className="brutal-input max-w-[200px] inline-block" />
                                    ) : (student.phone || "N/A")}</p>
                                    <p>Address: {isEditing ? (
                                        <input type="text" name="address" value={editedStudent.address || ""} onChange={handleInputChange} className="brutal-input max-w-[260px] inline-block" />
                                    ) : (student.address || "N/A")}</p>
                                    <p>Email: {isEditing ? (
                                        <input type="email" name="email" value={editedStudent.email || ""} onChange={handleInputChange} className="brutal-input max-w-[260px] inline-block" />
                                    ) : (student.email || "N/A")}</p>
                                    <p>Course:{" "}
                                        <span
                                            onClick={() => Navigate('/dashboard/course-detail/' + (course._id || ""))}
                                            className="brutal-chip bg-brutal-sky cursor-pointer hover:bg-brutal-yellow"
                                        >
                                            {course.courseName || "N/A"}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-row md:flex-col gap-3 shrink-0">
                                {isEditing ? (
                                    <button onClick={handleUpdate} className="brutal-btn-green">Save</button>
                                ) : (
                                    <button onClick={handleEditToggle} className="brutal-btn-yellow">Edit Student</button>
                                )}
                                <button onClick={handleDelete} className="brutal-btn-red">Delete Student</button>
                            </div>
                        </div>
                    </div>

                    <h2 className="brutal-title !text-2xl">Payment History</h2>

                    {paymentList.length === 0 ? (
                        <div className="brutal-card p-10 text-center">
                            <p className="text-xl font-extrabold uppercase tracking-wide">🎓 No Fee Submitted</p>
                            <p className="text-sm font-bold opacity-60 mt-2">Payments will appear here once submitted.</p>
                        </div>
                    ) : (
                        <div className="brutal-card overflow-x-auto">
                            <table className="brutal-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Remark</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paymentList.map((payment) => (
                                        <tr key={payment._id} className="brutal-row cursor-default">
                                            <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                                            <td><span className="brutal-chip bg-brutal-green">₹{payment.amount}</span></td>
                                            <td>{payment.remark}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            ) : (
                <div className="flex items-center justify-center h-[60vh]">
                    <p className="brutal-card bg-brutal-yellow px-8 py-6 text-xl font-extrabold uppercase tracking-widest">Loading student details...</p>
                </div>
            )}
        </div>
    )
}

export default StudentDetail
