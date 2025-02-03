import { NavLink } from "react-router-dom";
import { Home, BookOpen, PlusCircle, Users, UserPlus, CreditCard, History, Phone, Contact } from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    { name: "Home", icon: <Home className="w-4 h-4 mr-2" />, path: "home" },
    { name: "All Courses", icon: <BookOpen className="w-4 h-4 mr-2" />, path: "all-courses" },
    { name: "Add Course", icon: <PlusCircle className="w-4 h-4 mr-2" />, path: "add-course" },
    { name: "All Students", icon: <Users className="w-4 h-4 mr-2" />, path: "all-students" },
    { name: "Add Students", icon: <UserPlus className="w-4 h-4 mr-2" />, path: "add-students" },
    { name: "Collect Fee", icon: <CreditCard className="w-4 h-4 mr-2" />, path: "collect-fee" },
    { name: "Payment History", icon: <History className="w-4 h-4 mr-2" />, path: "payment-history" },
  ];

  return (
    <div className="w-64 font-bold bg-gradient-to-b from-[#6C3CE9] to-[#5B32C6] text-white flex flex-col shadow-xl">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold flex items-center">
          <BookOpen className="w-7 h-7 mr-2" />
          IMA
        </h1>
        <p className="text-sm opacity-75 mt-1">Manage your App in easy way</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1.5">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={`/dashboard/${item.path}`}
                className={({ isActive }) =>
                  `w-full flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-white/15 shadow-lg shadow-black"
                      : "hover:bg-white/15 hover:shadow-md hover:shadow-black"
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-lg">
        <div className="flex items-center mb-2 hover:text-white/90 cursor-pointer transition-colors">
          <Contact className="w-4 h-4 mr-2" />
          Contact Developer
        </div>
        <div className="flex items-center text-sm text-white/75 hover:text-white/90 cursor-pointer transition-colors">
          <Phone className="w-4 h-4 mr-2" />
          +91 6287338719
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
