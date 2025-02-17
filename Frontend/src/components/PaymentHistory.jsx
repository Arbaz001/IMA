import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_URL } from "../api";
const PaymentHistory = () => {
  const [paymentList, setPaymentList] = useState([]);
  const Navigate = useNavigate();

  useEffect(() => {
    getPaymentList();
  }, []);

  const getPaymentList = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Unauthorized! Please login again.");
        Navigate("/login");
        return;
      }

      const response = await axios.get(`${API_URL}/fee/payment-history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.paymentHistory) {
        setPaymentList(response.data.paymentHistory);
      } else {
        toast.warn("No payment records found.");
      }
    } catch (err) {
      console.error("Error fetching payments:", err.response?.data || err);
      toast.error(err.response?.data?.error || "Failed to fetch payment history.");
    }
  };

  return (
    <div>
      <h2 className="text-3xl text-center font-extrabold text-gray-800 mt-5 mb-4">
        All Payments
      </h2>
      <table className="w-full text-left border-collapse mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border-b font-extrabold p-3 text-red-600">Student Name</th>
            <th className="border-b font-extrabold p-3 text-red-600">Phone</th>
            <th className="border-b font-extrabold p-3 text-red-600">Remark</th>
            <th className="border-b font-extrabold p-3 text-red-600">Amount</th>
            <th className="border-b font-extrabold p-3 text-red-600">Date</th> {/* ✅ New Date Column */}
          </tr>
        </thead>
        <tbody>
          {paymentList.length > 0 ? (
            paymentList.map((payment) => (
              <tr key={payment._id} className="hover:bg-gray-100">
                <td className="border-b font-bold p-2">{payment.fullName}</td>
                <td className="border-b font-bold p-2">{payment.phone}</td>
                <td className="border-b font-bold p-2">{payment.remark}</td>
                <td className="border-b font-bold p-2">{payment.amount}</td>
                <td className="border-b font-bold p-2">
                  {new Date(payment.createdAt).toLocaleDateString()} {/* ✅ Date Formatting */}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center p-3 text-gray-600">
                No payment records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;
