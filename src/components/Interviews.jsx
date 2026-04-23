import { useEffect, useState } from "react";
import axios from "axios";
import {
  BriefcaseBusiness,
  CircleOff,
  ClockArrowUp,
  Handshake,
  ShieldAlert,
  UserRoundCheck,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addInterview,
  deleteInterview as deleteInterviewThunk,
  fetchInterviews,
  hideModal,
  showModal,
  updateInterview,
} from "../features/interviews/interviewsSlice";
import {
  selectAllInterviews,
  selectInterviewError,
  selectInterviewLoading,
  selectModalState,
  selectSelectedInterview,
} from "../features/interviews/interviewsSelectors";
import useToast from "../hooks/useToast";
import InterviewTable from "./InterviewTable";
import InterviewModal from "./InterviewModal";
import InterviewHeader from "./InterviewHeader";
import InterviewFilters from "./InterviewFilters";
import { INTERVIEW_ROUNDS } from "../utils/constant";

const initialInterviewState = {
  candidate: "",
  email: "",
  phone: "",
  position: "",
  date: "",
  time: "",
  meetingLink: "",
  status: "",
  round: INTERVIEW_ROUNDS.PENDING,
  currentCTC: "",
  expectedCTC: "",
  totalExperience: "",
  dateOfJoining: "",
  noticePeriod: "",
  currentCompany: "",
};

