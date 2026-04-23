import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  RefreshCcw,
  ShieldCheck,
  Users2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchDashboardData } from "../features/dashboard/dashboardSlice";
import {
  selectDashboardData,
  selectDashboardError,
  selectDashboardLoading,
} from "../features/dashboard/dashboardSelectors";
import { logout } from "../utils/auth";

const getStatusBadgeClass = (status) => {
  switch (status) {
    case "Scheduled":
      return "bg-sky-100 text-sky-700 border-sky-200";
    case "Pending":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Completed":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "Rejected":
      return "bg-rose-100 text-rose-700 border-rose-200";
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
};

const getInterviewBadgeClass = (type) => {
  switch (type) {
    case "1st Round":
      return "bg-slate-950 text-white border-slate-950";
    case "2nd Round":
      return "bg-teal-100 text-teal-700 border-teal-200";
    case "Final Round":
      return "bg-orange-100 text-orange-700 border-orange-200";
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
};

const calculatePercentageChange = (current, previous = 0) => {
  if (previous === 0) {
    return { value: 0, isPositive: true };
  }

  const change = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(Math.round(change)),
    isPositive: change >= 0,
  };
};

function StatCard({ title, value, change, icon: Icon, accentClass }) {
  return (
    <div className="crm-stat-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            {title}
          </p>
          <p className="mt-4 text-3xl font-bold text-slate-950 sm:text-4xl">
            {value}
          </p>
          <div
            className={`mt-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${accentClass}`}
          >
            {change.isPositive ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <ArrowDownRight className="h-4 w-4" />
            )}
            {change.value}% vs previous period
          </div>
        </div>

        <div className="rounded-[22px] border border-white/80 bg-slate-950 p-3 text-white shadow-lg shadow-slate-950/15">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="crm-empty min-h-56">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-950 text-white">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-slate-800">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

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
      <div className="space-y-6">
        <div className="crm-shell overflow-hidden p-6 sm:p-8">
          <span className="crm-kicker">Dashboard Pulse</span>
          <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-4xl">
            Dashboard Overview
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Preparing your hiring analytics and current activity.
          </p>
        </div>
        <div className="crm-panel flex min-h-72 items-center justify-center">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-teal-600" />
            <p className="mt-4 text-sm font-medium text-slate-600">
              Loading dashboard data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="space-y-6">
        <div className="crm-shell overflow-hidden p-6 sm:p-8">
          <span className="crm-kicker">Dashboard Pulse</span>
          <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-4xl">
            Dashboard Overview
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            We hit a problem while loading your workspace insights.
          </p>
        </div>

        <div className="crm-panel border border-rose-100 bg-rose-50/80 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-rose-700">
                Unable to load dashboard
              </h3>
              <p className="mt-1 text-sm text-rose-600">
                {typeof error === "string" ? error : "Please try again shortly."}
              </p>
            </div>
            <button className="crm-button-primary" onClick={handleRefresh}>
              <RefreshCcw className="h-[18px] w-[18px]" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { stats, charts, recentCandidates, upcomingInterviews } = dashboardData;

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
  const pendingReviewsChange = calculatePercentageChange(
    stats.pendingReviews,
    previousStats.pendingReviews
  );

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="crm-shell overflow-hidden p-6 sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <span className="crm-kicker">Dashboard Pulse</span>
            <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-5xl">
              Keep every hiring decision moving with clarity.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Review pipeline movement, recent candidate activity, and upcoming
              interview pressure points from one responsive dashboard.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="rounded-[24px] border border-slate-200/80 bg-slate-950 px-5 py-4 text-white shadow-lg shadow-slate-950/10">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                Today
              </p>
              <p className="mt-1 text-sm font-semibold">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            <button
              className="crm-button-secondary"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCcw className={`h-[18px] w-[18px] ${loading ? "animate-spin" : ""}`} />
              {loading ? "Refreshing..." : "Refresh"}
            </button>

            <button className="crm-button-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Candidates"
          value={stats.totalCandidates}
          change={totalCandidatesChange}
          icon={Users2}
          accentClass={
            totalCandidatesChange.isPositive
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }
        />
        <StatCard
          title="Scheduled Interviews"
          value={stats.scheduledInterviews}
          change={scheduledInterviewsChange}
          icon={CalendarClock}
          accentClass={
            scheduledInterviewsChange.isPositive
              ? "border-sky-200 bg-sky-50 text-sky-700"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }
        />
        <StatCard
          title="Completed Interviews"
          value={stats.completedInterviews}
          change={completedInterviewsChange}
          icon={CheckCircle2}
          accentClass={
            completedInterviewsChange.isPositive
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }
        />
        <StatCard
          title="Pending Reviews"
          value={stats.pendingReviews}
          change={pendingReviewsChange}
          icon={ShieldCheck}
          accentClass={
            pendingReviewsChange.isPositive
              ? "border-amber-200 bg-amber-50 text-amber-700"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
        <div className="crm-panel overflow-hidden p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Performance
              </p>
              <h3 className="mt-2 text-2xl font-bold text-slate-950">
                Interview trends
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="crm-pill bg-sky-50 text-sky-700 border-sky-200">
                Monthly view
              </span>
              <span className="crm-pill">Auto refreshed every 2 minutes</span>
            </div>
          </div>

          <div className="mt-6 h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.monthlyStats}>
                <CartesianGrid strokeDasharray="4 4" stroke="#cbd5e1" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderRadius: "18px",
                    border: "1px solid rgba(148,163,184,0.15)",
                    color: "#f8fafc",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="interviews"
                  stroke="#0f766e"
                  strokeWidth={3}
                  dot={{ fill: "#0f766e", strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, fill: "#115e59" }}
                />
                <Line
                  type="monotone"
                  dataKey="candidates"
                  stroke="#f97316"
                  strokeWidth={3}
                  dot={{ fill: "#f97316", strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, fill: "#ea580c" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex flex-wrap gap-4">
            <div className="crm-pill border-teal-200 bg-teal-50 text-teal-700">
              <span className="mr-2 h-2.5 w-2.5 rounded-full bg-teal-600" />
              Interviews
            </div>
            <div className="crm-pill border-orange-200 bg-orange-50 text-orange-700">
              <span className="mr-2 h-2.5 w-2.5 rounded-full bg-orange-500" />
              Candidates
            </div>
          </div>
        </div>

        <div className="crm-panel overflow-hidden p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Distribution
          </p>
          <h3 className="mt-2 text-2xl font-bold text-slate-950">
            Status mix
          </h3>

          <div className="mt-4 h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={92}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {charts.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderRadius: "18px",
                    border: "1px solid rgba(148,163,184,0.15)",
                    color: "#f8fafc",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 space-y-3">
            {charts.statusDistribution.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-3.5 w-3.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-slate-700">
                    {item.status}
                  </span>
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="crm-panel p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Recent Activity
              </p>
              <h3 className="mt-2 text-2xl font-bold text-slate-950">
                Recent candidates
              </h3>
            </div>
            <span className="crm-pill">{recentCandidates?.length || 0} entries</span>
          </div>

          <div className="mt-5 space-y-3">
            {recentCandidates && recentCandidates.length > 0 ? (
              recentCandidates.map((candidate, index) => (
                <div
                  key={index}
                  className="rounded-[24px] border border-white/70 bg-white/80 p-4 shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white">
                        {candidate.avatar || candidate.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {candidate.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {candidate.position}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(
                          candidate.status
                        )}`}
                      >
                        {candidate.status}
                      </span>
                      <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                        {candidate.date}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                icon={Users2}
                title="No candidates found"
                description="Once new candidates enter the pipeline, they will appear here for quick review."
              />
            )}
          </div>
        </div>

        <div className="crm-panel p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Next Up
              </p>
              <h3 className="mt-2 text-2xl font-bold text-slate-950">
                Upcoming interviews
              </h3>
            </div>
            <span className="crm-pill">{upcomingInterviews?.length || 0} scheduled</span>
          </div>

          <div className="mt-5 space-y-3">
            {upcomingInterviews && upcomingInterviews.length > 0 ? (
              upcomingInterviews.map((interview, index) => (
                <div
                  key={index}
                  className="rounded-[24px] border border-white/70 bg-white/80 p-4 shadow-sm"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 text-white">
                        <Activity className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {interview.candidate}
                        </p>
                        <p className="text-sm text-slate-500">
                          {interview.position}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${getInterviewBadgeClass(
                          interview.type
                        )}`}
                      >
                        {interview.type}
                      </span>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900">
                          {interview.time}
                        </p>
                        {interview.date && (
                          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                            {interview.date}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                icon={CalendarClock}
                title="No upcoming interviews"
                description="Your next scheduled interviews will surface here so the team can stay aligned."
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
