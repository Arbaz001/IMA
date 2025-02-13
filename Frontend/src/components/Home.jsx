import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('http://localhost:4200/course/home/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen text-xl font-semibold">Loading...</div>;

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <StatCard title="Courses" value={data.TotalCourses} color="bg-purple-500 text-white" />
        <StatCard title="Students" value={data.TotalStudents} color="bg-red-500 text-white" />
        <StatCard title="Total Amount" value={`Rs ${data.TotalAmount}`} color="bg-green-500 text-white" />
      </div>

      {/* Students & Transactions Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Table title="Students" headers={["Pic", "Name", "Phone", "Email"]}>
          {data.Students.map((student, index) => (
            <tr key={index} className="border-b hover:bg-gray-100 transition-all">
              <td><img src={student.imageUrl || 'https://via.placeholder.com/40'} className="h-10 w-10 rounded-full" alt="pic" /></td>
              <td>{student.fullName}</td>
              <td>{student.phone}</td>
              <td>{student.email}</td>
            </tr>
          ))}
        </Table>

        <Table title="Recent Transactions" headers={["Name", "Date & Time", "Amount", "Remark"]}>
          {data.Payments.map((payment, index) => (
            <tr key={index} className="border-b hover:bg-gray-100 transition-all">
              <td>{payment.fullName}</td>
              <td>{new Date(payment.date).toLocaleString()}</td>
              <td>{payment.amount}</td>
              <td>{payment.remark}</td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }) => (
  <div className={`${color} p-6 rounded-lg shadow-md text-center`}> 
    <h2 className="text-3xl font-bold">{value}</h2>
    <p className="text-white font-medium mt-2">{title}</p>
  </div>
);

const Table = ({ title, headers, children }) => (
  <div className="bg-white p-6 rounded-lg shadow overflow-auto">
    <h3 className="text-lg font-bold mb-4 text-gray-700 border-b pb-2">{title}</h3>
    <table className="w-full text-left">
      <thead>
        <tr className="border-b bg-gray-200">
          {headers.map((header, index) => (
            <th key={index} className="py-3 px-4 font-semibold text-gray-700">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

export default Dashboard;
