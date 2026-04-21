import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";

import Dashboard from "../pages/Dashboard";
import Candidates from "../pages/Candidates";
import Interviews from "../pages/InterviewsPage";
import Settings from "../pages/Settings";
import UpcomingInterviews from "../pages/UpcomingInterview";
import Register from "../auth/Register";
import Login from "../auth/Login";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/candidates" element={<Candidates />} />
                  <Route path="/interviews" element={<Interviews />} />
                  <Route path="/upcoming-interviews" element={<UpcomingInterviews />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
