// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import {ToastContainer} from 'react-toastify';
import AddStudent from './components/AddStudent';
import Students from './components/Students';
import AddCourses from './components/AddCourses';
import Courses from './components/Courses';
import Home from './components/Home';
import CollectFee from './components/CollectFee';
import PaymentHistory from './components/PaymentHistory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}>
          {/* Child Routes */}
          <Route path="" element={<Home/>} />
          <Route path="home" element={<Home/>} />
          <Route path="all-courses" element={<Courses />} />
          <Route path="add-course" element={<AddCourses />} />
          <Route path="all-students" element={<Students />} />
          <Route path="add-students" element={<AddStudent />} />
          <Route path="collect-fee" element={<CollectFee />} />
          <Route path="payment-history" element={<PaymentHistory />} />
        </Route>
      </Routes>
      <ToastContainer autoClose={1000} />
    </Router>
  );
}

export default App;