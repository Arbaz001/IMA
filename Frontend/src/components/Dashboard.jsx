import { useState } from "react";
import Sidebar from "./Sidebar";
import {Search, Bell} from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate()
  const logoutHandler = () => {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('imageId');
    localStorage.removeItem('imageurl');
    localStorage.removeItem('fullname');
    sessionStorage.clear(); 
    // Logout logic here
    navigate('/login',{replace:true})
  }
  const [activeItem, setActiveItem] = useState("Home");

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      <div className="flex-1">
        <nav className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center flex-1">
            <div className="relative w-96">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 py-1 px-2 rounded-lg">
              <img
                src={localStorage.getItem('imageurl')}
                alt="Logo"
                className="h-8 w-8 rounded-full border-2 border-purple-500"
              />
              <div className="text-xl">
                <p className="font-bold">{localStorage.getItem('fullname')}</p>
              </div>
            </div>
            <button onClick={logoutHandler} className="px-4 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors font-medium shadow-lg shadow-red-500/30">
              Logout
            </button>
          </div>
        </nav>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default Dashboard;