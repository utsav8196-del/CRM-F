import { Plus, Search } from "lucide-react";

export default function InterviewHeader({
  searchTerm,
  setSearchTerm,
  onAddInterview,
}) {
  return (
    <section className="crm-shell overflow-hidden p-6 sm:p-8">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <span className="crm-kicker">Interview Flow</span>
          <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-5xl">
            Move every interview round through a cleaner command center.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Review candidates, monitor round progression, and update interview
            outcomes from a single responsive workspace.
          </p>
        </div>

        <button className="crm-button-primary w-full sm:w-auto" onClick={onAddInterview}>
          <Plus className="h-[18px] w-[18px]" />
          Add Interview
        </button>
      </div>

      <div className="mt-6">
        <div className="relative max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by candidate, email, position, round, or company..."
            className="crm-field pl-11"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </div>
    </section>
  );
}
