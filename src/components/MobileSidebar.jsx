import {
  CalendarClock,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  X,
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

export default function MobileSidebar({ isOpen, onClose }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
    navigate("/login", { replace: true });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm" onClick={onClose} />

      <aside className="absolute inset-y-0 left-0 w-[88%] max-w-sm p-4">
        <div className="crm-panel-dark flex h-full flex-col overflow-hidden p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Talent Command
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">HR CRM</h2>
              <p className="mt-2 text-sm text-slate-300">
                Navigate the hiring workspace from one clean mobile hub.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-white"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="mt-8 flex-1 space-y-2">
            {menu.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.path;

              return (
                <Link key={item.path} to={item.path} onClick={onClose}>
                  <div
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium transition ${
                      active
                        ? "bg-white text-slate-950 shadow-lg shadow-black/10"
                        : "text-slate-300 hover:bg-white/8 hover:text-white"
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                        active ? "bg-slate-950 text-white" : "bg-white/8"
                      }`}
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <span>{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-400/20 bg-rose-500/12 px-4 py-3 text-sm font-semibold text-rose-100"
            onClick={handleLogout}
          >
            <LogOut className="h-[18px] w-[18px]" />
            Logout
          </button>
        </div>
      </aside>
    </div>
  );
}
