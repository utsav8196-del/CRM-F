import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchCandidates,
  addCandidate,
  updateCandidate,
  deleteCandidate as deleteCandidateThunk,
} from "../features/candidate/candidateSlice";
import {
  selectAllCandidates,
  selectCandidateLoading,
  selectCandidateError,
} from "../features/candidate/candidateSelectors";

const initialFormState = {
  name: "",
  email: "",
  phone: "",
  status: "",
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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    } catch (error) {
      console.error("Error saving candidate", error);
      alert(error?.message || "Failed to save candidate");
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
      status: candidate.status || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (candidateId) => {
    try {
      await dispatch(deleteCandidateThunk(candidateId)).unwrap();
      setDeleteConfirm(null);
      alert("Candidate deleted successfully!");
    } catch (error) {
      console.error("Error deleting candidate", error);
      alert(error?.message || "Failed to delete candidate");
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

  const getStatusBadge = (status) => {
    switch (status) {
      case INTERVIEW_ROUNDS.PENDING:
        return "badge-warning";
      case "Scheduled":
        return "badge-info";
      case "Completed":
        return "badge-success";
      default:
        return "badge-ghost";
    }
  };

  const getAvatarInitial = (name) => {
    if (!name || typeof name !== "string") return "?";
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold">Candidates</h2>
          <p className="text-base-content/60 mt-1">
            Manage candidate information
          </p>
        </div>
        <button
          className="btn btn-neutral"
          onClick={() => {
            setEditingCandidate(null);
            setForm(initialFormState);
            setIsModalOpen(true);
          }}
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Candidate
        </button>
      </div>

      <div className="form-control">
        <div className="relative">
          <input
            type="text"
            placeholder="Search candidates by name, email, phone, or status..."
            className="w-full pr-10 pl-4 py-2 input input-bordered focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 btn btn-ghost btn-sm btn-circle"
              onClick={() => setSearchTerm("")}
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="bg-base-100 rounded-xl shadow-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Candidate List</h3>
            <span className="badge badge-lg badge-ghost">
              {filteredCandidates.length}{" "}
              {filteredCandidates.length === 1 ? "candidate" : "candidates"}
            </span>
          </div>

          {error && (
            <div className="alert alert-error mb-4">
              <span>
                {typeof error === "string"
                  ? error
                  : "Something went wrong while loading candidates."}
              </span>
            </div>
          )}

          {isListLoading ? (
            <div className="text-center py-8">
              <span className="loading loading-spinner loading-lg"></span>
              <p className="mt-2">Loading candidates...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Contact</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCandidates.length > 0 ? (
                    filteredCandidates.map((candidate, index) => (
                      <tr key={index}>
                        <td>
                          <div className="flex items-center space-x-3">
                            <div className="avatar placeholder">
                              <div className="bg-neutral text-neutral-content rounded-full p-[13px]  w-12">
                                <span className="text-lg">
                                  {getAvatarInitial(candidate?.name)}
                                </span>
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">
                                {candidate?.name || "Unknown"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
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
                                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                              <span>{candidate?.email || "No email"}</span>
                            </div>
                            <div className="flex items-center gap-2">
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
                                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                              </svg>
                              <span>{candidate?.phone || "No phone"}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`badge ${getStatusBadge(
                              candidate?.status
                            )} badge-lg`}
                          >
                            {candidate?.status || "Unknown"}
                          </span>
                        </td>
                        <td>
                          <div className="flex gap-1">
                            <button
                              className="btn btn-info btn-sm"
                              onClick={() => handleEdit(candidate)}
                              title="Edit Candidate"
                            >
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
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              className="btn btn-error btn-sm"
                              onClick={() => setDeleteConfirm(candidate)}
                              title="Delete Candidate"
                            >
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
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-8">
                        <div className="flex flex-col items-center justify-center text-base-content/60">
                          <svg
                            className="w-16 h-16 mb-4"
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
                          {searchTerm
                            ? "No candidates match your search"
                            : "No candidates found"}
                          {!searchTerm && (
                            <button
                              className="btn btn-primary btn-sm mt-2"
                              onClick={() => setIsModalOpen(true)}
                            >
                              Add Your First Candidate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-6">
              {editingCandidate ? "Edit Candidate" : "Add New Candidate"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Full Name :-</span>
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter candidate name"
                  className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary left-15 box-border-sizing-border-box rounded-xl"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Email Address :-
                  </span>
                </label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange} 
                  type="email"
                  placeholder="Enter email address"
                  className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary left-8 box-border-sizing-border-box rounded-xl"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Phone Number :-
                  </span>
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter phone number"
                  className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary left-6 box-border-sizing-border-box rounded-xl"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Status :-</span>
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="select select-bordered focus:outline-none focus:ring-2 focus:ring-primary left-22 box-border-sizing-border-box rounded-xl"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="modal-action mt-6">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      {editingCandidate ? "Updating..." : "Adding..."}
                    </>
                  ) : editingCandidate ? (
                    "Update Candidate"
                  ) : (
                    "Add Candidate"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Delete</h3>
            <p className="py-4">
              Are you sure you want to delete candidate{" "}
              <strong>{deleteConfirm.name}</strong>? This action cannot be
              undone.
            </p>
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-error"
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
