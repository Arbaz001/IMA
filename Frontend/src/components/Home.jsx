import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_URL } from "../api";
import { BookOpen, Users, IndianRupee, RefreshCw } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Home = () => {
  const [data, setData] = useState({
    TotalCourses: 0,
    TotalStudents: 0,
    TotalAmount: 0,
    Students: [],
    Payments: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 600000); // auto-refresh every 10 min
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    setRefreshing(true);
    try {
      const response = await axios.get(`${API_URL}/course/home/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setData(response.data || {});
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="brutal-card px-8 py-6 bg-brutal-yellow text-2xl font-extrabold uppercase tracking-widest animate-pop">
          Loading...
        </div>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="brutal-title">Dashboard</h1>
        <button
          onClick={fetchDashboardData}
          className="brutal-btn-black"
          disabled={refreshing}
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Refreshing" : "Refresh"}
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Courses" value={data?.TotalCourses || 0} color="bg-brutal-sky" Icon={BookOpen} />
        <StatCard title="Students" value={data?.TotalStudents || 0} color="bg-brutal-pink" Icon={Users} />
        <StatCard title="Total Amount" value={data?.TotalAmount || 0} color="bg-brutal-green" Icon={IndianRupee} prefix="₹" />
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TableCard title="Students" headers={["Pic", "Name", "Phone", "Email"]}>
          {data?.Students?.length > 0 ? (
            data.Students.map((student, index) => (
              <tr key={index} className="brutal-row">
                <td>
                  <img
                    src={student.imageUrl || "https://via.placeholder.com/40"}
                    className="h-10 w-10 object-cover border-[3px] border-black"
                    alt="pic"
                  />
                </td>
                <td>{student.fullName}</td>
                <td>{student.phone}</td>
                <td className="lowercase">{student.email}</td>
              </tr>
            ))
          ) : (
            <EmptyRow span={4} text="No students found" />
          )}
        </TableCard>

        <TableCard title="Recent Transactions" headers={["Name", "Date", "Amount", "Remark"]}>
          {data?.Payments?.length > 0 ? (
            data.Payments.map((payment, index) => (
              <tr key={index} className="brutal-row">
                <td>{payment.fullName}</td>
                <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                <td><span className="brutal-chip bg-brutal-green">₹{payment.amount}</span></td>
                <td>{payment.remark}</td>
              </tr>
            ))
          ) : (
            <EmptyRow span={4} text="No transactions found" />
          )}
        </TableCard>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color, Icon, prefix = "" }) => {
  // Memoize chart data so it only recomputes when the value changes — no per-render flicker.
  const chartData = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        name: `D${i + 1}`,
        value: Math.floor((value || 0) * (0.5 + ((i * 37) % 50) / 100)),
      })),
    [value]
  );

  return (
    <div className={`${color} brutal-card brutal-hover p-5`}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-4xl font-extrabold">{prefix}{value || 0}</h2>
          <p className="font-extrabold uppercase tracking-widest text-sm mt-1">{title}</p>
        </div>
        <span className="bg-black text-white p-2.5 border-[3px] border-black">
          <Icon className="w-6 h-6" />
        </span>
      </div>
      <div className="bg-white border-[3px] border-black mt-3 p-1">
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={chartData} margin={{ top: 6, right: 6, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#111" opacity={0.15} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 700 }} stroke="#111" />
            <YAxis tick={{ fontSize: 10, fontWeight: 700 }} stroke="#111" />
            <Tooltip
              contentStyle={{ border: "3px solid #111", borderRadius: 0, fontWeight: 700, boxShadow: "4px 4px 0 0 #111" }}
            />
            <Line type="monotone" dataKey="value" stroke="#111" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const TableCard = ({ title, headers, children }) => (
  <div className="brutal-card overflow-x-auto">
    <h3 className="text-lg font-extrabold uppercase tracking-wide bg-black text-white px-4 py-3">
      {title}
    </h3>
    <table className="brutal-table">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

const EmptyRow = ({ span, text }) => (
  <tr>
    <td colSpan={span} className="text-center py-6 uppercase tracking-widest opacity-60">
      {text}
    </td>
  </tr>
);

export default Home;
