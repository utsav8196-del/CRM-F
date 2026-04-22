import Sidebar from "../components/Sidebar";
import MobileSidebar from "../components/MobileSidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

export default function MainLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile sidebar overlay */}
      <MobileSidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Top mobile bar for toggling sidebar */}
      <div className="fixed top-0 left-0 right-0 md:hidden z-40 shadow-sm">
        <div className="p-2 flex items-center gap-2">
          <button
            className="btn btn-ghost p-2"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="text-lg font-semibold">Interview System</div>
        </div>
      </div>

      {/* Adjust main to account for desktop sidebar and mobile header */}
      <main className="md:ml-64 ml-0 p-4 md:p-8 w-full min-h-screen">
        <div className="md:hidden h-12"></div>
        {children || <Outlet />}
      </main>
    </div>
  );
}
