import { NavLink } from "react-router-dom";
import { Home, BookOpen, PlusCircle, Users, UserPlus, CreditCard, History, Phone, Contact } from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    { name: "Home", icon: Home, path: "home", color: "bg-brutal-yellow" },
    { name: "All Courses", icon: BookOpen, path: "all-courses", color: "bg-brutal-sky" },
    { name: "Add Course", icon: PlusCircle, path: "add-course", color: "bg-brutal-green" },
    { name: "All Students", icon: Users, path: "all-students", color: "bg-brutal-pink" },
    { name: "Add Students", icon: UserPlus, path: "add-students", color: "bg-brutal-orange" },
    { name: "Collect Fee", icon: CreditCard, path: "collect-fee", color: "bg-brutal-purple" },
    { name: "Payment History", icon: History, path: "payment-history", color: "bg-brutal-red" },
  ];

  return (
    <aside className="w-64 shrink-0 bg-brutal-bg border-r-2 border-black flex flex-col sticky top-0 h-screen">
      <div className="p-5 border-b-2 border-black bg-brutal-yellow">
        <h1 className="text-3xl font-extrabold uppercase tracking-tight flex items-center gap-2">
          <span className="bg-black text-brutal-yellow p-1.5 border-2 border-black shadow-brutal-xs">
            <BookOpen className="w-6 h-6" />
          </span>
          IMA
        </h1>
        <p className="text-xs font-bold uppercase tracking-widest mt-2 opacity-70">
          Manage your app the easy way
        </p>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <NavLink
                  to={`/dashboard/${item.path}`}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-3 py-2.5 border-2 border-black font-extrabold uppercase text-sm tracking-wide transition-all duration-150 ${
                      isActive
                        ? `${item.color} shadow-none translate-x-[3px] translate-y-[3px]`
                        : "bg-white shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-xs"
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t-2 border-black bg-black text-white">
        <div className="flex items-center gap-2 mb-2 font-extrabold uppercase text-sm tracking-wide">
          <Contact className="w-4 h-4" />
          Contact Developer
        </div>
        <a href="tel:+916287338719" className="flex items-center gap-2 text-sm font-bold text-brutal-yellow hover:underline">
          <Phone className="w-4 h-4" />
          +91 6287338719
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
