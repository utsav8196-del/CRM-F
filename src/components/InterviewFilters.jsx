import { ArrowDownAZ, CalendarDays } from "lucide-react";

export default function InterviewFilters({
  sortConfig,
  onSort,
  searchTerm,
  totalResults,
}) {
  const getButtonClass = (key) =>
    sortConfig.key === key
      ? "border-slate-950 bg-slate-950 text-white shadow-lg shadow-slate-950/15"
      : "border-slate-200 bg-white/85 text-slate-700 hover:border-slate-300 hover:bg-white";

  return (
    <div className="crm-panel p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Sort & Filter
          </p>
          <h3 className="mt-2 text-2xl font-bold text-slate-950">
            Refine the interview queue
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${getButtonClass(
              "candidate"
            )}`}
            onClick={() => onSort("candidate")}
          >
            <ArrowDownAZ className="h-[18px] w-[18px]" />
            Sort by Name
          </button>

          <button
            className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${getButtonClass(
              "date"
            )}`}
            onClick={() => onSort("date")}
          >
            <CalendarDays className="h-[18px] w-[18px]" />
            Sort by Date
          </button>
        </div>
      </div>

      {searchTerm && (
        <div className="mt-4 rounded-[20px] border border-teal-100 bg-teal-50/80 px-4 py-3 text-sm text-teal-800">
          Found <strong>{totalResults}</strong> matching interview
          {totalResults === 1 ? "" : "s"} for <strong>{searchTerm}</strong>.
        </div>
      )}
    </div>
  );
}
