import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [data, setData] = useState({
    TotalCourses: 0,
    TotalStudents: 0,
    TotalAmount: 0,
    Students: [],
    Payments: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // 🔄 Refresh state

  useEffect(() => {
    fetchDashboardData();

    // ✅ Auto-refresh every 10 minutes after
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 600000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const fetchDashboardData = async () => {
    setRefreshing(true);
    try {
      const response = await axios.get("http://localhost:4200/course/home/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setData(response.data || {}); // ✅ Empty object fix
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-semibold">
        Loading...
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* 🔄 Refresh Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-700 transition-all"
          disabled={refreshing}
        >
          {refreshing ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>

      {/* ✅ Stats Cards (Auto Update) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <GraphCard
          title="Courses"
          data={data?.TotalCourses || 0}
          color="bg-purple-500 text-white"
        />
        <GraphCard
          title="Students"
          data={data?.TotalStudents || 0}
          color="bg-red-500 text-white"
        />
        <GraphCard
          title="Total Amount"
          data={data?.TotalAmount || 0}
          color="bg-green-500 text-white"
        />
      </div>

      {/* ✅ Students & Transactions Tables (Auto Update) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Table title="Students" headers={["Pic", "Name", "Phone", "Email"]}>
          {data?.Students?.length > 0 ? (
            data.Students.map((student, index) => (
              <tr key={index} className="border-b hover:bg-gray-100 transition-all">
                <td>
                  <img
                    src={student.imageUrl || "https://via.placeholder.com/40"}
                    className="h-10 w-10 rounded-full"
                    alt="pic"
                  />
                </td>
                <td>{student.fullName}</td>
                <td>{student.phone}</td>
                <td>{student.email}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-4">
                No students found
              </td>
            </tr>
          )}
        </Table>

        <Table title="Recent Transactions" headers={["Name", "Date & Time", "Amount", "Remark"]}>
          {data?.Payments?.length > 0 ? (
            data.Payments.map((payment, index) => (
              <tr key={index} className="border-b hover:bg-gray-100 transition-all gap-1">
                <td>{payment.fullName}</td>
                <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                <td>{payment.amount}</td>
                <td>{payment.remark}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-4">
                No transactions found
              </td>
            </tr>
          )}
        </Table>
      </div>
    </div>
  );
};

const GraphCard = ({ title, data, color }) => {
  const chartData = Array.from({ length: 10 }, (_, i) => ({
    name: `Day ${i + 1}`,
    value: Math.floor((data || 0) * (0.5 + Math.random() * 0.5)),
  }));

  return (
    <div className={`${color} p-8 rounded-lg shadow-md font-bold text-green-900 text-center`}>
      <h2 className="text-3xl font-bold">{data || 0}</h2>
      <p className="text-white font-bold mt-2">{title}</p>
      <ResponsiveContainer width="100%" height={150}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#fff" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const Table = ({ title, headers, children }) => (
  <div className="bg-white p-6 rounded-lg shadow overflow-auto">
    <h3 className="text-lg font-bold mb-4 text-red-800 border-b pb-2">{title}</h3>
    <table className="w-full text-left">
      <thead>
        <tr className="border-b bg-gray-200">
          {headers.map((header, index) => (
            <th key={index} className="py-3 px-4 font-semibold text-red-600">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

export default Dashboard;