function RoundStatCard({ title, value, icon: Icon, accent }) {
  return (
    <div className="rounded-[24px] border border-white/80 bg-white/82 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            {title}
          </p>
          <p className="mt-3 text-3xl font-bold text-slate-950">{value}</p>
        </div>
        <div className={`rounded-[20px] p-3 text-white ${accent}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default function Interviews() {
  const dispatch = useAppDispatch();
  const { showSuccess, showError, showWarning } = useToast();

  const interviews = useAppSelector(selectAllInterviews);
  const loading = useAppSelector(selectInterviewLoading);
  const error = useAppSelector(selectInterviewError);
  const modalState = useAppSelector(selectModalState);
  const selectedInterview = useAppSelector(selectSelectedInterview);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [newInterview, setNewInterview] = useState(initialInterviewState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const showInitialLoader = loading && interviews.length === 0;

  useEffect(() => {
    dispatch(fetchInterviews());
  }, [dispatch]);

  useEffect(() => {
    if (!modalState.show) {
      setNewInterview(initialInterviewState);
      return;
    }

    if (modalState.editing && selectedInterview) {
      setNewInterview({
        candidate: selectedInterview.candidate || "",
        email: selectedInterview.email || "",
        phone: selectedInterview.phone || "",
        position: selectedInterview.position || "",
        date: selectedInterview.date || "",
        time: selectedInterview.time || "",
        meetingLink: selectedInterview.meetingLink || "",
        status: selectedInterview.status || "",
        round: selectedInterview.round || "",
        currentCTC: selectedInterview.currentCTC || "",
        expectedCTC: selectedInterview.expectedCTC || "",
        totalExperience: selectedInterview.totalExperience || "",
        dateOfJoining: selectedInterview.dateOfJoining || "",
        noticePeriod: selectedInterview.noticePeriod || "",
        currentCompany: selectedInterview.currentCompany || "",
      });
    } else {
      setNewInterview(initialInterviewState);
    }
  }, [modalState.show, modalState.editing, selectedInterview]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filterInterviewsBySearch = (interviewList) => {
    if (!searchTerm.trim()) return interviewList;

    const lower = searchTerm.toLowerCase();
    return interviewList.filter(
      (item) =>
        item?.candidate?.toLowerCase().includes(lower) ||
        item?.email?.toLowerCase().includes(lower) ||
        item?.position?.toLowerCase().includes(lower) ||
        item?.round?.toLowerCase().includes(lower) ||
        item?.status?.toLowerCase().includes(lower) ||
        item?.currentCompany?.toLowerCase().includes(lower)
    );
  };

  const sortedInterviews = (interviewList) => {
    if (!sortConfig.key) return interviewList;

    return [...interviewList].sort((a, b) => {
      const aValue = a[sortConfig.key] || "";
      const bValue = b[sortConfig.key] || "";

      if (
        ["currentCTC", "expectedCTC", "totalExperience", "noticePeriod"].includes(
          sortConfig.key
        )
      ) {
        const numA = parseFloat(aValue) || 0;
        const numB = parseFloat(bValue) || 0;
        return sortConfig.direction === "asc" ? numA - numB : numB - numA;
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  const pendingInterviews = sortedInterviews(
    filterInterviewsBySearch(
      interviews.filter((item) => item.round === INTERVIEW_ROUNDS.PENDING)
    )
  );
  const firstRoundInterviews = sortedInterviews(
    filterInterviewsBySearch(
      interviews.filter((item) => item.round === INTERVIEW_ROUNDS.FIRSTROUND)
    )
  );
  const secondRoundInterviews = sortedInterviews(
    filterInterviewsBySearch(
      interviews.filter((item) => item.round === INTERVIEW_ROUNDS.SECONDROUND)
    )
  );
  const finalRoundInterviews = sortedInterviews(
    filterInterviewsBySearch(
      interviews.filter((item) => item.round === INTERVIEW_ROUNDS.FINALROUND)
    )
  );
  const hiredInterviews = sortedInterviews(
    filterInterviewsBySearch(
      interviews.filter((item) => item.round === INTERVIEW_ROUNDS.HIRED)
    )
  );
  const rejectedInterviews = sortedInterviews(
    filterInterviewsBySearch(
      interviews.filter((item) => item.round === INTERVIEW_ROUNDS.REJECTED)
    )
  );

  const totalResults =
    firstRoundInterviews.length +
    pendingInterviews.length +
    secondRoundInterviews.length +
    finalRoundInterviews.length +
    hiredInterviews.length +
    rejectedInterviews.length;

  const resetForm = () => setNewInterview(initialInterviewState);

  const handleSubmitInterview = async () => {
    if (
      !newInterview.candidate ||
      !newInterview.phone ||
      !newInterview.email ||
      !newInterview.position
    ) {
      showWarning("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      if (modalState.editing && selectedInterview?._id) {
        await dispatch(
          updateInterview({
            id: selectedInterview._id,
            interviewData: newInterview,
          })
        ).unwrap();
        showSuccess("Interview updated successfully!");
      } else {
        await dispatch(addInterview({ ...newInterview })).unwrap();
        showSuccess("Interview added successfully!");
      }
      dispatch(hideModal());
      resetForm();
    } catch (err) {
      console.error("Error saving interview", err);
      showError(err?.message || "Failed to save interview");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusOrRoundUpdate = async (interviewId, updates) => {
    const currentInterview = interviews.find((item) => item._id === interviewId);
    if (!currentInterview) {
      showError("Interview not found");
      return;
    }

    try {
      await dispatch(
        updateInterview({
          id: interviewId,
          interviewData: { ...currentInterview, ...updates },
        })
      ).unwrap();

      if (updates.round) {
        showSuccess(`Candidate moved to ${updates.round} successfully!`);
      } else if (updates.status) {
        showSuccess("Status updated successfully!");
      }
    } catch (err) {
      console.error("Error updating interview", err);
      showError(err?.message || "Failed to update interview");
    }
  };

  const handleDeleteInterview = async (interviewId) => {
    if (!window.confirm("Are you sure you want to delete this interview?")) {
      return;
    }

    try {
      await dispatch(deleteInterviewThunk(interviewId)).unwrap();
      showSuccess("Interview deleted successfully!");
    } catch (err) {
      console.error("Error deleting interview", err);
      showError(err?.message || "Failed to delete interview");
    }
  };

  const sendMail = async (interview) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/email/send`, {
        email: interview.email,
        candidate: interview.candidate,
        position: interview.position,
        date: interview.date,
        time: interview.time,
        meetingLink: interview.meetingLink || "https://meet.google.com/",
      });
      showSuccess("Email sent successfully!");
    } catch (err) {
      console.error(err);
      showError("Failed to send email");
    }
  };

  return (
    <div className="space-y-6">
      <InterviewHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAddInterview={() => {
          resetForm();
          dispatch(showModal());
        }}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <RoundStatCard
          title="1st Round"
          value={firstRoundInterviews.length}
          icon={BriefcaseBusiness}
          accent="bg-slate-950"
        />
        <RoundStatCard
          title="2nd Round"
          value={secondRoundInterviews.length}
          icon={ClockArrowUp}
          accent="bg-teal-600"
        />
        <RoundStatCard
          title="Final Round"
          value={finalRoundInterviews.length}
          icon={UserRoundCheck}
          accent="bg-orange-500"
        />
        <RoundStatCard
          title="Pending"
          value={pendingInterviews.length}
          icon={ShieldAlert}
          accent="bg-amber-500"
        />
        <RoundStatCard
          title="Hired"
          value={hiredInterviews.length}
          icon={Handshake}
          accent="bg-emerald-600"
        />
        <RoundStatCard
          title="Rejected"
          value={rejectedInterviews.length}
          icon={CircleOff}
          accent="bg-rose-600"
        />
      </section>

      <div className="crm-panel p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Round Logic
            </p>
            <h3 className="mt-2 text-2xl font-bold text-slate-950">
              Interview progression stays explicit
            </h3>
          </div>
          <span className="crm-pill">{totalResults} visible interviews</span>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          Candidates remain in their current round table until you change their
          round. Updating status changes the outcome without automatically moving
          them to a new stage.
        </p>
      </div>

      {error && (
        <div className="rounded-[22px] border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm text-rose-700">
          {typeof error === "string" ? error : "Unable to load interviews."}
        </div>
      )}

      {showInitialLoader && (
        <div className="crm-panel flex min-h-60 items-center justify-center">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-teal-600" />
            <p className="mt-4 text-sm font-medium text-slate-600">
              Loading interviews...
            </p>
          </div>
        </div>
      )}

      <InterviewFilters
        sortConfig={sortConfig}
        onSort={handleSort}
        searchTerm={searchTerm}
        totalResults={totalResults}
      />

      {!showInitialLoader && (
        <>
          <InterviewTable
            interviews={firstRoundInterviews}
            title="1st Round Interviews"
            badgeColor="border-slate-200 bg-slate-50 text-slate-700"
            onEdit={(interview) => dispatch(showModal(interview))}
            onDelete={handleDeleteInterview}
            onSendEmail={sendMail}
            onStatusUpdate={handleStatusOrRoundUpdate}
          />

          <InterviewTable
            interviews={secondRoundInterviews}
            title="2nd Round Interviews"
            badgeColor="border-teal-200 bg-teal-50 text-teal-700"
            onEdit={(interview) => dispatch(showModal(interview))}
            onDelete={handleDeleteInterview}
            onSendEmail={sendMail}
            onStatusUpdate={handleStatusOrRoundUpdate}
          />

          <InterviewTable
            interviews={finalRoundInterviews}
            title="Final Round Interviews"
            badgeColor="border-orange-200 bg-orange-50 text-orange-700"
            onEdit={(interview) => dispatch(showModal(interview))}
            onDelete={handleDeleteInterview}
            onSendEmail={sendMail}
            onStatusUpdate={handleStatusOrRoundUpdate}
          />

          <InterviewTable
            interviews={pendingInterviews}
            title="Pending Interviews"
            badgeColor="border-amber-200 bg-amber-50 text-amber-700"
            onEdit={(interview) => dispatch(showModal(interview))}
            onDelete={handleDeleteInterview}
            onSendEmail={sendMail}
            onStatusUpdate={handleStatusOrRoundUpdate}
          />

          <InterviewTable
            interviews={hiredInterviews}
            title="Hired Candidates"
            badgeColor="border-emerald-200 bg-emerald-50 text-emerald-700"
            onEdit={(interview) => dispatch(showModal(interview))}
            onDelete={handleDeleteInterview}
            onSendEmail={sendMail}
            onStatusUpdate={handleStatusOrRoundUpdate}
          />

          <InterviewTable
            interviews={rejectedInterviews}
            title="Rejected Candidates"
            badgeColor="border-rose-200 bg-rose-50 text-rose-700"
            onEdit={(interview) => dispatch(showModal(interview))}
            onDelete={handleDeleteInterview}
            onSendEmail={sendMail}
            onStatusUpdate={handleStatusOrRoundUpdate}
          />
        </>
      )}

      <InterviewModal
        showModal={modalState.show}
        editingInterview={modalState.editing ? selectedInterview : null}
        newInterview={newInterview}
        setNewInterview={setNewInterview}
        loading={isSubmitting}
        onClose={() => {
          dispatch(hideModal());
          resetForm();
        }}
        onSubmit={handleSubmitInterview}
      />
    </div>
  );
}
