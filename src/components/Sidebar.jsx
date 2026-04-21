// import { Link, useLocation } from "react-router-dom";

// export default function Sidebar() {
//   const { pathname } = useLocation();

//   const menu = [
//     { name: "Dashboard", path: "/" },
//     { name: "Candidates", path: "/candidates" },
//     { name: "Interviews", path: "/interviews" },
//     { name: "Upcoming Interviews", path: "/upcoming-interviews" }, 
//     { name: "Settings", path: "/settings" },
//   ];

//   return (
//     <aside className="hidden md:block w-64 fixed h-screen shadow-md p-6 overflow-y-auto bg-black/5">
//       <h1 className="text-xl font-bold mb-10">Interview System</h1>

//       {menu.map((item) => (
//         <Link key={item.path} to={item.path}>
//           <div
//             className={`p-3 rounded-lg mb-3 cursor-pointer ${
//               pathname === item.path
//                 ? "bg-base-200 font-semibold"
//                 : "hover:bg-blue-50"
//             }`}
//           >
//             {item.name}
//           </div>
//         </Link>
//       ))}
//       <button
//         className="mt-115 w-full bg-red-600 text-white py-2 hover:bg-red-500 rounded" 
//         onClick={() => { localStorage.removeItem("token"); window.location.reload(); }}
//       >
//         Logout
//       </button>
//     </aside>
//   );
// }
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const { pathname } = useLocation();

  const menu = [
    { name: "Dashboard", path: "/" },
    { name: "Candidates", path: "/candidates" },
    { name: "Interviews", path: "/interviews" },
    { name: "Upcoming Interviews", path: "/upcoming-interviews" }, 
    { name: "Settings", path: "/settings" },
  ];

  return (
    <aside className="hidden md:block w-64 fixed h-screen shadow-md p-6 overflow-y-auto bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white">
      <h1 className="text-xl font-bold mb-10">Interview System</h1>

      {menu.map((item) => (
        <Link key={item.path} to={item.path}>
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

      <button
        className="mt-115 w-full bg-red-600 text-white py-2 hover:bg-red-500 rounded"
        onClick={() => {
          localStorage.removeItem("token");
          window.location.reload();
        }}
      >
        Logout
      </button>
    </aside>
  );
}