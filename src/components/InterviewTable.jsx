// import { useState } from "react";
// import useToast from "../hooks/useToast";
// import {
//   INTERVIEW_ROUND_LIST,
//   INTERVIEW_STATUS_LIST,
// } from "../utils/constant";

// const getAvatarInitial = (candidate) => {
//   if (!candidate || typeof candidate !== "string") return "?";
//   return candidate.charAt(0).toUpperCase();
// };

// const getCandidateName = (candidate) => {
//   return candidate || "Unknown Candidate";
// };

// export default function InterviewTable({
//   interviews,
//   title,
//   badgeColor,
//   onEdit,
//   onDelete,
//   onSendEmail,
//   onStatusUpdate,
// }) {
//   const { showError, showSuccess } = useToast();
//   const [deleteConfirm, setDeleteConfirm] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedCandidate, setSelectedCandidate] = useState(null);

//   const handleStatusChange = async (id, status) => {
//     try {
//       await onStatusUpdate(id, { status });
//       showSuccess("Status updated");
//     } catch {
//       showError("Failed to update status");
//     }
//   };

//   const handleRoundChange = async (id, round) => {
//     try {
//       await onStatusUpdate(id, { round });
//       showSuccess("Round updated");

//     } catch {
//       showError("Failed to update round");
//     }

//   };

//   const handleDelete = async (id) => {
//     try {
//       await onDelete(id);
//       setDeleteConfirm(null);
//       showSuccess("Interview deleted successfully");
//     } catch {
//       showError("Failed to delete interview");
//     }
//   };
//   return (
//     <>
//       <div className="bg-base-100 p-6 rounded-xl shadow-lg mb-6">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-xl font-semibold">{title}</h3>
//           <span className={`badge ${badgeColor} badge-lg`} >
//             {interviews.length} items
//           </span>
//         </div>

//         {interviews.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="table table-zebra min-w-[900px]">
//               <thead>
//                 <tr>
//                   <th>Candidate</th>
//                   <th>Email</th>
//                   <th>Phone</th>
//                   <th>Position</th>
//                   <th>Date</th>
//                   <th>Time</th>
//                   <th>Round</th>
//                   <th>Status</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {interviews.map((item, i) => (
//                   <tr key={i}>
//                     <td>
//                       <div className="flex items-center gap-3">
//                         <div
//                           className="w-12 h-12 rounded-full bg-neutral text-neutral-content flex items-center justify-center font-bold cursor-pointer"
//                           onClick={() => {
//                             setSelectedCandidate(item);
//                             setIsModalOpen(true);
//                           }}
//                         >
//                           {getAvatarInitial(item?.candidate)}
//                         </div>

//                         <div>
//                           <div className="font-bold truncate">
//                             {getCandidateName(item?.candidate)}
//                           </div>
//                           {item?.currentCompany && (
//                             <div className="text-xs text-gray-500">
//                               {item.currentCompany}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </td>

//                     <td>{item?.email || "N/A"}</td>
//                     <td>{item?.phone || "N/A"}</td>
//                     <td>{item?.position || "N/A"}</td>
//                     <td>{item?.date || "N/A"}</td>
//                     <td>{item?.time || "N/A"}</td>

//                     <td>
//                       <select
//                         value={item?.round ?? ""}
//                         disabled
//                         className="select select-bordered select-sm opacity-60 cursor-not-allowed"
//                         onChange={(e) =>
//                           handleRoundChange(item?._id, e.target.value)
//                         }
//                       >
//                         <option value="" disabled>
//                           Select Round
//                         </option>
//                         {INTERVIEW_ROUND_LIST.map((round) => (
//                           <option key={round} value={round}>
//                             {round}
//                           </option>
//                         ))}
//                       </select>
//                     </td>

