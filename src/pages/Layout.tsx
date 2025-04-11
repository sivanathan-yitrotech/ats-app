import React, { useState } from "react";
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
} from "lucide-react";
import Logo from "@/assets/logo.png";

// SidebarItem Component - To render individual menu items
const SidebarItem = ({ icon: Icon, text, active }) => (
  <div
    className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 ease-in-out ${
      active ? "bg-blue-100 text-blue-600 font-semibold" : "text-gray-600"
    }`}
  >
    <Icon className="w-5 h-5 text-[#0673D4]" />
    <span className="text-sm text-[#B6B6B6] font-medium hover:text-[#0673D4]">
      {text}
    </span>
  </div>
);

// Sidebar Component - Contains the sidebar logic
const Sidebar = ({ role, sidebarOpen }) => {
  const menus = {
    admin: [
      { icon: LayoutDashboard, text: "Dashboard", url: "Dashboard" },
      { icon: Users, text: "User Management", url: "Users" },
      { icon: BriefcaseBusiness, text: "Job Title", url: "JobTitle" },
    ],
    manager: [
      { icon: LayoutDashboard, text: "Dashboard", url: "Dashboard" },
      { icon: Users, text: "Client Management", url: "Client" },
      { icon: BriefcaseBusiness, text: "Job Postings", url: "JobPostings" },
      { icon: ListChecks, text: "Closed Positions", url: "ClosedPositions" },
      { icon: Receipt, text: "Invoices", url: "Invoices" },
    ],
    recruiter: [
      { icon: LayoutDashboard, text: "Dashboard", url: "Dashboard" },
      { icon: Users, text: "Candidates", url: "Candidates" },
      { icon: CalendarCheck, text: "Interviews", url: "Interviews" },
      { icon: FileUser, text: "Candidates Status", url: "CandidatesStatus" },
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
      {menus[role].map((menu, index) => (
        <SidebarItem
          key={index}
          icon={menu.icon}
          text={menu.text}
          active={false}
        />
      ))}
    </aside>
  );
};

// Layout Component - The main dashboard layout
const Layout = ({ content }) => {
  const role = "manager"; // This should be dynamically set based on user role
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar role={role} sidebarOpen={sidebarOpen} />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="flex justify-between items-center gap-1 bg-white shadow-sm p-4">
          {/* Sidebar Toggle (Hamburger menu for mobile) */}
          <button
            className="md:hidden p-2rounded-lg"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="w-6 h-6 text-[#0044A3]" />
          </button>
          <div className="flex-grow" />
          <div className="flex items-center gap-4 md:gap-6">
            {/* Search Input (Responsive) */}
            <div className="relative w-full md:w-70">
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 rounded-full bg-[#fbf9fa] text-[#0044A3] font-medium placeholder:text-[#0044A3] text-sm w-full focus:outline-none"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#0044A3]" />
            </div>

            {/* Settings and Notifications (Only on larger screens) */}
            <div className="hidden md:flex items-center gap-6">
              <div className="bg-[#fbf9fa] p-3 cursor-pointer rounded-full">
                <Settings className="w-5 h-5 text-[#0044A3]" />
              </div>
              <div className="bg-[#fbf9fa] p-3 cursor-pointer rounded-full">
                <BellDot className="w-5 h-5 text-[#0044A3]" />
              </div>
            </div>

            {/* Profile Picture */}
            <img
              src="https://i.pravatar.cc/300"
              alt="Profile"
              className="w-8 h-8 rounded-full cursor-pointer"
            />
          </div>
        </div>
        <div className="bg-white shadow-sm p-4 m-4">
          {React.createElement(content)}
        </div>
      </main>
    </div>
  );
};

export default Layout;
