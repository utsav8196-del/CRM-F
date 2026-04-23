import { useState } from "react";
import { Menu, Sparkles } from "lucide-react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MobileSidebar from "../components/MobileSidebar";

const PAGE_META = {
  "/": {
    title: "Dashboard Overview",
    description: "Track the health of your hiring pipeline at a glance.",
  },
  "/candidates": {
    title: "Candidates",
    description: "Manage candidate profiles, contacts, and hiring status.",
  },
  "/interviews": {
    title: "Interviews",
    description: "Coordinate interview rounds, timelines, and follow-ups.",
  },
  "/upcoming-interviews": {
    title: "Upcoming Interviews",
    description: "Stay ahead of every scheduled conversation and deadline.",
  },
  "/settings": {
    title: "Settings",
    description: "Fine-tune account preferences, security, and notifications.",
  },
};

export default function MainLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  const pageMeta = PAGE_META[pathname] || PAGE_META["/"];

  return (
    <div className="relative min-h-screen">
      <Sidebar />
      <MobileSidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:pl-[19rem]">
        <header className="sticky top-0 z-30 px-4 pt-4 md:px-8">
          <div className="crm-shell mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 sm:px-5 md:px-6">
            <div className="flex min-w-0 items-start gap-3">
              <button
                type="button"
                className="crm-button-secondary lg:hidden !rounded-2xl !px-3 !py-3"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="min-w-0">
                <span className="crm-kicker">
                  <Sparkles className="h-3.5 w-3.5" />
                  CRM Workspace
                </span>
                <h1 className="mt-3 truncate text-xl font-bold text-slate-950 sm:text-2xl">
                  {pageMeta.title}
                </h1>
                <p className="mt-1 hidden max-w-2xl text-sm text-slate-600 sm:block">
                  {pageMeta.description}
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <div className="rounded-2xl border border-slate-200/80 bg-slate-950 px-4 py-3 text-right text-white shadow-lg shadow-slate-950/10">
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                  Live Date
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="crm-page pt-4 md:pt-6">
          <div className="mx-auto max-w-[1600px]">{children || <Outlet />}</div>
        </main>
      </div>
    </div>
  );
}