//                     <td>
//                       <select
//                         value={item?.status || ""}
//                         className="select select-bordered select-sm"
//                         onChange={(e) =>
//                           handleStatusChange(item?._id, e.target.value)
//                         }
//                       >
//                         <option value="" disabled>
//                           Select Status
//                         </option>
//                         {INTERVIEW_STATUS_LIST.map((status) => (
//                           <option key={status} value={status}>
//                             {status}
//                           </option>
//                         ))}
//                       </select>
//                     </td>

//                     <td className="flex gap-1">
//                       <button
//                         className="btn btn-info btn-sm"
//                         onClick={() => onEdit(item)}
//                       >
//                         Edit
//                       </button>
//                       <button
//                         className="btn btn-error btn-sm"
//                         onClick={() => setDeleteConfirm(item)}
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <div className="text-center p-6 text-gray-400">
//             No interviews found
//           </div>
//         )}
//       </div>

//       {isModalOpen && selectedCandidate && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-3">
//           <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
//             <div className="flex items-center gap-4 border-b pb-4">
//               <div className="w-14 h-14 rounded-full bg-neutral text-white flex items-center justify-center text-xl font-bold">
//                 {getAvatarInitial(selectedCandidate?.candidate)}
//               </div>

//               <div>
//                 <h2 className="text-lg font-semibold">
//                   {getCandidateName(selectedCandidate?.candidate)}
//                 </h2>
//                 <p className="text-sm text-gray-500">
//                   {selectedCandidate?.currentCompany || "N/A"}
//                 </p>
//               </div>
//             </div>

//             <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
//               <div>
//                 <p className="text-gray-400">Position</p>
//                 <p className="font-medium">
//                   {selectedCandidate?.position || "N/A"}
//                 </p>
//               </div>

//               <div>
//                 <p className="text-gray-400">Status</p>
//                 <p className="font-medium">
//                   {selectedCandidate?.status || "N/A"}
//                 </p>
//               </div>

//               <div className="col-span-2">
//                 <p className="text-gray-400">Email</p>
//                 <p className="font-medium break-all">
//                   {selectedCandidate?.email || "N/A"}
//                 </p>
//               </div>

//               <div>
//                 <p className="text-gray-400">Date</p>
//                 <p className="font-medium">
//                   {selectedCandidate?.date || "N/A"}
//                 </p>
//               </div>

//               <div>
//                 <p className="text-gray-400">Time</p>
//                 <p className="font-medium">
//                   {selectedCandidate?.time || "N/A"}
//                 </p>
//               </div>
//             </div>

//             <div className="mt-6 text-right">
//               <button
//                 className="btn btn-sm"
//                 onClick={() => setIsModalOpen(false)}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {deleteConfirm && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-3">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
//             <h3 className="text-lg font-semibold mb-3 text-red-600">
//               Delete Interview
//             </h3>

//             <p className="text-sm text-gray-600 mb-5">
//               Are you sure you want to delete interview of{" "}
//               <span className="font-semibold">
//                 {getCandidateName(deleteConfirm?.candidate)}
//               </span>
//               ?
//             </p>

//             <div className="flex justify-end gap-3">
//               <button
//                 className="btn btn-sm"
//                 onClick={() => setDeleteConfirm(null)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="btn btn-error btn-sm"
//                 onClick={() => handleDelete(deleteConfirm._id)}
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }




// import { useState, useEffect } from "react";
// import useToast from "../hooks/useToast";
// import {
//   INTERVIEW_ROUND_LIST,
//   INTERVIEW_STATUS_LIST,
// } from "../utils/constant";

// const getAvatarInitial = (candidate) => {
//   if (!candidate || typeof candidate !== "string") return "?";
//   return candidate.charAt(0).toUpperCase();
// };

// const getCandidateName = (candidate) => {
//   return candidate || "Unknown Candidate";
// };

