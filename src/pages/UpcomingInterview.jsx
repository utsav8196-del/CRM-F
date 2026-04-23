import { useEffect, useState } from "react";
import axios from "axios";
import {
  CalendarDays,
  Clock3,
  Filter,
  Link2,
  RefreshCcw,
  UserRound,
} from "lucide-react";

export default function UpcomingInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      await axios.get(`${import.meta.env.VITE_API_URL}/api/interviews/filter`).then((res) => {
        if (res.data.success) {
          setInterviews(res.data.data);
        } else {
          setError("API returned no success response");
        }
      });
    } catch (err) {
      console.error("API Error:", err);
      setError("Server not responding, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const groupInterviewsByDate = (data) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const resetTime = (date) =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const todayReset = resetTime(today).getTime();
    const yesterdayReset = resetTime(yesterday).getTime();

    const todayInterviews = [];
    const yesterdayInterviews = [];
    const upcomingInterviews = [];

    data.forEach((interview) => {
      if (!interview.date) {
        upcomingInterviews.push(interview);
        return;
      }

      const interviewDate = new Date(interview.date);
      const interviewDateReset = resetTime(interviewDate).getTime();

      if (interviewDateReset === todayReset) {
        todayInterviews.push(interview);
      } else if (interviewDateReset === yesterdayReset) {
        yesterdayInterviews.push(interview);
      } else if (interviewDateReset > todayReset) {
        upcomingInterviews.push(interview);
      }
    });

    return { todayInterviews, yesterdayInterviews, upcomingInterviews };
  };

  const applyFilter = (data) => {
    if (filter === "all") return data;
    if (filter === "other") {
      return data.filter(
        (item) => item.round !== "1st Round" && item.round !== "2nd Round"
      );
    }
    return data.filter((item) => item.round === filter);
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  const { todayInterviews, yesterdayInterviews, upcomingInterviews } =
    groupInterviewsByDate(interviews);

  const filteredToday = applyFilter(todayInterviews);
  const filteredYesterday = applyFilter(yesterdayInterviews);
  const filteredUpcoming = applyFilter(upcomingInterviews);

  const formatDate = (value) =>
    value
      ? new Date(value).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Not set";

  const getDaysUntilDate = (dateString) => {
    if (!dateString) return "TBD";
    const today = new Date();
    const targetDate = new Date(dateString);
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} days away` : "Today";
  };

  const getAvatarInitial = (name) => {
    if (!name || typeof name !== "string") return "?";
    return name.charAt(0).toUpperCase();
  };

  const renderInterviewList = (data, title, subtitle = "") => (
    <section className="crm-panel p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Interview Group
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">{title}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {subtitle && <span className="crm-pill">{subtitle}</span>}
          <span className="crm-pill">
            {data.length} interview{data.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {data.length > 0 ? (
        <>
          <div className="crm-table-shell mt-5 hidden xl:block">
            <div className="crm-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Position</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Round</th>
                    <th>CTC</th>
                    <th>Joining</th>
                    <th>Meeting Link</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white">
                            {getAvatarInitial(item.candidate)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {item.candidate || "Unknown"}
                            </p>
                            <p className="text-xs text-slate-400">
                              {item.email || "-"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>{item.position || "-"}</td>
                      <td>{formatDate(item.date)}</td>
                      <td>{item.time || "Not set"}</td>
                      <td>
                        <span className="crm-pill">{item.round || "Not set"}</span>
                      </td>
                      <td>
                        {item.currentCTC || item.expectedCTC
                          ? `${item.currentCTC || "-"} / ${item.expectedCTC || "-"}`
                          : "-"}
                      </td>
                      <td>{formatDate(item.dateOfJoining)}</td>
                      <td>
                        {item.meetingLink ? (
                          <a
                            href={item.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="crm-button-secondary !rounded-xl !px-3 !py-2"
                          >
                            Open Link
                          </a>
                        ) : (
                          <span className="text-slate-400">No link</span>
                        )}
                      </td>
                      <td>
                        <span className="crm-pill">{item.status || "Pending"}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-5 grid gap-4 xl:hidden">
            {data.map((item) => (
              <div key={item._id} className="crm-mobile-card">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white">
                      {getAvatarInitial(item.candidate)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {item.candidate || "Unknown"}
                      </p>
                      <p className="text-sm text-slate-500">
                        {item.position || "-"}
                      </p>
                    </div>
                  </div>
                  <span className="crm-pill">{item.round || "Not set"}</span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CalendarDays className="h-4 w-4 text-slate-400" />
                    <span>{formatDate(item.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock3 className="h-4 w-4 text-slate-400" />
                    <span>{item.time || "Not set"}</span>
                  </div>
                  <div className="text-sm text-slate-600">
                    <span className="font-semibold text-slate-800">Current / Expected:</span>{" "}
                    {item.currentCTC || "-"} / {item.expectedCTC || "-"}
                  </div>
                  <div className="text-sm text-slate-600">
                    <span className="font-semibold text-slate-800">Joining:</span>{" "}
                    {formatDate(item.dateOfJoining)}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="crm-pill">{item.status || "Pending"}</span>
                  {item.meetingLink ? (
                    <a
                      href={item.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="crm-button-secondary !rounded-xl !px-3 !py-2"
                    >
                      <Link2 className="h-4 w-4" />
                      Join
                    </a>
                  ) : (
                    <span className="text-sm text-slate-400">No meeting link</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="crm-empty mt-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-950 text-white">
            <CalendarDays className="h-7 w-7" />
          </div>
          <h3 className="mt-5 text-lg font-semibold text-slate-800">
            No interviews found
          </h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
            {interviews.length === 0
              ? "No interview data is available yet."
              : `No ${title.toLowerCase()} match the current filter.`}
          </p>
          <button onClick={fetchData} className="crm-button-primary mt-5">
            <RefreshCcw className="h-[18px] w-[18px]" />
            Refresh Data
          </button>
        </div>
      )}
    </section>
  );

  if (loading) {
    return (
      <div className="crm-panel flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-teal-600" />
          <p className="mt-4 text-sm font-medium text-slate-600">
            Loading interviews...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="crm-shell overflow-hidden p-6 sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <span className="crm-kicker">Schedule Board</span>
            <h1 className="mt-4 text-3xl font-bold text-slate-950 sm:text-5xl">
              See today, yesterday, and upcoming interviews in one responsive view.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Filter interview rounds, refresh the live schedule, and keep every
              planned conversation easy to scan across devices.
            </p>
          </div>

          <button
            onClick={fetchData}
            className="crm-button-secondary w-full sm:w-auto"
            disabled={loading}
          >
            <RefreshCcw className={`h-[18px] w-[18px] ${loading ? "animate-spin" : ""}`} />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[24px] border border-white/80 bg-white/82 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Today
            </p>
            <p className="mt-3 text-3xl font-bold text-slate-950">
              {filteredToday.length}
            </p>
          </div>
          <div className="rounded-[24px] border border-white/80 bg-white/82 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Upcoming
            </p>
            <p className="mt-3 text-3xl font-bold text-slate-950">
              {filteredUpcoming.length}
            </p>
          </div>
          <div className="rounded-[24px] border border-white/80 bg-white/82 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Yesterday
            </p>
            <p className="mt-3 text-3xl font-bold text-slate-950">
              {filteredYesterday.length}
            </p>
          </div>
        </div>
      </section>

      <section className="crm-panel p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Filters
            </p>
            <h3 className="mt-2 text-2xl font-bold text-slate-950">
              Refine the live schedule
            </h3>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <Filter className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
              <select
                className="crm-select min-w-[220px] pl-11"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
              >
                <option value="all">All Rounds</option>
                <option value="1st Round">1st Round</option>
                <option value="2nd Round">2nd Round</option>
                <option value="other">Other Rounds</option>
              </select>
            </div>
            <span className="crm-pill">
              {filteredToday.length +
                filteredYesterday.length +
                filteredUpcoming.length}{" "}
              interviews
            </span>
          </div>
        </div>

        {error && (
          <div className="mt-5 rounded-[22px] border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}
      </section>

      {renderInterviewList(filteredToday, "Today's Interviews", "Priority")}
      {renderInterviewList(
        filteredUpcoming,
        "Upcoming Interviews",
        getDaysUntilDate(upcomingInterviews[0]?.date)
      )}
      {renderInterviewList(filteredYesterday, "Yesterday's Interviews")}

      {interviews.length > 0 && (
        <div className="crm-panel flex flex-col gap-3 px-5 py-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <UserRound className="h-[18px] w-[18px] text-slate-400" />
            Showing{" "}
            {filteredToday.length + filteredYesterday.length + filteredUpcoming.length}{" "}
            of {interviews.length} total interviews.
          </div>
        </div>
      )}
    </div>
  );
}
