import { Link, useLocation } from "react-router-dom";

export default function MobileSidebar({ isOpen, onClose }) {
  const { pathname } = useLocation();

  const menu = [
    { name: "Dashboard", path: "/" },
    { name: "Candidates", path: "/candidates" },
    { name: "Interviews", path: "/interviews" },
    { name: "Upcoming Interviews", path: "/upcoming-interviews" },
    { name: "Settings", path: "/settings" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

      <aside className="absolute left-0 top-0 h-full w-64 bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white shadow-xl p-6 overflow-y-auto">
        <button
          className="mb-4 text-sm px-3 py-1 rounded bg-gray-800 hover:bg-gray-700"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          Close
        </button>

        <h1 className="text-xl font-bold mb-6">Interview System</h1>

        {menu.map((item) => (
          <Link key={item.path} to={item.path} onClick={onClose}>
            <div
              className={`p-3 rounded-lg mb-3 cursor-pointer transition-all ${
                pathname === item.path
                  ? "bg-indigo-600 text-white shadow-md"
                  : "hover:bg-gray-800 text-gray-300 hover:text-white"
              }`}
            >
              {item.name}
            </div>
          </Link>
        ))}
      </aside>
    </div>
  );
}