// export default function InterviewTable({
//   interviews,
//   title,
//   badgeColor,
//   onEdit,
//   onDelete,
//   onStatusUpdate,
// }) {
//   const { showError, showSuccess } = useToast();
//   const [deleteConfirm, setDeleteConfirm] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedCandidate, setSelectedCandidate] = useState(null);
//   const [activities, setActivities] = useState([]);

//   useEffect(() => {
//     if (!isModalOpen) return;

//     setActivities([]);

//     const interval = setInterval(() => {
//       setActivities((prev) => [
//         {
//           id: Date.now(),
//           text: `Viewed profile at ${new Date().toLocaleTimeString()}`,
//         },
//         ...prev,
//       ]);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [isModalOpen]);

//   const handleStatusChange = async (id, status) => {
//     try {
//       await onStatusUpdate(id, { status });
//       showSuccess("Status updated");

//       setActivities((prev) => [
//         {
//           id: Date.now(),
//           text: `Status changed to "${status}"`,
//         },
//         ...prev,
//       ]);
//     } catch {
//       showError("Failed to update status");
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await onDelete(id);
//       setDeleteConfirm(null);
//       showSuccess("Interview deleted successfully");
//     } catch {
//       showError("Failed to delete interview");
//     }
//   };

//   return (
//     <>
//       <div className="bg-base-100 p-6 rounded-xl shadow-lg mb-6">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-xl font-semibold">{title}</h3>
//           <span className={`badge ${badgeColor} badge-lg`}>
//             {interviews.length} items
//           </span>
//         </div>

//         {interviews.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="table table-zebra min-w-[900px]">
//               <thead>
//                 <tr>
//                   <th>Candidate</th>
//                   <th>Email</th>
//                   <th>Phone</th>
//                   <th>Position</th>
//                   <th>Date</th>
//                   <th>Time</th>
//                   <th>Round</th>
//                   <th>Status</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {interviews.map((item, i) => (
//                   <tr key={i}>
//                     <td>
//                       <div className="flex items-center gap-3">
//                         <div
//                           className="w-12 h-12 rounded-full bg-neutral text-neutral-content flex items-center justify-center font-bold cursor-pointer"
//                           onClick={() => {
//                             setSelectedCandidate(item);
//                             setIsModalOpen(true);
//                           }}
//                         >
//                           {getAvatarInitial(item?.candidate)}
//                         </div>

//                         <div>
//                           <div className="font-bold">
//                             {getCandidateName(item?.candidate)}
//                           </div>
//                           <div className="text-xs text-gray-500">
//                             {item?.currentCompany || "N/A"}
//                           </div>
//                         </div>
//                       </div>
//                     </td>

//                     <td>{item?.email || "N/A"}</td>
//                     <td>{item?.phone || "N/A"}</td>
//                     <td>{item?.position || "N/A"}</td>
//                     <td>{item?.date || "N/A"}</td>
//                     <td>{item?.time || "N/A"}</td>

//                     <td>
//                       <select
//                         disabled
//                         className="select select-bordered select-sm opacity-60 cursor-not-allowed"
//                       >
//                         <option>{item?.round || "N/A"}</option>
//                       </select>
//                     </td>

//                     <td>
//                       <select
//                         value={item?.status || ""}
//                         className="select select-bordered select-sm"
//                         onChange={(e) =>
//                           handleStatusChange(item?._id, e.target.value)
//                         }
//                       >
//                         <option value="" disabled>
//                           Select Status
//                         </option>
//                         {INTERVIEW_STATUS_LIST.map((status) => (
//                           <option key={status} value={status}>
//                             {status}
//                           </option>
//                         ))}
//                       </select>
//                     </td>

//                     <td className="flex gap-1">
//                       <button
//                         className="btn btn-info btn-sm"
//                         onClick={() => onEdit(item)}
//                       >
//                         Edit
//                       </button>
//                       <button
//                         className="btn btn-error btn-sm"
//                         onClick={() => setDeleteConfirm(item)}
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <div className="text-center p-6 text-gray-400">
//             No interviews found
//           </div>
//         )}
//       </div>

