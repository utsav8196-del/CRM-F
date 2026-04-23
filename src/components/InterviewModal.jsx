import { useEffect, useRef, useState } from "react";
import { CalendarDays, Clock3, Link2, UserRound, X } from "lucide-react";
import { INTERVIEW_ROUND_LIST } from "../utils/constant";

export default function InterviewModal({
  showModal,
  editingInterview,
  newInterview,
  setNewInterview,
  loading,
  onClose,
  onSubmit,
}) {
  const [formErrors, setFormErrors] = useState({});
  const [isUsingDefaultLink, setIsUsingDefaultLink] = useState(true);
  const [emailStatus, setEmailStatus] = useState("");
  const [emailUsed, setEmailUsed] = useState(false);
  const [phoneExists, setPhoneExists] = useState(false);
  const [phoneChecking, setPhoneChecking] = useState(false);
  const [emailChecking, setEmailChecking] = useState(false);
  const emailTimeoutRef = useRef(null);
  const phoneTimeoutRef = useRef(null);

  const DEFAULT_MEETING_LINK = "https://meet.google.com/abc-defg-hij";
  const isPendingRound = newInterview.round === "Pending";

  useEffect(() => {
    if (showModal && !editingInterview) {
      setNewInterview((prev) => ({
        ...prev,
        meetingLink: DEFAULT_MEETING_LINK,
        round: "Pending",
      }));
      setIsUsingDefaultLink(true);
      setEmailStatus("");
      setEmailUsed(false);
      setPhoneExists(false);
      setFormErrors({});
    } else if (showModal && editingInterview) {
      setEmailUsed(false);
      setPhoneExists(false);
      setFormErrors({});
    }
  }, [showModal, editingInterview, setNewInterview]);

  useEffect(() => {
    if (newInterview.round === "Pending") {
      setEmailStatus("Meeting link will be shared when the candidate reaches a scheduled round.");
    } else if (["1st Round", "2nd Round"].includes(newInterview.round)) {
      setEmailStatus("Meeting link will be sent automatically for scheduled rounds.");
    } else {
      setEmailStatus("");
    }
  }, [newInterview.round]);

  if (!showModal) return null;

  const checkPhoneDuplicate = async (phone) => {
    if (!phone || phone.length < 10) {
      setPhoneExists(false);
      return;
    }

    if (editingInterview && editingInterview.phone === phone) {
      setPhoneExists(false);
      return;
    }

    setPhoneChecking(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/interviews/check-phone`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: phone.trim() }),
        }
      );

      const data = await res.json();
      setPhoneExists(data.exists);

      if (data.exists) {
        setFormErrors((prev) => ({
          ...prev,
          phone: "This phone number is already in use",
        }));
      } else {
        setFormErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.phone;
          return newErrors;
        });
      }
    } catch (err) {
      console.error("Phone check error:", err);
    } finally {
      setPhoneChecking(false);
    }
  };

  const checkEmailDuplicate = async (email) => {
    if (!email || !email.includes("@")) {
      setEmailUsed(false);
      return;
    }

    if (editingInterview && editingInterview.email === email) {
      setEmailUsed(false);
      return;
    }

    setEmailChecking(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/interviews/check-email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim() }),
        }
      );

      const data = await res.json();
      setEmailUsed(data.exists);

      if (data.exists) {
        setFormErrors((prev) => ({
          ...prev,
          email: "This email is already in use",
        }));
      } else {
        setFormErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.email;
          return newErrors;
        });
      }
    } catch (err) {
      console.error("Email check error:", err);
    } finally {
      setEmailChecking(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!newInterview.candidate?.trim()) {
      errors.candidate = "Candidate name is required";
    }

    if (!newInterview.email?.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(newInterview.email)) {
      errors.email = "Email is invalid";
    }

    if (!newInterview.phone?.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(newInterview.phone.replace(/\D/g, ""))) {
      errors.phone = "Phone number must be 10 digits";
    }

    if (!newInterview.position?.trim()) {
      errors.position = "Position is required";
    }

    if (newInterview.currentCTC && Number.isNaN(Number(newInterview.currentCTC))) {
      errors.currentCTC = "Current CTC must be a number";
    }

    if (newInterview.expectedCTC && Number.isNaN(Number(newInterview.expectedCTC))) {
      errors.expectedCTC = "Expected CTC must be a number";
    }

    if (
      newInterview.totalExperience &&
      Number.isNaN(Number(newInterview.totalExperience))
    ) {
      errors.totalExperience = "Total experience must be a number";
    }

    if (phoneExists) {
      errors.phone = "This phone number is already in use";
    }

    if (emailUsed) {
      errors.email = "This email is already in use";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const interviewData = {
      ...newInterview,
      meetingLink: isPendingRound
        ? ""
        : newInterview.meetingLink || DEFAULT_MEETING_LINK,
    };

    setNewInterview(interviewData);

    setTimeout(() => {
      onSubmit();
    }, 0);
  };

  const handleInputChange = (field, value) => {
    setNewInterview((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "phone") {
      if (phoneTimeoutRef.current) clearTimeout(phoneTimeoutRef.current);
      phoneTimeoutRef.current = setTimeout(() => {
        checkPhoneDuplicate(value);
      }, 1000);
    } else if (field === "email") {
      if (emailTimeoutRef.current) clearTimeout(emailTimeoutRef.current);
      emailTimeoutRef.current = setTimeout(() => {
        checkEmailDuplicate(value);
      }, 1000);
    }

    if (field === "meetingLink") {
      if (value === DEFAULT_MEETING_LINK) {
        setIsUsingDefaultLink(true);
      } else if (value !== DEFAULT_MEETING_LINK && value !== "") {
        setIsUsingDefaultLink(false);
      }
    }

    if (field === "round") {
      if (value === "Pending") {
        setEmailStatus("Meeting link will be shared when the candidate reaches a scheduled round.");
      } else if (["1st Round", "2nd Round"].includes(value)) {
        setEmailStatus("Meeting link will be sent automatically for scheduled rounds.");
      } else {
        setEmailStatus("");
      }
    }

    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleUseDefaultLink = () => {
    if (!isPendingRound) {
      setNewInterview((prev) => ({
        ...prev,
        meetingLink: DEFAULT_MEETING_LINK,
      }));
      setIsUsingDefaultLink(true);
    }
  };

  const handleClearForManualInput = () => {
    if (!isPendingRound) {
      setNewInterview((prev) => ({
        ...prev,
        meetingLink: "",
      }));
      setIsUsingDefaultLink(false);
    }
  };

  const handleModalClose = () => {
    setEmailUsed(false);
    setPhoneExists(false);
    setEmailChecking(false);
    setPhoneChecking(false);
    setFormErrors({});
    setEmailStatus("");

    if (emailTimeoutRef.current) clearTimeout(emailTimeoutRef.current);
    if (phoneTimeoutRef.current) clearTimeout(phoneTimeoutRef.current);

    onClose();
  };

  const inputClass = (field) =>
    `crm-field ${formErrors[field] ? "!border-rose-400 !ring-4 !ring-rose-500/10" : ""}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 px-4 py-6 backdrop-blur-sm">
      <div className="crm-shell flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-slate-200/80 bg-slate-950 px-5 py-5 text-white sm:flex-row sm:items-start sm:justify-between sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
              Interview Form
            </p>
            <h3 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              {editingInterview ? "Edit Interview" : "Schedule New Interview"}
            </h3>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Capture candidate details, round planning, and meeting info in one
              structured form.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-white"
            onClick={handleModalClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
            <section className="rounded-[26px] border border-slate-100 bg-white/80 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <UserRound className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Candidate Basics
                  </p>
                  <h4 className="mt-1 text-xl font-bold text-slate-950">
                    Identity & role information
                  </h4>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="crm-label">Candidate Name *</label>
                  <input
                    type="text"
                    placeholder="Enter candidate name"
                    className={inputClass("candidate")}
                    value={newInterview.candidate}
                    onChange={(event) =>
                      handleInputChange("candidate", event.target.value)
                    }
                  />
                  {formErrors.candidate && (
                    <p className="mt-2 text-sm text-rose-600">
                      {formErrors.candidate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="crm-label">
                    Email *
                    {emailChecking && (
                      <span className="ml-2 text-xs font-medium text-teal-600">
                        Checking...
                      </span>
                    )}
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    className={inputClass("email")}
                    value={newInterview.email}
                    onChange={(event) =>
                      handleInputChange("email", event.target.value)
                    }
                  />
                  {formErrors.email && (
                    <p className="mt-2 text-sm text-rose-600">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="crm-label">
                    Phone *
                    {phoneChecking && (
                      <span className="ml-2 text-xs font-medium text-teal-600">
                        Checking...
                      </span>
                    )}
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter 10-digit phone number"
                    className={inputClass("phone")}
                    value={newInterview.phone}
                    onChange={(event) =>
                      handleInputChange("phone", event.target.value)
                    }
                  />
                  {formErrors.phone && (
                    <p className="mt-2 text-sm text-rose-600">
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="crm-label">Position *</label>
                  <input
                    type="text"
                    placeholder="Enter job position"
                    className={inputClass("position")}
                    value={newInterview.position}
                    onChange={(event) =>
                      handleInputChange("position", event.target.value)
                    }
                  />
                  {formErrors.position && (
                    <p className="mt-2 text-sm text-rose-600">
                      {formErrors.position}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-[26px] border border-slate-100 bg-white/80 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-600 text-white">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Interview Setup
                  </p>
                  <h4 className="mt-1 text-xl font-bold text-slate-950">
                    Round, schedule, and access
                  </h4>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="crm-label">Interview Round</label>
                  <select
                    className="crm-select"
                    value={newInterview.round}
                    onChange={(event) =>
                      handleInputChange("round", event.target.value)
                    }
                  >
                    {(INTERVIEW_ROUND_LIST || []).map((round) => (
                      <option key={round} value={round}>
                        {round}
                      </option>
                    ))}
                  </select>
                  {emailStatus && (
                    <p
                      className={`mt-2 text-sm ${
                        isPendingRound ? "text-amber-600" : "text-teal-700"
                      }`}
                    >
                      {emailStatus}
                    </p>
                  )}
                </div>

                <div>
                  <label className="crm-label">Expected Date of Joining</label>
                  <input
                    type="date"
                    className="crm-field"
                    value={newInterview.dateOfJoining || ""}
                    onChange={(event) =>
                      handleInputChange("dateOfJoining", event.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="crm-label">Interview Date</label>
                  <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
                    <input
                      type="date"
                      className="crm-field pl-11"
                      value={newInterview.date}
                      onChange={(event) =>
                        handleInputChange("date", event.target.value)
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="crm-label">Interview Time</label>
                  <div className="relative">
                    <Clock3 className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
                    <input
                      type="time"
                      className="crm-field pl-11"
                      value={newInterview.time}
                      onChange={(event) =>
                        handleInputChange("time", event.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <label className="crm-label mb-0">
                      Meeting Link
                      {isPendingRound && (
                        <span className="ml-2 text-xs font-medium text-amber-600">
                          Disabled for Pending round
                        </span>
                      )}
                    </label>

                    {!isPendingRound && (
                      <div className="flex flex-wrap gap-2">
                        {!isUsingDefaultLink && (
                          <button
                            type="button"
                            className="crm-button-secondary !rounded-xl !px-3 !py-2"
                            onClick={handleUseDefaultLink}
                          >
                            Use Default
                          </button>
                        )}

                        {isUsingDefaultLink && (
                          <button
                            type="button"
                            className="crm-button-secondary !rounded-xl !px-3 !py-2"
                            onClick={handleClearForManualInput}
                          >
                            Write Custom
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <Link2 className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder={
                        isPendingRound
                          ? "Meeting link disabled for Pending round"
                          : isUsingDefaultLink
                          ? "Using default meeting link"
                          : "Enter custom meeting link"
                      }
                      className={`crm-field pl-11 ${
                        isPendingRound ? "cursor-not-allowed bg-slate-100/95" : ""
                      }`}
                      value={isPendingRound ? "" : newInterview.meetingLink}
                      onChange={(event) =>
                        !isPendingRound &&
                        handleInputChange("meetingLink", event.target.value)
                      }
                      disabled={isPendingRound}
                    />
                  </div>

                  <div className="mt-2 flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between">
                    <span className={isPendingRound ? "text-amber-600" : "text-teal-700"}>
                      {isPendingRound
                        ? "Meeting link will unlock when the interview is scheduled."
                        : isUsingDefaultLink
                        ? "Currently using the default meeting link."
                        : "Custom meeting link mode is active."}
                    </span>
                    {!isPendingRound && (
                      <span className="text-slate-400">
                        Default: meet.google.com/abc-defg-hij
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[26px] border border-slate-100 bg-white/80 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Compensation & Experience
              </p>
              <h4 className="mt-2 text-xl font-bold text-slate-950">
                Compensation snapshot
              </h4>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div>
                  <label className="crm-label">Current CTC (LPA)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="2.5"
                    className={inputClass("currentCTC")}
                    value={newInterview.currentCTC || ""}
                    onChange={(event) =>
                      handleInputChange("currentCTC", event.target.value)
                    }
                  />
                  {formErrors.currentCTC && (
                    <p className="mt-2 text-sm text-rose-600">
                      {formErrors.currentCTC}
                    </p>
                  )}
                </div>

                <div>
                  <label className="crm-label">Expected CTC (LPA)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="3.5"
                    className={inputClass("expectedCTC")}
                    value={newInterview.expectedCTC || ""}
                    onChange={(event) =>
                      handleInputChange("expectedCTC", event.target.value)
                    }
                  />
                  {formErrors.expectedCTC && (
                    <p className="mt-2 text-sm text-rose-600">
                      {formErrors.expectedCTC}
                    </p>
                  )}
                </div>

                <div>
                  <label className="crm-label">Total Experience (Years)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="4.0"
                    className={inputClass("totalExperience")}
                    value={newInterview.totalExperience || ""}
                    onChange={(event) =>
                      handleInputChange("totalExperience", event.target.value)
                    }
                  />
                  {formErrors.totalExperience && (
                    <p className="mt-2 text-sm text-rose-600">
                      {formErrors.totalExperience}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-[26px] border border-slate-100 bg-white/80 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Additional Information
              </p>
              <h4 className="mt-2 text-xl font-bold text-slate-950">
                Company and notice details
              </h4>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="crm-label">Notice Period (Days)</label>
                  <input
                    type="number"
                    placeholder="Enter notice period"
                    className="crm-field"
                    value={newInterview.noticePeriod || ""}
                    onChange={(event) =>
                      handleInputChange("noticePeriod", event.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="crm-label">Current Company</label>
                  <input
                    type="text"
                    placeholder="Enter current company"
                    className="crm-field"
                    value={newInterview.currentCompany || ""}
                    onChange={(event) =>
                      handleInputChange("currentCompany", event.target.value)
                    }
                  />
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200/80 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            onClick={handleModalClose}
            className="crm-button-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              loading ||
              phoneExists ||
              emailUsed ||
              phoneChecking ||
              emailChecking
            }
            className="crm-button-primary"
          >
            {loading ? "Saving..." : editingInterview ? "Update Interview" : "Add Interview"}
          </button>
        </div>
      </div>
    </div>
  );
}
