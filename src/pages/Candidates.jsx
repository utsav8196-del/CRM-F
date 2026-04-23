import { useEffect, useState } from "react";
import {
  Mail,
  Pencil,
  Phone,
  Plus,
  Search,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addCandidate,
  deleteCandidate as deleteCandidateThunk,
  fetchCandidates,
  updateCandidate,
} from "../features/candidate/candidateSlice";
import {
  selectAllCandidates,
  selectCandidateError,
  selectCandidateLoading,
} from "../features/candidate/candidateSelectors";

const initialFormState = {
  name: "",
  email: "",
  phone: "",
  position: "",
  status: "",
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case "Pending":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "Scheduled":
      return "border-sky-200 bg-sky-50 text-sky-700";
    case "Completed":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
};

export default function Candidates() {
  const dispatch = useAppDispatch();
  const candidates = useAppSelector(selectAllCandidates);
  const loading = useAppSelector(selectCandidateLoading);
  const error = useAppSelector(selectCandidateError);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState(initialFormState);

  const isListLoading = loading && candidates.length === 0;

  useEffect(() => {
    dispatch(fetchCandidates());
  }, [dispatch]);

  const handleChange = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingCandidate) {
        await dispatch(
          updateCandidate({
            id: editingCandidate._id,
            candidateData: form,
          })
        ).unwrap();
        alert("Candidate updated successfully!");
      } else {
        await dispatch(addCandidate(form)).unwrap();
        alert("Candidate added successfully!");
      }

      handleCloseModal();
    } catch (submitError) {
      console.error("Error saving candidate", submitError);
      alert(submitError?.message || "Failed to save candidate");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (candidate) => {
    setEditingCandidate(candidate);
    setForm({
      name: candidate.name || "",
      email: candidate.email || "",
      phone: candidate.phone || "",
      position: candidate.position || "",
      status: candidate.status || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (candidateId) => {
    try {
      await dispatch(deleteCandidateThunk(candidateId)).unwrap();
      setDeleteConfirm(null);
      alert("Candidate deleted successfully!");
    } catch (deleteError) {
      console.error("Error deleting candidate", deleteError);
      alert(deleteError?.message || "Failed to delete candidate");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCandidate(null);
    setForm(initialFormState);
  };

  const filteredCandidates = candidates.filter(
    (candidate) =>
      candidate?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate?.phone?.includes(searchTerm) ||
      candidate?.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAvatarInitial = (name) => {
    if (!name || typeof name !== "string") return "?";
    return name.charAt(0).toUpperCase();
  };

  const scheduledCount = candidates.filter(
    (candidate) => candidate?.status === "Scheduled"
  ).length;
  const completedCount = candidates.filter(
    (candidate) => candidate?.status === "Completed"
  ).length;

  return (
    <div className="space-y-6">
      <section className="crm-shell overflow-hidden p-6 sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <span className="crm-kicker">Candidate Pipeline</span>
            <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-5xl">
              Keep candidate records clean, visible, and easy to move.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Search, review, edit, and manage every candidate from a single
              responsive workspace built for quick recruiting operations.
            </p>
          </div>

          <button
            className="crm-button-primary w-full sm:w-auto"
            onClick={() => {
              setEditingCandidate(null);
              setForm(initialFormState);
              setIsModalOpen(true);
            }}
          >
            <Plus className="h-[18px] w-[18px]" />
            Add Candidate
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[24px] border border-white/80 bg-white/82 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Total Candidates
            </p>
            <p className="mt-3 text-3xl font-bold text-slate-950">
              {candidates.length}
            </p>
          </div>
          <div className="rounded-[24px] border border-white/80 bg-white/82 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Scheduled
            </p>
            <p className="mt-3 text-3xl font-bold text-slate-950">
              {scheduledCount}
            </p>
          </div>
          <div className="rounded-[24px] border border-white/80 bg-white/82 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Completed
            </p>
            <p className="mt-3 text-3xl font-bold text-slate-950">
              {completedCount}
            </p>
          </div>
        </div>
      </section>

      <section className="crm-panel p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Directory
            </p>
            <h3 className="mt-2 text-2xl font-bold text-slate-950">
              Candidate list
            </h3>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1 sm:min-w-[320px]">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone, or status..."
                className="crm-field pl-11 pr-11"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <span className="crm-pill justify-center">
              {filteredCandidates.length}{" "}
              {filteredCandidates.length === 1 ? "candidate" : "candidates"}
            </span>
          </div>
        </div>

        {error && (
          <div className="mt-5 rounded-[22px] border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm text-rose-700">
            {typeof error === "string"
              ? error
              : "Something went wrong while loading candidates."}
          </div>
        )}

        {isListLoading ? (
          <div className="flex min-h-60 items-center justify-center">
            <div className="text-center">
              <span className="loading loading-spinner loading-lg text-teal-600" />
              <p className="mt-4 text-sm font-medium text-slate-600">
                Loading candidates...
              </p>
            </div>
          </div>
        ) : filteredCandidates.length > 0 ? (
          <>
            <div className="crm-table-shell mt-6 hidden xl:block">
              <div className="crm-table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Candidate</th>
                      <th>Contact</th>
                      <th>Position</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCandidates.map((candidate) => (
                      <tr key={candidate._id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white">
                              {getAvatarInitial(candidate?.name)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">
                                {candidate?.name || "Unknown"}
                              </p>
                              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                                Candidate
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-slate-400" />
                              <span>{candidate?.email || "No email"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-slate-400" />
                              <span>{candidate?.phone || "No phone"}</span>
                            </div>
                          </div>
                        </td>
                        <td>{candidate?.position || "Not set"}</td>
                        <td>
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(
                              candidate?.status
                            )}`}
                          >
                            {candidate?.status || "Unknown"}
                          </span>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <button
                              className="crm-button-secondary !rounded-xl !px-3 !py-2"
                              onClick={() => handleEdit(candidate)}
                              title="Edit Candidate"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              className="crm-button-danger !rounded-xl !px-3 !py-2"
                              onClick={() => setDeleteConfirm(candidate)}
                              title="Delete Candidate"
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
            </div>

            <div className="mt-6 grid gap-4 xl:hidden">
              {filteredCandidates.map((candidate) => (
                <div key={candidate._id} className="crm-mobile-card">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white">
                        {getAvatarInitial(candidate?.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {candidate?.name || "Unknown"}
                        </p>
                        <p className="text-sm text-slate-500">
                          {candidate?.position || "Position not set"}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(
                        candidate?.status
                      )}`}
                    >
                      {candidate?.status || "Unknown"}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <span className="truncate">{candidate?.email || "No email"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <span>{candidate?.phone || "No phone"}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      className="crm-button-secondary flex-1 !rounded-xl !px-3 !py-2"
                      onClick={() => handleEdit(candidate)}
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      className="crm-button-danger flex-1 !rounded-xl !px-3 !py-2"
                      onClick={() => setDeleteConfirm(candidate)}
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
          <div className="crm-empty mt-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-950 text-white">
              <UserRound className="h-7 w-7" />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-slate-800">
              {searchTerm ? "No candidates match your search" : "No candidates found"}
            </h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              {searchTerm
                ? "Try a different search term to find the profile you need."
                : "Start the pipeline by adding your first candidate profile."}
            </p>
            {!searchTerm && (
              <button
                className="crm-button-primary mt-5"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="h-[18px] w-[18px]" />
                Add Your First Candidate
              </button>
            )}
          </div>
        )}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
          <div className="crm-shell w-full max-w-3xl overflow-hidden">
            <div className="border-b border-slate-200/80 px-5 py-5 sm:px-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Candidate Form
              </p>
              <h3 className="mt-2 text-2xl font-bold text-slate-950">
                {editingCandidate ? "Edit Candidate" : "Add New Candidate"}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="crm-label">Full Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter candidate name"
                    className="crm-field"
                    required
                  />
                </div>

                <div>
                  <label className="crm-label">Email Address</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="Enter email address"
                    className="crm-field"
                    required
                  />
                </div>

                <div>
                  <label className="crm-label">Phone Number</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter phone number"
                    className="crm-field"
                    required
                  />
                </div>

                <div>
                  <label className="crm-label">Position</label>
                  <input
                    name="position"
                    value={form.position}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter position"
                    className="crm-field"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="crm-label">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="crm-select"
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="crm-button-secondary"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="crm-button-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? editingCandidate
                      ? "Updating..."
                      : "Adding..."
                    : editingCandidate
                    ? "Update Candidate"
                    : "Add Candidate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
          <div className="crm-shell w-full max-w-md p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-500">
              Confirm Delete
            </p>
            <h3 className="mt-2 text-2xl font-bold text-slate-950">
              Delete candidate?
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Are you sure you want to delete{" "}
              <strong>{deleteConfirm.name}</strong>? This action cannot be
              undone.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                className="crm-button-secondary"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="crm-button-danger"
                onClick={() => handleDelete(deleteConfirm._id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
