import { useState } from "react";
import useToast from "../hooks/useToast";

export default function Settings() {
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Profile state
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: "",
    position: ""
  });

  // Password state
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Notifications state
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    candidateAlerts: true,
    interviewReminders: true,
    statusUpdates: true,
    dailyDigest: false
  });

  // Handle profile changes
  const handleProfileChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle password changes
  const handlePasswordChange = (field, value) => {
    setPasswords(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle notification toggles
  const handleNotificationToggle = (field) => {
    setNotifications(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Save profile
  const handleSaveProfile = async () => {
    if (!profile.fullName || !profile.email) {
      showError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccess("Profile updated successfully!");
    } catch (err) {
      showError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const handleUpdatePassword = async () => {
    if (!passwords.currentPassword || !passwords.newPassword) {
      showError("Please fill in all password fields");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      showError("New passwords do not match");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccess("Password updated successfully!");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (err) {
      showError("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  // Save notifications
  const handleSaveNotifications = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccess("Notification preferences saved!");
    } catch (err) {
      showError("Failed to save notifications");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Settings</h2>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>
      </div>

      {/* Profile Settings */}
      <div className="bg-base-100 p-6 rounded-xl shadow-lg border border-base-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold">Profile Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Full Name :-</span>
            </label>
            <input
              type="text"
              className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary left-24 box-border-sizing-border-box rounded-xl"
              placeholder="Enter your full name"
              value={profile.fullName}
              onChange={(e) => handleProfileChange('fullName', e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Email :-</span>
            </label>
            <input
              type="email"
              className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary left-22 box-border-sizing-border-box rounded-xl"
              placeholder="your@email.com"
              value={profile.email}
              onChange={(e) => handleProfileChange('email', e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Phone Number :-</span>
            </label>
            <input
              type="text"
              className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary left-15 box-border-sizing-border-box rounded-xl"
              placeholder="+91 9876543210"
              value={profile.phone}
              onChange={(e) => handleProfileChange('phone', e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Department :-</span>
            </label>
            <select 
              className="select select-bordered focus:outline-none focus:ring-2 focus:ring-primary left-10 box-border-sizing-border-box rounded-xl"
              value={profile.department}
              onChange={(e) => handleProfileChange('department', e.target.value)}
            >
              <option value="">Select Department</option>
              <option value="hr">Human Resources</option>
              <option value="tech">Technology</option>
              <option value="sales">Sales</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>

          <div className="form-control md:col-span-2">
            <label className="label">
              <span className="label-text font-semibold">Position :-</span>
            </label>
            <input
              type="text"
              className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary left-28 box-border-sizing-border-box rounded-xl"
              placeholder="Your position in company"
              value={profile.position}
              onChange={(e) => handleProfileChange('position', e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button 
            className="btn btn-primary"
            onClick={handleSaveProfile}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-base-100 p-6 rounded-xl shadow-lg border border-base-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-secondary rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold">Change Password</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Current Password :-</span>
            </label>
            <input
              type="password"
              className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary left-21 box-border-sizing-border-box rounded-xl"
              value={passwords.currentPassword}
              onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">New Password :-</span>
            </label>
            <input
              type="password"
              className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary left-15 box-border-sizing-border-box rounded-xl"
              value={passwords.newPassword}
              onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Confirm New Password :-</span>
            </label>
            <input
              type="password"
              className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary left-10 box-border-sizing-border-box rounded-xl"
              value={passwords.confirmPassword}
              onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button 
            className="btn btn-secondary"
            onClick={handleUpdatePassword}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-base-100 p-6 rounded-xl shadow-lg border border-base-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-accent rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.24 8.56a5.97 5.97 0 01-.93-3.26 6 6 0 0111.75 2.33 6 6 0 01-2.13 4.12M4.93 4.93A9.98 9.98 0 001 12.73c0 2.13.78 4.07 2.07 5.55" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold bg-g bg-base-100 m-0.5 border border-base-300 rounded-xl p-2">Notification Preferences</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
            <div>
              <h4 className="font-semibold">Email Notifications</h4>
              <p className="text-sm text-gray-600">Receive email updates about system activities</p>
            </div>
            <input 
              type="checkbox" 
              className="toggle toggle-primary"
              checked={notifications.emailNotifications}
              onChange={() => handleNotificationToggle('emailNotifications')}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
            <div>
              <h4 className="font-semibold">New Candidate Alerts</h4>
              <p className="text-sm text-gray-600">Get notified when new candidates are added</p>
            </div>
            <input 
              type="checkbox" 
              className="toggle toggle-primary"
              checked={notifications.candidateAlerts}
              onChange={() => handleNotificationToggle('candidateAlerts')}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
            <div>
              <h4 className="font-semibold">Interview Reminders</h4>
              <p className="text-sm text-gray-600">Reminders for upcoming interviews</p>
            </div>
            <input 
              type="checkbox" 
              className="toggle toggle-primary"
              checked={notifications.interviewReminders}
              onChange={() => handleNotificationToggle('interviewReminders')}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
            <div>
              <h4 className="font-semibold">Status Updates</h4>
              <p className="text-sm text-gray-600">Notifications when candidate status changes</p>
            </div>
            <input 
              type="checkbox" 
              className="toggle toggle-primary"
              checked={notifications.statusUpdates}
              onChange={() => handleNotificationToggle('statusUpdates')}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
            <div>
              <h4 className="font-semibold">Daily Digest</h4>
              <p className="text-sm text-gray-600">Daily summary of interview activities</p>
            </div>
            <input 
              type="checkbox" 
              className="toggle toggle-primary"
              checked={notifications.dailyDigest}
              onChange={() => handleNotificationToggle('dailyDigest')}
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button 
            className="btn btn-accent"
            onClick={handleSaveNotifications}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Saving...
              </>
            ) : (
              "Save Preferences"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}





// import { useState } from "react";
// import useToast from "../hooks/useToast";

// export default function Settings() {
//   const { showSuccess, showError } = useToast();
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState("profile");

//   const [profile, setProfile] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     department: "",
//     position: ""
//   });

//   const [passwords, setPasswords] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: ""
//   });

//   const [notifications, setNotifications] = useState({
//     emailNotifications: true,
//     candidateAlerts: true,
//     interviewReminders: true,
//     statusUpdates: true,
//     dailyDigest: false
//   });

//   const passwordStrength =
//     passwords.newPassword.length > 10
//       ? "Strong"
//       : passwords.newPassword.length > 5
//       ? "Medium"
//       : "Weak";

//   const Card = ({ title, children }) => (
//     <div className="bg-base-100 rounded-2xl p-6 shadow-xl border border-base-300 animate-fade-in">
//       <h3 className="text-xl font-bold mb-6">{title}</h3>
//       {children}
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 p-6 md:p-10">

//       <div className="mb-8 rounded-2xl bg-gradient-to-r from-primary to-secondary p-6 text-white shadow-xl">
//         <h2 className="text-3xl font-bold">Account Settings</h2>
//         <p className="opacity-90">Manage profile, security & notifications</p>
//       </div>

//       <div className="tabs tabs-boxed mb-8 bg-base-200 p-2 rounded-xl">
//         {["profile", "security", "notifications"].map(tab => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`tab capitalize transition-all ${
//               activeTab === tab ? "tab-active font-semibold" : ""
//             }`}
//           > 
//             {tab}
//           </button>
//         ))}
//       </div>

//       {activeTab === "profile" && (
//         <Card title="Profile Information">
//           <div className="flex items-center gap-6 mb-8">
//             <div className="avatar">
//               <div className="w-20 rounded-full ring ring-primary ring-offset-2">
//                 <img src="https://i.pravatar.cc/150" alt="avatar" />
//               </div>
//             </div>
//             <button className="btn btn-outline btn-primary btn-sm">
//               Change Avatar
//             </button>
//           </div>

//           <div className="grid md:grid-cols-2 gap-6">
//             {Object.entries(profile).map(([key, value]) => (
//               <div key={key} className="form-control">
//                 <label className="label font-semibold capitalize">
//                   {key.replace(/([A-Z])/g, " $1")}
//                 </label>
//                 <input
//                   value={value}
//                   onChange={e =>
//                     setProfile({ ...profile, [key]: e.target.value })
//                   }
//                   className="input input-bordered focus:ring-2 focus:ring-primary"
//                 />
//               </div>
//             ))}
//           </div>

//           <div className="flex justify-end mt-8 sticky bottom-4">
//             <button
//               className="btn btn-primary px-10 hover:scale-105 transition"
//               disabled={loading}
//               onClick={() => showSuccess("Profile Saved")}
//             >
//               Save Profile
//             </button>
//           </div>
//         </Card>
//       )}

//       {activeTab === "security" && (
//         <Card title="Security Settings">
//           <div className="grid md:grid-cols-2 gap-6">
//             {Object.entries(passwords).map(([key, value]) => (
//               <div key={key} className="form-control">
//                 <label className="label font-semibold capitalize">
//                   {key.replace(/([A-Z])/g, " $1")}
//                 </label>
//                 <input
//                   type="password"
//                   value={value}
//                   onChange={e =>
//                     setPasswords({ ...passwords, [key]: e.target.value })
//                   }
//                   className="input input-bordered focus:ring-2 focus:ring-secondary"
//                 />
//               </div>
//             ))}
//           </div>

//           <div className="mt-4">
//             <span className="text-sm font-semibold">Password Strength:</span>
//             <span
//               className={`ml-2 badge ${
//                 passwordStrength === "Strong"
//                   ? "badge-success"
//                   : passwordStrength === "Medium"
//                   ? "badge-warning"
//                   : "badge-error"
//               }`}
//             >
//               {passwordStrength}
//             </span>
//           </div>

//           <div className="flex justify-end mt-8">
//             <button className="btn btn-secondary px-10">
//               Update Password
//             </button>
//           </div>
//         </Card>
//       )}

//       {activeTab === "notifications" && (
//         <Card title="Notification Preferences">
//           <div className="space-y-4">
//             {Object.entries(notifications).map(([key, value]) => (
//               <div
//                 key={key}
//                 className="flex items-center justify-between p-4 rounded-xl bg-base-200 hover:bg-base-300 transition"
//               >
//                 <span className="font-medium capitalize">
//                   {key.replace(/([A-Z])/g, " $1")}
//                 </span>
//                 <input
//                   type="checkbox"
//                   className="toggle toggle-accent"
//                   checked={value}
//                   onChange={() =>
//                     setNotifications({
//                       ...notifications,
//                       [key]: !value
//                     })
//                   }
//                 />
//               </div>
//             ))}
//           </div>

//           <div className="flex justify-end mt-8">
//             <button className="btn btn-accent px-10">
//               Save Preferences
//             </button>
//           </div>
//         </Card>
//       )}
//     </div>
//   );
// }