//       {/* ================= MODAL ================= */}
//       {isModalOpen && selectedCandidate && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-3">
//           <div className="flex gap-4 max-w-5xl w-full">

//             <div className="w-1/2 bg-white rounded-2xl shadow-2xl p-6">
//               <h2 className="text-lg font-semibold mb-4">
//                 Candidate Details
//               </h2>

//               <p><b>Name:</b> {getCandidateName(selectedCandidate.candidate)}</p>
//               <p><b>Email:</b> {selectedCandidate.email}</p>
//               <p><b>Position:</b> {selectedCandidate.position}</p>
//               <p><b>Status:</b> {selectedCandidate.status}</p>

//               <div className="mt-6 text-right">
//                 <button
//                   className="btn btn-sm"
//                   onClick={() => setIsModalOpen(false)}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>

//             <div className="w-1/2 bg-white rounded-2xl shadow-2xl p-6">
//               <h2 className="text-lg font-semibold mb-4">
//                 Live Activity
//               </h2>

//               <div className="h-64 overflow-y-auto space-y-3">
//                 {activities.length ? (
//                   activities.map((act) => (
//                     <div
//                       key={act.id}
//                       className="text-sm bg-gray-100 p-2 rounded-lg"
//                     >
//                       {act.text}
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-gray-400 text-sm">
//                     No activity yet
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {deleteConfirm && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
//           <div className="bg-white p-6 rounded-xl">
//             <p className="mb-4">
//               Delete interview of{" "}
//               <b>{getCandidateName(deleteConfirm.candidate)}</b>?
//             </p>
//             <div className="flex justify-end gap-2">
//               <button
//                 className="btn btn-sm"
//                 onClick={() => setDeleteConfirm(null)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="btn btn-error btn-sm"
//                 onClick={() => handleDelete(deleteConfirm._id)}
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }


import { useState, useEffect, useRef } from "react";
import useToast from "../hooks/useToast";
import { INTERVIEW_STATUS_LIST } from "../utils/constant";

const getAvatarInitial = (name) =>
  name?.charAt(0)?.toUpperCase() || "?";

const getCandidateName = (name) =>
  name || "Unknown Candidate";

