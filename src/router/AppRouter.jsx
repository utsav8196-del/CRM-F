import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Register from "../auth/Register";
import Login from "../auth/Login";
import Candidates from "../pages/Candidates";
import Dashboard from "../pages/Dashboard";
import Interviews from "../pages/InterviewsPage";
import Settings from "../pages/Settings";
import UpcomingInterviews from "../pages/UpcomingInterview";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/interviews" element={<Interviews />} />
            <Route
              path="/upcoming-interviews"
              element={<UpcomingInterviews />}
            />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
