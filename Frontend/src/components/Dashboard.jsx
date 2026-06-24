import { useState } from "react";
import Sidebar from "./Sidebar";
import { Search, Bell, LogOut } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("imageId");
    localStorage.removeItem("imageurl");
    localStorage.removeItem("fullname");
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  const fullname = localStorage.getItem("fullname");
  const imageurl = localStorage.getItem("imageurl");

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <nav className="h-20 bg-white border-b-[3px] border-black flex items-center justify-between gap-4 px-4 md:px-6 sticky top-0 z-20">
          <div className="relative w-full max-w-md hidden sm:block">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="SEARCH..."
              className="w-full pl-11 pr-4 py-3 bg-brutal-bg border-[3px] border-black font-bold uppercase text-sm tracking-wide placeholder:text-black/40 outline-none focus:shadow-brutal-sm focus:-translate-y-0.5 transition-all duration-150"
            />
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button className="relative p-2.5 bg-brutal-yellow border-[3px] border-black shadow-brutal-xs hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-150">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-brutal-red border-2 border-black rounded-full"></span>
            </button>

            <div className="flex items-center gap-2 bg-white border-[3px] border-black px-2 py-1.5 shadow-brutal-xs">
              {imageurl && (
                <img
                  src={imageurl}
                  alt="profile"
                  className="h-9 w-9 object-cover border-2 border-black"
                />
              )}
              <p className="font-extrabold uppercase text-sm tracking-wide hidden md:block max-w-[140px] truncate">
                {fullname || "User"}
              </p>
            </div>

            <button onClick={logoutHandler} className="brutal-btn-red !px-3 !py-2.5">
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </nav>

        <main className="flex-1 p-4 md:p-6 animate-pop">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
