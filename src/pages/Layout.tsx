import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Search,
  Settings,
  Users,
  BriefcaseBusiness,
  ListChecks,
  Receipt,
  CalendarCheck,
  FileUser,
  BellDot,
  Menu,
  LogOut,
} from "lucide-react";
import Logo from "@/assets/logo.png";
import { getUserData } from "../../utils/common.js";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

// SidebarItem Component
const SidebarItem = ({ url, icon: Icon, text, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === url;

  return (
    <Link
      to={url}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 ease-in-out ${
        isActive ? "bg-blue-100 text-[#0673D4] font-semibold" : "text-gray-600"
      }`}
      onClick={onClick}
    >
      <Icon className="w-5 h-5 text-[#0673D4]" />
      <span
        className={`text-sm ${
          isActive ? "bg-blue-100" : "text-[#B6B6B6]"
        } font-medium hover:text-[#0673D4]`}
      >
        {text}
      </span>
    </Link>
  );
};

// Sidebar Component
const Sidebar = ({ role, sidebarOpen, onLinkClick }) => {
  const menus = {
    manager: [
      { icon: LayoutDashboard, text: "Dashboard", url: "/dashboard" },
      { icon: Users, text: "Client Management", url: "/client" },
      { icon: BriefcaseBusiness, text: "Job Postings", url: "/job-posting" },
      { icon: FileUser, text: "Manage Candidates", url: "/candidates" },
      { icon: CalendarCheck, text: "Manage Interviews", url: "/interviews" },
      { icon: FileUser, text: "Candidates Status", url: "/candidates-status" },
      // { icon: ListChecks, text: "Closed Positions", url: "/closed-postitions" },
      { icon: Receipt, text: "Invoices", url: "/invoices" },
      // { icon: Users, text: "Candidates", url: "/candidates" },
      // { icon: CalendarCheck, text: "Interviews", url: "/interviews" },
    ],
    recruiter: [
      { icon: LayoutDashboard, text: "Dashboard", url: "/dashboard" },
      { icon: CalendarCheck, text: "Assigned Positions", url: "/assigned-positions" },
      { icon: FileUser, text: "Manage Candidates", url: "/candidates" },
      { icon: CalendarCheck, text: "Manage Interviews", url: "/interviews" },
      { icon: FileUser, text: "Candidates Status", url: "/candidates-status" },
    ],
  };

  return (
    <aside
      className={`w-64 bg-white shadow-sm p-4 space-y-4 transition-all duration-300 ease-in-out ${
        sidebarOpen ? "block" : "hidden md:block"
      }`}
    >
      <div className="flex items-center justify-center space-x-2 mb-10">
        <img src={Logo} alt="Logo" className="h-8" />
      </div>
      {menus[role]?.map((menu, index) => (
        <SidebarItem
          key={index}
          url={menu.url}
          icon={menu.icon}
          text={menu.text}
          onClick={onLinkClick}
        />
      ))}
    </aside>
  );
};

// Layout Component
const Layout = ({ content, isRaw }) => {
  const userData = getUserData();
  const role = userData?.role; // Ensure role is available
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const handleSidebarToggle = () => setSidebarOpen(!sidebarOpen);

  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false); // Close sidebar on mobile when a link is clicked
    }
  };

  const handleLogout = () => {
    Cookies.remove("user");
    window.location.href = "/"; // Redirect to login after logout
  };

  // If no role, redirect to login page
  useEffect(() => {
    if (!role) {
      window.location.href = "/"; // If no user role, redirect to login page
    }
  }, [role, navigate]);

  return (
    <div className="flex bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        role={role}
        sidebarOpen={sidebarOpen}
        onLinkClick={handleLinkClick}
      />

      {/* Main Content */}
      <main className="flex-1">
        <div className="flex justify-between items-center gap-1 bg-white shadow-sm p-4 ">
          {/* Sidebar Toggle (Hamburger menu for mobile) */}
          <button
            className="md:hidden p-2 rounded-lg"
            onClick={handleSidebarToggle}
          >
            <Menu className="w-6 h-6 text-[#0044A3]" />
          </button>
          <div className="flex-grow" />
          <div className="flex items-center gap-4 md:gap-6">
            {/* Search Input */}
            {/* <div className="relative w-full md:w-70">
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 rounded-full bg-[#fbf9fa] text-[#0044A3] font-medium placeholder:text-[#0044A3] text-sm w-full focus:outline-none"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#0044A3]" />
            </div> */}

            {/* Settings and Notifications */}
            <div className="hidden md:flex items-center gap-6">
              {role === "manager" && (
                <div className="bg-[#fbf9fa] p-3 cursor-pointer rounded-full">
                  <Link to="/users">
                    <Settings className="w-5 h-5 text-[#0044A3]" />
                  </Link>
                </div>
              )}
              {/* <div className="bg-[#fbf9fa] p-3 cursor-pointer rounded-full">
                <BellDot className="w-5 h-5 text-[#0044A3]" />
              </div> */}
            </div>

            {/* Profile Picture */}
            <div className="relative">
              <img
                src={userData?.profileImage || "https://i.pravatar.cc/299"}
                alt="Profile"
                className="w-8 h-8 rounded-full cursor-pointer"
                onClick={() => setDropdownOpen(!isDropdownOpen)}
              />
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200">
                  <ul className="text-sm text-gray-700">
                    <li
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center gap-2"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 text-[#0044A3]" />
                      <span>Logout</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        {isRaw ? (
          React.createElement(content)
        ) : (
          <div className="bg-white shadow-sm p-4 m-4">
            {React.createElement(content)}
          </div>
        )}
      </main>
    </div>
  );
};

export default Layout;