export default function InterviewTable({
  interviews = [],
  title,
  badgeColor = "bg-blue-100 text-blue-700",
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
    if (!isModalOpen) return;

    const timer = setInterval(() => {
      setActivities((prev) => [
        {
          id: Date.now(),
          text: `👀 Profile viewed at ${new Date().toLocaleTimeString()}`,
        },
        // ...prev,
      ]);
    }, 4000);

    return () => clearInterval(timer);
  }, [isModalOpen]);

  useEffect(() => {
    activityEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activities]);

  const handleStatusUpdate = async () => {
    try {
      await onStatusUpdate(selectedCandidate._id, {
        status: editStatus,
      });

      showSuccess("Status updated");

      setActivities((prev) => [
        {
          id: Date.now(),
          text: `🔄 Status changed to "${editStatus}"`,
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
      <div className="bg-black rounded-2xl shadow-md p-4 sm:p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg sm:text-xl font-semibold">{title}</h3>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${badgeColor}`}
          >
            {interviews.length} items
          </span>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 text-sm text-gray-500">
              <tr>
                <th className="p-3 text-left">Candidate</th>
                <th className="p-3">Email</th>
                <th className="p-3">Position</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {interviews.map((item) => (
                <tr
                  key={item._id}
                  className="border-t hover:bg-gray"
                >
                  <td className="p-3 flex gap-3 items-center">
                    <div
                      onClick={() => {
                        setSelectedCandidate(item);
                        setEditStatus(item.status);
                        setActivities([]);
                        setIsModalOpen(true);
                      }}
                      className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold cursor-pointer"
                    >
                      {getAvatarInitial(item.candidate)}
                    </div>
                    <div>
                      <p className="font-medium">
                        {getCandidateName(item.candidate)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {item.currentCompany || "N/A"}
                      </p>
                    </div>
                  </td>

                  <td className="p-3 text-sm">{item.email}</td>
                  <td className="p-3 text-sm">{item.position}</td>
                  <td className="p-3 text-sm">{item.date}</td>

                  <td className="p-3">
                    <select
                      value={item.status}
                      onChange={(e) =>
                        onStatusUpdate(item._id, {
                          status: e.target.value,
                        })
                      }
                      className="bg-black text-white border border-gray-600 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {INTERVIEW_STATUS_LIST.map((s) => (
                        <option key={s} className="bg-black text-white">
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(item)}
                      className="px-3 py-1 bg-red-600 text-white rounded-md text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-4">
          {interviews.map((item) => (
            <div
              key={item._id}
              className="border rounded-xl p-4 shadow-sm"
            >
              <div className="flex gap-3 mb-2">
                <div
                  onClick={() => {
                    setSelectedCandidate(item);
                    setEditStatus(item.status);
                    setActivities([]);
                    setIsModalOpen(true);
                  }}
                  className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold"
                >
                  {getAvatarInitial(item.candidate)}
                </div>
                <div>
                  <p className="font-medium">
                    {getCandidateName(item.candidate)}
                  </p>
                  <p className="text-xs text-gray-400">{item.email}</p>
                </div>
              </div>

              <p className="text-sm"><b>Position:</b> {item.position}</p>
              <p className="text-sm"><b>Date:</b> {item.date}</p>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => onEdit(item)}
                  className="flex-1 bg-blue-600 text-white py-1 rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteConfirm(item)}
                  className="flex-1 bg-red-600 text-white py-1 rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center">
          <div className="w-full sm:max-w-6xl h-[92vh] sm:h-[85vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col animate-[slideUp_0.3s_ease-out]">

            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-4 rounded-t-3xl flex justify-between items-center">
              <div className="flex gap-3 items-center">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-bold">
                  {getAvatarInitial(selectedCandidate.candidate)}
                </div>
                <div>
                  <p className="font-semibold">
                    {selectedCandidate.candidate}
                  </p>
                  <p className="text-xs opacity-90">
                    {selectedCandidate.position}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
              <div className="p-5 overflow-y-auto">
                <h3 className="font-semibold mb-3">
                  Candidate Details
                </h3>
                <div className="bg-gray-50 p-4 rounded-xl text-sm space-y-2">
                  <p><b>Email:</b> {selectedCandidate.email}</p>
                  <p><b>Position:</b> {selectedCandidate.position}</p>
                  <p><b>Status:</b> {selectedCandidate.status}</p>
                </div>
              </div>

              <div className="flex flex-col border-l overflow-hidden">
                <div className="p-4 border-b">
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 mb-2"
                  >
                    {INTERVIEW_STATUS_LIST.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>

                  <button
                    onClick={handleStatusUpdate}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg"
                  >
                    Update Status
                  </button>
                </div>

                <div className="p-4 border-b">
                  <textarea
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 resize-none"
                    placeholder="Add note..."
                  />
                  <button
                    onClick={() => {
                      if (!editNote.trim()) return;
                      setActivities((p) => [
                        { id: Date.now(), text: `📝 ${editNote}` },
                        ...p,
                      ]);
                      setEditNote("");
                    }}
                    className="w-full mt-2 border rounded-lg py-2"
                  >
                    Save Note
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
                  {activities.map((a) => (
                    <div key={a.id} className="pl-4 border-l-2 border-indigo-500 text-sm bg-white p-3 rounded-lg shadow">
                      {a.text}
                    </div>
                  ))}
                  <div ref={activityEndRef} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE ================= */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-80">
            <p className="mb-4 text-sm">
              Delete interview of <b>{deleteConfirm.candidate}</b>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-3 py-1 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1 bg-red-600 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
