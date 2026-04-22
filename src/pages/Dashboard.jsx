import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchDashboardData } from "../features/dashboard/dashboardSlice";
import {
  selectDashboardData,
  selectDashboardLoading,
  selectDashboardError,
} from "../features/dashboard/dashboardSelectors";
import { logout } from "../utils/auth";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const dashboardData = useAppSelector(selectDashboardData);
  const loading = useAppSelector(selectDashboardLoading);
  const error = useAppSelector(selectDashboardError);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchDashboardData());
    }, 120000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchDashboardData());
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const initialLoading = loading && !dashboardData;

  if (initialLoading) {
    return (
      <div className="p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">Dashboard Overview</h2>
            <p className="text-base-content/60 mt-1">
              Welcome to your interview management system
            </p>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg"></span>
            <p className="mt-4 text-base-content/60">
              Loading dashboard data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">Dashboard Overview</h2>
            <p className="text-base-content/60 mt-1">
              Welcome to your interview management system
            </p>
          </div>
        </div>
        <div className="alert alert-error">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
          <button className="btn btn-sm btn-ghost" onClick={handleRefresh}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { stats, charts, recentCandidates, upcomingInterviews } = dashboardData;

  const getStatusBadge = (status) => {
    switch (status) {
      case "Scheduled":
        return "badge-info";
      case "Pending":
        return "badge-warning";
      case "Completed":
        return "badge-success";
      case "Rejected":
        return "badge-error";
      default:
        return "badge-ghost";
    }
  };

  const getInterviewBadge = (type) => {
    switch (type) {
      case "1st Round":
        return "badge-primary";
      case "2nd Round":
        return "badge-secondary";
      case "Final Round":
        return "badge-accent";
      default:
        return "badge-ghost";
    }
  };

  const calculatePercentageChange = (current, previous = 0) => {
    if (previous === 0) return { value: 0, isPositive: true };
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(Math.round(change)),
      isPositive: change >= 0,
    };
  };

  const previousStats = {
    totalCandidates: Math.max(0, stats.totalCandidates - 15),
    scheduledInterviews: Math.max(0, stats.scheduledInterviews - 5),
    completedInterviews: Math.max(0, stats.completedInterviews - 3),
    pendingReviews: Math.max(0, stats.pendingReviews - 2),
  };

  const totalCandidatesChange = calculatePercentageChange(
    stats.totalCandidates,
    previousStats.totalCandidates
  );
  const scheduledInterviewsChange = calculatePercentageChange(
    stats.scheduledInterviews,
    previousStats.scheduledInterviews
  );
  const completedInterviewsChange = calculatePercentageChange(
    stats.completedInterviews,
    previousStats.completedInterviews
  );

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Dashboard Overview</h2>
          <p className="text-base-content/60 mt-1 text-xl">
            Welcome to your interview management system
          </p>
        </div>
        <div className="flex items-center gap-4 ">
          <div className="text-sm text-base-content/60">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <button
            className="btn btn-sm btn-outline"
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <svg
                className="w-4 h-4"
                
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            )}
            Refresh
          </button>
          <button className="btn btn-sm btn-error" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div className="bg-base-100 p-6 rounded-xl shadow-lg border-l-4 border-primary">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-base-content/60">
                Total Candidates
              </h4>
              <p className="text-3xl font-bold mt-2">{stats.totalCandidates}</p>
              <p
                className={`text-sm mt-1 ${
                  totalCandidatesChange.isPositive
                    ? "text-success"
                    : "text-error"
                }`}
              >
                {totalCandidatesChange.isPositive ? "↑" : "↓"}{" "}
                {totalCandidatesChange.value}% from previous 
              </p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Scheduled Interviews Card */}
        <div className="bg-base-100 p-6 rounded-xl shadow-lg border-l-4 border-info">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-base-content/60">
                Scheduled Interviews
              </h4>
              <p className="text-3xl font-bold mt-2">
                {stats.scheduledInterviews}
              </p>
              <p
                className={`text-sm mt-1 ${
                  scheduledInterviewsChange.isPositive
                    ? "text-success"  
                    : "text-error"
                }`}
              >
                {scheduledInterviewsChange.isPositive ? "↑" : "↓"}{" "}
                {scheduledInterviewsChange.value}% from previous
              </p>
            </div>

            <div className="bg-info/10 p-3 rounded-lg">
              <svg
                className="w-6 h-6 text-info"
                fill="none"
                stroke="currentColor"
                
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Completed Interviews Card */}
        <div className="bg-base-100 p-6 rounded-xl shadow-lg border-l-4 border-success">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-base-content/60">
                Completed Interviews
              </h4>
              <p className="text-3xl font-bold mt-2">
                {stats.completedInterviews}
              </p>
              <p
                className={`text-sm mt-1 ${
                  completedInterviewsChange.isPositive
                    ? "text-success"
                    : "text-error"
                }`}
              >
                {completedInterviewsChange.isPositive ? "↑" : "↓"}{" "}
                {completedInterviewsChange.value}% from previous
              </p>
            </div>
            <div className="bg-success/10 p-3 rounded-lg">
              <svg
                className="w-6 h-6 text-success"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-base-100 p-6 rounded-xl shadow-lg border-l-4 border-warning">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-base-content/60">
                Pending Reviews
              </h4>
              <p className="text-3xl font-bold mt-2">{stats.pendingReviews}</p>
              <p className="text-sm text-warning mt-1">Need attention</p>
            </div>
            <div className="bg-warning/10 p-3 rounded-lg">
              <svg
                className="w-6 h-6 text-warning"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 min-w-0 bg-base-100 p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Interview Trends</h3>
            <div className="flex gap-2">
              <button className="btn btn-sm btn-outline">Monthly</button>
              <button className="btn btn-sm btn-ghost">Quarterly</button>
              <button className="btn btn-sm btn-ghost">Yearly</button>
            </div>
          </div>
          <div className="w-full min-w-0 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.monthlyStats}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  opacity={0.3}
                />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#F9FAFB",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="interviews"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: "#1D4ED8" }}
                />
                <Line
                  type="monotone"
                  dataKey="candidates"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: "#047857" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-base-content/60">Interviews</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-base-content/60">
              </span>
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="min-w-0 bg-base-100 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-6">Status Distribution</h3>
          <div className="w-full min-w-0 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {charts.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#F9FAFB",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {charts.statusDistribution.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span>{item.status}</span>
                </div>
                <span className="font-semibold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-base-100 p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Recent Candidates</h3>
            <button className="btn btn-sm btn-outline">View All</button>
          </div>
          <div className="space-y-4">
            {recentCandidates && recentCandidates.length > 0 ? (
              recentCandidates.map((candidate, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content rounded-full p-3 w-10">
                        <span className="text-sm">{candidate.avatar}</span>
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold">{candidate.name}</div>
                      <div className="text-sm text-base-content/60">
                        {candidate.position}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`badge ${getStatusBadge(candidate.status)}`}
                    >
                      {candidate.status}
                    </span>
                    <div className="text-xs text-base-content/60 mt-1">
                      {candidate.date}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-base-content/60">
                <svg
                  className="w-12 h-12 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
                No candidates found
              </div>
            )}
          </div>
        </div>

        <div className="bg-base-100 p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Upcoming Interviews</h3>
            <button className="btn btn-sm btn-outline">View Calendar</button>
          </div>
          <div className="space-y-4">
            {upcomingInterviews && upcomingInterviews.length > 0 ? (
              upcomingInterviews.map((interview, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <svg
                        className="w-5 h-5 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold">{interview.candidate}</div>
                      <div className="text-sm text-base-content/60">
                        {interview.position}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`badge ${getInterviewBadge(interview.type)}`}
                    >
                      {interview.type}
                    </span>
                    <div className="text-sm font-semibold text-primary mt-1">
                      {interview.time}
                    </div>
                    {interview.date && (
                      <div className="text-xs text-base-content/60">
                        {interview.date}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-base-content/60">
                <svg
                  className="w-12 h-12 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                No upcoming interviews
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
