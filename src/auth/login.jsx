// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Mail, Lock, Eye, EyeOff } from "lucide-react";
// import { toast } from "react-toastify";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();
//   const [credential, setCredential] = useState({
//     email: "",
//     password: "",
//   });

//   useEffect
// (() => {
//     setCredential({ email: "", password: "" });
//   },[]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch("http://localhost:5000/api/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });
//       console.log("response", response);
//       const json = await response.json();
//       if (json.success) {
//         localStorage.setItem("token", json.authtoken);
//         localStorage.setItem("userId", json.userId);  
//         if (credential.email === "admin@gmail.com") {
//           navigate("/Admin/dashboard");
//         } else {
//           navigate("/");
//         }
//         toast.success(`Welcome`, {
//           position: "top-right",
//           autoClose: 5000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: "colored",
//         });
//       } else {
//         toast.error("Enter Valid Email & Password", {
//           position: "top-right",
//           autoClose: 5000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: "colored",
//         });
//       }
//     } catch (error) {
//       console.error("Login Error:", error.message);
//       toast.error("An error occurred while logging in", {
//         position: "top-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "colored",
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 px-4">
//       <div className="w-full max-w-md bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/30">
//         <div className="text-center mb-6">
//           <h1 className="text-3xl font-bold text-white tracking-wide">
//             HR-CRM
//           </h1>
//           <p className="text-white/80 text-sm mt-1">Login to your dashboard</p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label className="text-white text-sm mb-1 block">
//               Email Address
//             </label>
//             <div className="flex items-center bg-white/90 rounded-lg px-3">
//               <Mail size={18} className="text-gray-500" />
//               <input
//                 type="email"
//                 placeholder="you@email.com"
//                 className="w-full bg-transparent outline-none px-2 py-3 text-gray-700"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>
//           </div>

//           <div>
//             <label className="text-white text-sm mb-1 block">Password</label>

//             <div className="flex items-center bg-white/90 rounded-lg px-3">
//               <Lock size={18} className="text-gray-500" />
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Password"
//                 className="w-full bg-transparent outline-none px-2 py-3 text-gray-700"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="ml-2 text-gray-600 hover:text-gray-800 transition"
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold tracking-wide shadow-lg hover:scale-[1.02] transition-transform"
//           >
//             Sign In
//           </button>
//         </form>

//         <div>
//           <p className="text-center text-white/80 text-sm mt-6">
//             Don't have an account?{" "}
//             <span
//               onClick={() => navigate("/register")}
//               className="cursor-pointer text-white font-semibold underline hover:text-white/90"
//             >
//               Sign Up
//             </span>
//           </p>
//         </div>

//         <p className="text-center text-white/70 text-xs mt-6">
//           © 2025 HR-CRM. All rights reserved.
//         </p>
//       </div>
//     </div>
//   );
// }


// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Mail, Lock, Eye, EyeOff, LogOut } from "lucide-react";
// import { toast } from "react-toastify";

// export default function Auth() {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   // 🔹 Check login status
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     setIsLoggedIn(!!token);
//   }, []);

//   // 🔹 LOGIN
//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch("http://localhost:5000/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const json = await response.json();

//       if (json.success) {
//         localStorage.setItem("token", json.authtoken);
//         localStorage.setItem("userId", json.userId);

//         toast.success("Login Successful", { theme: "colored" });
//         setIsLoggedIn(true);

//         if (email === "admin@gmail.com") {
//           navigate("/", { replace: true });
//         } else {
//           navigate("/", { replace: true });
//         }
//       } else {
//         toast.error("Invalid Email or Password", { theme: "colored" });
//       }
//     } catch (error) {
//       toast.error("Login failed", { theme: "colored" });
//     }
//   };

//   // 🔹 LOGOUT
//   const handleLogout = () => {
//     localStorage.clear();
//     setIsLoggedIn(false);
//     navigate("/login", { replace: true });
//     toast.info("Logged out successfully", { theme: "colored" });
//   };

//   if (isLoggedIn) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700">
//         <div className="bg-white p-8 rounded-xl shadow-xl text-center">
//           <h2 className="text-2xl font-bold mb-4">You are logged in</h2>
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg"
//           >
//             <LogOut size={18} /> Logout
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // 🔹 LOGIN VIEW
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 px-4">
//       <div className="w-full max-w-md bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/30">

//         <h1 className="text-3xl font-bold text-white text-center">HR-CRM</h1>
//         <p className="text-center text-white/80 mb-6">Login to your dashboard</p>

//         <form onSubmit={handleLogin} className="space-y-5"> 
//           <div>
//             <label className="text-white text-sm">Email</label>
//             <div className="flex items-center bg-white/90 rounded-lg px-3">
//               <Mail size={18} />
//               <input
//                 type="email"
//                 required
//                 className="w-full px-2 py-3 outline-none bg-transparent"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>
//           </div>

//           <div>
//             <label className="text-white text-sm">Password</label>
//             <div className="flex items-center bg-white/90 rounded-lg px-3">
//               <Lock size={18} />
//               <input
//                 type={showPassword ? "text" : "password"}
//                 required
//                 className="w-full px-2 py-3 outline-none bg-transparent"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//               <button type="button" onClick={() => setShowPassword(!showPassword)}>
//                 {showPassword ? <EyeOff /> : <Eye />}
//               </button>
//             </div>
//           </div>

//           <button className="w-full py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl">
//             Sign In
//           </button>
//         </form>

//       </div>
//     </div>
//   );
// }



import React from "react";
import LoginImage from "../assets/design.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [credential, setCredential] = useState({
    email: "",
    password: "",
  });

  useEffect
(() => {
    setCredential({ email: "", password: "" });
  },[]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      console.log("response", response);
      const json = await response.json();
      if (json.success) {
        localStorage.setItem("token", json.authtoken);
        localStorage.setItem("userId", json.userId);  
        if (credential.email === "admin@gmail.com") {
          navigate("/Admin/dashboard");
        } else {
          navigate("/");
        }
        toast.success(`Welcome`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        toast.error("Enter Valid Email & Password", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("Login Error:", error.message);
      toast.error("An error occurred while logging in", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-100 to-blue-200 px-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-cyan-400 to-blue-500 p-6">
          <img
            src={LoginImage}
            alt="HR CRM"
            className="w-full max-w-sm object-contain rounded-lg"
          />
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6">
            Welcome to HR-CRM
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
           <div>
             <label className="text-black text-sm mb-1 block">
               Email Address 
             </label>
             <div className="flex items-center bg-white/90 rounded-lg px-3 border">
               <Mail size={18} className="text-gray-500" />
               <input
                type="email"
                placeholder="you@email.com"
                className="w-full bg-transparent outline-none px-2 py-3 text-gray-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-black text-sm mb-1 block">Password</label>
            <div className="flex items-center bg-white/90 rounded-lg px-3 border">
              <Lock size={18} className="text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full bg-transparent outline-none px-2 py-3 text-gray-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-gray-600 hover:text-gray-800 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold tracking-wide shadow-lg hover:scale-[1.02] transition-transform"
          >
            Sign In
          </button>
        </form>
          <p className="text-center text-gray-600 text-sm mt-6">
            Don't have an account?{" "}
            <span
              onClick={() => (window.location.href = "/register")}
              className="cursor-pointer text-blue-600 font-semibold hover:underline"
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
