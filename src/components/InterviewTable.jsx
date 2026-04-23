import { useEffect, useRef, useState } from "react";
import {
  Building2,
  CalendarDays,
  Mail,
  MessageSquareText,
  Pencil,
  Phone,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import useToast from "../hooks/useToast";
import { INTERVIEW_STATUS_LIST } from "../utils/constant";

const getAvatarInitial = (name) => name?.charAt(0)?.toUpperCase() || "?";
const getCandidateName = (name) => name || "Unknown Candidate";

const formatDate = (value) => {
  if (!value) return "Not set";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getStatusClass = (status) => {
  switch (status) {
    case "Offer Sent":
      return "border-sky-200 bg-sky-50 text-sky-700";
    case "Offer Accepted":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "Offer Declined":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "Need to do 2nd Round":
      return "border-amber-200 bg-amber-50 text-amber-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
};

export default function InterviewTable({
  interviews = [],
  title,
  badgeColor = "border-slate-200 bg-slate-50 text-slate-700",
  onEdit,
  onDelete,
  onStatusUpdate,
}) {
  const { showSuccess, showError } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [activities, setActivities] = useState([]);
  const [editStatus, setEditStatus] = useState("");
  const [editNote, setEditNote] = useState("");

  const activityEndRef = useRef(null);

  useEffect(() => {
    if (!isModalOpen) return undefined;

    const timer = setInterval(() => {
      setActivities((prev) => [
        {
          id: Date.now(),
          text: `Profile viewed at ${new Date().toLocaleTimeString()}`,
        },
        ...prev,
      ]);
    }, 4000);

    return () => clearInterval(timer);
  }, [isModalOpen]);

  useEffect(() => {
    activityEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activities]);

  const openCandidateModal = (candidate) => {
    setSelectedCandidate(candidate);
    setEditStatus(candidate.status);
    setEditNote("");
    setActivities([]);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async () => {
    try {
      await onStatusUpdate(selectedCandidate._id, {
        status: editStatus,
      });

      setSelectedCandidate((prev) =>
        prev ? { ...prev, status: editStatus } : prev
      );

      showSuccess("Status updated");

      setActivities((prev) => [
        {
          id: Date.now(),
          text: `Status changed to "${editStatus}"`,
        },
        ...prev,
      ]);
    } catch {
      showError("Failed to update status");
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(deleteConfirm._id);
      setDeleteConfirm(null);
      showSuccess("Interview deleted");
    } catch {
      showError("Delete failed");
    }
  };

  return (
    <>
      <section className="crm-table-shell p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Interview Round
            </p>
            <h3 className="mt-2 text-2xl font-bold text-slate-950">{title}</h3>
          </div>
          <span
            className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold ${badgeColor}`}
          >
            {interviews.length} item{interviews.length === 1 ? "" : "s"}
          </span>
        </div>

        {interviews.length > 0 ? (
          <>
            <div className="crm-table-scroll mt-5 hidden xl:block">
              <table>
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Contact</th>
                    <th>Position</th>
                    <th>Date</th>
                    <th>Round</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {interviews.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => openCandidateModal(item)}
                            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white shadow-lg shadow-slate-950/15"
                          >
                            {getAvatarInitial(item.candidate)}
                          </button>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {getCandidateName(item.candidate)}
                            </p>
                            <p className="text-xs text-slate-400">
                              {item.currentCompany || "No current company"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-slate-400" />
                            <span>{item.email || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-slate-400" />
                            <span>{item.phone || "N/A"}</span>
                          </div>
                        </div>
                      </td>

                      <td>{item.position || "N/A"}</td>
                      <td>{formatDate(item.date)}</td>
                      <td>
                        <span className="crm-pill">{item.round || "N/A"}</span>
                      </td>

                      <td>
                        <select
                          value={item.status}
                          onChange={(event) =>
                            onStatusUpdate(item._id, {
                              status: event.target.value,
                            })
                          }
                          className="crm-select !rounded-xl !py-2"
                        >
                          {INTERVIEW_STATUS_LIST.map((status) => (
                            <option key={status}>{status}</option>
                          ))}
                        </select>
                      </td>

                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => onEdit(item)}
                            className="crm-button-secondary !rounded-xl !px-3 !py-2"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(item)}
                            className="crm-button-danger !rounded-xl !px-3 !py-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 grid gap-4 xl:hidden">
              {interviews.map((item) => (
                <div key={item._id} className="crm-mobile-card">
                  <div className="flex items-start justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => openCandidateModal(item)}
                      className="flex items-center gap-3 text-left"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white">
                        {getAvatarInitial(item.candidate)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {getCandidateName(item.candidate)}
                        </p>
                        <p className="text-sm text-slate-500">
                          {item.position || "No position"}
                        </p>
                      </div>
                    </button>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <span className="truncate">{item.email || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <span>{item.phone || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CalendarDays className="h-4 w-4 text-slate-400" />
                      <span>{formatDate(item.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <ShieldCheck className="h-4 w-4 text-slate-400" />
                      <span>{item.round || "N/A"}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <select
                      value={item.status}
                      onChange={(event) =>
                        onStatusUpdate(item._id, {
                          status: event.target.value,
                        })
                      }
                      className="crm-select !rounded-xl !py-2"
                    >
                      {INTERVIEW_STATUS_LIST.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="crm-button-secondary flex-1 !rounded-xl !px-3 !py-2"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(item)}
                      className="crm-button-danger flex-1 !rounded-xl !px-3 !py-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="crm-empty mt-5 min-h-52">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-950 text-white">
              <CalendarDays className="h-7 w-7" />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-slate-800">
              No interviews found
            </h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Once candidates reach this round, they will show up here for quick
              review and action.
            </p>
          </div>
        )}
      </section>

      {isModalOpen && selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 px-4 py-6 backdrop-blur-sm">
          <div className="crm-shell w-full max-w-6xl overflow-hidden">
            <div className="flex flex-col gap-4 border-b border-slate-200/80 bg-slate-950 px-5 py-5 text-white sm:flex-row sm:items-start sm:justify-between sm:px-6">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-white/12 text-lg font-bold">
                  {getAvatarInitial(selectedCandidate.candidate)}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    Candidate Profile
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-white">
                    {selectedCandidate.candidate}
                  </h3>
                  <p className="mt-1 text-sm text-slate-300">
                    {selectedCandidate.position || "No position set"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="border-b border-slate-200/80 p-5 lg:border-b-0 lg:border-r lg:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Details
                </p>
                <div className="mt-4 grid gap-4">
                  <div className="rounded-[22px] border border-slate-100 bg-slate-50/90 p-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                          Email
                        </p>
                        <p className="mt-2 text-sm font-medium text-slate-800">
                          {selectedCandidate.email || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                          Phone
                        </p>
                        <p className="mt-2 text-sm font-medium text-slate-800">
                          {selectedCandidate.phone || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                          Date
                        </p>
                        <p className="mt-2 text-sm font-medium text-slate-800">
                          {formatDate(selectedCandidate.date)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                          Time
                        </p>
                        <p className="mt-2 text-sm font-medium text-slate-800">
                          {selectedCandidate.time || "Not set"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[22px] border border-slate-100 bg-white p-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex items-start gap-3">
                        <Building2 className="mt-0.5 h-[18px] w-[18px] text-slate-400" />
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                            Current Company
                          </p>
                          <p className="mt-1 text-sm font-medium text-slate-800">
                            {selectedCandidate.currentCompany || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <ShieldCheck className="mt-0.5 h-[18px] w-[18px] text-slate-400" />
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                            Current Round
                          </p>
                          <p className="mt-1 text-sm font-medium text-slate-800">
                            {selectedCandidate.round || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <CalendarDays className="mt-0.5 h-[18px] w-[18px] text-slate-400" />
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                            Joining Date
                          </p>
                          <p className="mt-1 text-sm font-medium text-slate-800">
                            {formatDate(selectedCandidate.dateOfJoining)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="mt-0.5 h-[18px] w-[18px] text-slate-400" />
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                            Notice Period
                          </p>
                          <p className="mt-1 text-sm font-medium text-slate-800">
                            {selectedCandidate.noticePeriod || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 lg:p-6">
                <div className="rounded-[24px] border border-slate-100 bg-slate-50/85 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Status Control
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
                    <select
                      value={editStatus}
                      onChange={(event) => setEditStatus(event.target.value)}
                      className="crm-select"
                    >
                      {INTERVIEW_STATUS_LIST.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>

                    <button
                      onClick={handleStatusUpdate}
                      className="crm-button-primary"
                    >
                      Update Status
                    </button>
                  </div>
                </div>

                <div className="mt-4 rounded-[24px] border border-slate-100 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Add Note
                  </p>
                  <textarea
                    value={editNote}
                    onChange={(event) => setEditNote(event.target.value)}
                    className="crm-textarea mt-4"
                    placeholder="Capture an interview note, hiring signal, or follow-up detail..."
                  />
                  <button
                    onClick={() => {
                      if (!editNote.trim()) return;
                      setActivities((prev) => [
                        { id: Date.now(), text: editNote },
                        ...prev,
                      ]);
                      setEditNote("");
                    }}
                    className="crm-button-secondary mt-3"
                  >
                    <MessageSquareText className="h-[18px] w-[18px]" />
                    Save Note
                  </button>
                </div>

                <div className="mt-4 rounded-[24px] border border-slate-100 bg-slate-50/90 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Activity Timeline
                  </p>
                  <div className="mt-4 max-h-[320px] space-y-3 overflow-y-auto pr-1">
                    {activities.length > 0 ? (
                      activities.map((activity) => (
                        <div
                          key={activity.id}
                          className="rounded-[18px] border border-slate-100 bg-white p-3 text-sm text-slate-700 shadow-sm"
                        >
                          {activity.text}
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[18px] border border-dashed border-slate-200 bg-white/75 p-4 text-sm text-slate-500">
                        Open the profile and add notes to start building the
                        activity timeline.
                      </div>
                    )}
                    <div ref={activityEndRef} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
          <div className="crm-shell w-full max-w-md p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-500">
              Delete Interview
            </p>
            <h3 className="mt-2 text-2xl font-bold text-slate-950">
              Remove this interview?
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Delete the interview record for{" "}
              <strong>{deleteConfirm.candidate}</strong>? This action cannot be
              undone.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="crm-button-secondary"
              >
                Cancel
              </button>
              <button onClick={handleDelete} className="crm-button-danger">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
