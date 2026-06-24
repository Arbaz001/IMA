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
    <div className="space-y-6">
      <h1 className="brutal-title">All Payments</h1>
      <div className="brutal-card overflow-x-auto">
        <table className="brutal-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Phone</th>
              <th>Remark</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {paymentList.length > 0 ? (
              paymentList.map((payment) => (
                <tr key={payment._id} className="brutal-row cursor-default">
                  <td>{payment.fullName}</td>
                  <td>{payment.phone}</td>
                  <td>{payment.remark}</td>
                  <td><span className="brutal-chip bg-brutal-green">₹{payment.amount}</span></td>
                  <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-8 uppercase tracking-widest opacity-60">
                  No payment records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
