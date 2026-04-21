import { useState, useEffect, useRef } from "react";
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

  // Default meeting link
  const DEFAULT_MEETING_LINK = "https://meet.google.com/abc-defg-hij";

  // Check if round is Pending
  const isPendingRound = newInterview.round === "Pending";

  // Pre-fill default meeting link when creating new interview and reset states
  useEffect(() => {
    if (showModal && !editingInterview) {
      setNewInterview((prev) => ({
        ...prev,
        meetingLink: DEFAULT_MEETING_LINK,
        round: "Pending", // Set default round to Pending
      }));
      setIsUsingDefaultLink(true);
      setEmailStatus("");
      setEmailUsed(false);
      setPhoneExists(false);
      setFormErrors({});
    } else if (showModal && editingInterview) {
      // Reset duplicate states when editing
      setEmailUsed(false);
      setPhoneExists(false);
      setFormErrors({});
    }
  }, [showModal, editingInterview, setNewInterview]);

  // Update email status when round changes
  useEffect(() => {
    if (newInterview.round === "Pending") {
      setEmailStatus("Meeting link will be sent when round is scheduled");
    } else if (["1st Round", "2nd Round"].includes(newInterview.round)) {
      setEmailStatus("Meeting link will be automatically sent via email");
    } else {
      setEmailStatus("");
    }
  }, [newInterview.round]);

  if (!showModal) return null;

  // Real-time phone check
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
          phone: "⚠️ This phone number is already in use",
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

  // Real-time email check
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
          email: "⚠️ This email is already in use",
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

  // Validate form before submission
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

    if (newInterview.currentCTC && isNaN(newInterview.currentCTC)) {
      errors.currentCTC = "Current CTC must be a number";
    }

    if (newInterview.expectedCTC && isNaN(newInterview.expectedCTC)) {
      errors.expectedCTC = "Expected CTC must be a number";
    }

    if (newInterview.totalExperience && isNaN(newInterview.totalExperience)) {
      errors.totalExperience = "Total experience must be a number";
    }

    // Check duplicates only if they exist from API check
    if (phoneExists) {
      errors.phone = "⚠️ This phone number is already in use";
    }
    if (emailUsed) {
      errors.email = "⚠️ This email is already in use";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Enhanced submit handler
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    // Ensure meeting link is set (use default if empty and not pending)
    const interviewData = {
      ...newInterview,
      meetingLink: isPendingRound
        ? ""
        : newInterview.meetingLink || DEFAULT_MEETING_LINK,
    };

    setNewInterview(interviewData);

    // Call onSubmit after a small delay to ensure state is updated
    setTimeout(() => {
      onSubmit();
    }, 0);
  };

  // Handle input changes with error clearing
  const handleInputChange = (field, value) => {
    setNewInterview((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Trigger real-time checks
    if (field === "phone") {
      if (phoneTimeoutRef.current) clearTimeout(phoneTimeoutRef.current);
      phoneTimeoutRef.current = setTimeout(() => {
        checkPhoneDuplicate(value);
      }, 1000); // 2s delay
    } else if (field === "email") {
      if (emailTimeoutRef.current) {
        clearTimeout(emailTimeoutRef.current);
      }
      emailTimeoutRef.current = setTimeout(() => {
        checkEmailDuplicate(value);
      }, 1000); // 2s delay
    }

    // Check if user is manually typing (not using default)
    if (field === "meetingLink") {
      if (value === DEFAULT_MEETING_LINK) {
        setIsUsingDefaultLink(true);
      } else if (value !== DEFAULT_MEETING_LINK && value !== "") {
        setIsUsingDefaultLink(false);
      }
    }

    // Update email status when round changes
    if (field === "round") {
      if (value === "Pending") {
        setEmailStatus("Meeting link will be sent when round is scheduled");
      } else if (["1st Round", "2nd Round"].includes(value)) {
        setEmailStatus("Meeting link will be automatically sent via email");
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

  // Reset meeting link to default
  const handleResetMeetingLink = () => {
    if (!isPendingRound) {
      setNewInterview((prev) => ({
        ...prev,
        meetingLink: DEFAULT_MEETING_LINK,
      }));
      setIsUsingDefaultLink(true);
    }
  };

  // Use default link
  const handleUseDefaultLink = () => {
    if (!isPendingRound) {
      setNewInterview((prev) => ({
        ...prev,
        meetingLink: DEFAULT_MEETING_LINK,
      }));
      setIsUsingDefaultLink(true);
    }
  };

  // Clear meeting link for manual input
  const handleClearForManualInput = () => {
    if (!isPendingRound) {
      setNewInterview((prev) => ({
        ...prev,
        meetingLink: "",
      }));
      setIsUsingDefaultLink(false);
    }
  };

  // Enhanced onClose handler: reset all states
  const handleModalClose = () => {
    // Reset all local states
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

  return (
    <div className="modal modal-open fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-40">
      <div className="modal-box w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal header */}
        <div className="shrink-0 px-4 pt-4">
          <h3 className="font-bold text-lg mb-6">
            {editingInterview ? "Edit Interview" : "Schedule New Interview"}
          </h3>
        </div>
        {/* Scrollable body */}
        <div
          className="flex-1 overflow-y-auto px-4 pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style >{`
            .flex-1.overflow-y-auto::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Candidate Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Candidate Name *
                </span>
              </label>
              <input
                type="text"
                placeholder="Enter candidate name"
                className={`input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-neutral ${
                  formErrors.candidate ? "input-error" : ""
                }`}
                value={newInterview.candidate}
                onChange={(e) => handleInputChange("candidate", e.target.value)}
              />
              {formErrors.candidate && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {formErrors.candidate}
                  </span>
                </label>
              )}
            </div>
            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Email *{" "}
                  {emailChecking && (
                    <span className="text-blue-500">⏳ Checking...</span>
                  )}
                </span>
              </label>
              <input
                type="email"
                placeholder="Enter email address"
                className={`input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-neutral ${
                  formErrors.email ? "input-error" : ""
                } ${emailUsed ? "border-2 border-red-500" : ""}`}
                value={newInterview.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
              {formErrors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {formErrors.email}
                  </span>
                </label>
              )}
            </div>
            {/* Phone */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Phone *{" "}
                  {phoneChecking && (
                    <span className="text-blue-500">⏳ Checking...</span>
                  )}
                </span>
              </label>
              <input
                type="tel"
                placeholder="Enter 10-digit phone number"
                className={`input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-neutral ${
                  formErrors.phone ? "input-error" : ""
                } ${phoneExists ? "border-2 border-red-500" : ""}`}
                value={newInterview?.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
              {formErrors.phone && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {formErrors.phone}
                  </span>
                </label>
              )}
            </div>
            {/* Position */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Position *</span>
              </label>
              <input
                type="text"
                placeholder="Enter job position"
                className={`input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-neutral ${
                  formErrors.position ? "input-error" : ""
                }`}
                value={newInterview.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
              />
              {formErrors.position && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {formErrors.position}
                  </span>
                </label>
              )}
            </div>
            {/* Current CTC */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Current CTC (LPA)
                </span>
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="2.5"
                className={`input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-neutral ${
                  formErrors.currentCTC ? "input-error" : ""
                }`}
                value={newInterview.currentCTC || ""}
                onChange={(e) =>
                  handleInputChange("currentCTC", e.target.value)
                }
              />
              {formErrors.currentCTC && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {formErrors.currentCTC}
                  </span>
                </label>
              )}
            </div>
            {/* Expected CTC */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Expected CTC (LPA)
                </span>
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="3.5"
                className={`input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-neutral ${
                  formErrors.expectedCTC ? "input-error" : ""
                }`}
                value={newInterview.expectedCTC || ""}
                onChange={(e) =>
                  handleInputChange("expectedCTC", e.target.value)
                }
              />
              {formErrors.expectedCTC && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {formErrors.expectedCTC}
                  </span>
                </label>
              )}
            </div>
            {/* Total Experience */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Total Experience (Years)
                </span>
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="Enter total experience"
                className={`input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-neutral ${
                  formErrors.totalExperience ? "input-error" : ""
                }`}
                value={newInterview.totalExperience || ""}
                onChange={(e) =>
                  handleInputChange("totalExperience", e.target.value)
                }
              />
              {formErrors.totalExperience && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {formErrors.totalExperience}
                  </span>
                </label>
              )}
            </div>
            {/* Divider */}
            <div className="flex w-full flex-col md:col-span-2">
              <div className="divider divider-warning">Interview Details</div>
            </div>
            {/* Interview Round */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Interview Round
                </span>
              </label>
              <select
                className="select select-bordered w-full focus:outline-none focus:ring-2 focus:ring-neutral"
                value={newInterview.round}
                onChange={(e) => handleInputChange("round", e.target.value)}
              >
                {(INTERVIEW_ROUND_LIST || []).map((round) => (
                  <option key={round} value={round}>
                    {round}
                  </option>
                ))}
              </select>
              {emailStatus && (
                <label className="label">
                  <span
                    className={`label-text-alt ${
                      isPendingRound ? "text-warning" : "text-success"
                    }`}
                  >
                    {emailStatus}
                  </span>
                </label>
              )}
            </div>
            {/* Expected Date of Joining */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Expected Date of Joining
                </span>
              </label>
              <input
                type="date"
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-neutral"
                value={newInterview.dateOfJoining || ""}
                onChange={(e) =>
                  handleInputChange("dateOfJoining", e.target.value)
                }
              />
            </div>
            {/* Interview Date */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Interview Date</span>
              </label>
              <input
                type="date"
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-neutral"
                value={newInterview.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
              />
            </div>
            {/* Interview Time */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Interview Time</span>
              </label>
              <input
                type="time"
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-neutral"
                value={newInterview.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
              />
            </div>
            {/* Meeting Link */}
            <div className="form-control md:col-span-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                <label className="label p-0">
                  <span className="label-text font-semibold">
                    Meeting Link
                    {isPendingRound && (
                      <span className="text-warning ml-2">
                        (Disabled for Pending Round)
                      </span>
                    )}
                  </span>
                </label>
                {!isPendingRound && (
                  <div className="flex gap-2">
                    {!isUsingDefaultLink && (
                      <button
                        type="button"
                        className="btn btn-xs btn-primary"
                        onClick={handleUseDefaultLink}
                      >
                        Use Default
                      </button>
                    )}
                    {isUsingDefaultLink && (
                      <button
                        type="button"
                        className="btn btn-xs btn-outline"
                        onClick={handleClearForManualInput}
                      >
                        Write Custom
                      </button>
                    )}
                  </div>
                )}
              </div>
              <input
                type="text"
                placeholder={
                  isPendingRound
                    ? "Meeting link disabled for Pending round"
                    : isUsingDefaultLink
                    ? "Using default meeting link"
                    : "Enter custom meeting link..."
                }
                className={`input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-neutral ${
                  isPendingRound
                    ? "input-disabled bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
                value={isPendingRound ? "" : newInterview.meetingLink}
                onChange={(e) =>
                  !isPendingRound &&
                  handleInputChange("meetingLink", e.target.value)
                }
                disabled={isPendingRound}
              />
              <div className="flex justify-between items-center mt-1">
                <label className="label p-0">
                  <span
                    className={`label-text-alt ${
                      isPendingRound ? "text-warning" : "text-info"
                    }`}
                  >
                    {isPendingRound
                      ? "❌ Meeting link disabled - select a scheduled round"
                      : isUsingDefaultLink
                      ? "✓ Using default meeting link"
                      : "↳ Writing custom meeting link"}
                  </span>
                </label>
                {!isPendingRound && (
                  <span className="label-text-alt text-gray-500">
                    Default: meet.google.com/abc-defg-hij
                  </span>
                )}
              </div>
            </div>
            {/* Divider */}
            <div className="flex w-full flex-col md:col-span-2">
              <div className="divider divider-warning">
                Additional Information
              </div>
            </div>
            {/* Notice Period */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Notice Period (Days)
                </span>
              </label>
              <input
                type="number"
                placeholder="Enter notice period"
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-neutral"
                value={newInterview.noticePeriod || ""}
                onChange={(e) =>
                  handleInputChange("noticePeriod", e.target.value)
                }
              />
            </div>
            {/* Current Company */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Current Company
                </span>
              </label>
              <input
                type="text"
                placeholder="Enter current company"
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-neutral"
                value={newInterview.currentCompany || ""}
                onChange={(e) =>
                  handleInputChange("currentCompany", e.target.value)
                }
              />
            </div>
          </div>
        </div>
        {/* Footer Buttons */}
        <div className="shrink-0 px-4 pb-4 pt-2 border-t flex justify-end gap-2">
          <button
            onClick={handleModalClose}
            className="btn btn-outline"
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
            className="btn btn-primary"
          >
            {loading ? "Saving..." : editingInterview ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
