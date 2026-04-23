import {
  CalendarClock,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

const menu = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Candidates", path: "/candidates", icon: Users },
  { name: "Interviews", path: "/interviews", icon: CalendarClock },
  {
    name: "Upcoming Interviews",
    path: "/upcoming-interviews",
    icon: CalendarDays,
  },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[19rem] p-4 lg:block">
      <div className="crm-panel-dark flex h-full flex-col overflow-hidden p-5">
        <div className="rounded-[24px] border border-white/10 bg-white/6 p-5">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-teal-400" />
            <span className="h-3 w-3 rounded-full bg-amber-400" />
            <span className="h-3 w-3 rounded-full bg-rose-400" />
          </div>
          <p className="text-xs uppercase tracking-[0.26em] text-slate-400">
            Talent Command
          </p>
          <h2 className="mt-3 text-2xl font-bold text-white">HR CRM</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Modernize your hiring pipeline with a calmer, clearer workspace.
          </p>
        </div>

        <nav className="mt-8 flex-1 space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.path;

            return (
              <Link key={item.path} to={item.path}>
                <div
                  className={`group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium transition ${
                    active
                      ? "bg-white text-slate-950 shadow-lg shadow-black/10"
                      : "text-slate-300 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl transition ${
                      active
                        ? "bg-slate-950 text-white"
                        : "bg-white/8 text-slate-300 group-hover:bg-white/12"
                    }`}
                  >
                      <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="truncate">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 rounded-[24px] border border-white/10 bg-white/6 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
            Team Pulse
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Keep candidate updates, interviews, and decisions moving from one
            focused workspace.
          </p>
        </div>

        <button
          type="button"
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-400/20 bg-rose-500/12 px-4 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/20"
          onClick={handleLogout}
        >
          <LogOut className="h-[18px] w-[18px]" />
          Logout
        </button>
      </div>
    </aside>
  );
}
