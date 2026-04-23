import { useState } from "react";
import {
  BellRing,
  LockKeyhole,
  Save,
  Shield,
  UserCircle2,
} from "lucide-react";
import useToast from "../hooks/useToast";

function SectionCard({ icon: Icon, kicker, title, description, children }) {
  return (
    <section className="crm-panel p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            {kicker}
          </p>
          <h3 className="mt-2 text-2xl font-bold text-slate-950">{title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function Settings() {
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: "",
    position: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    candidateAlerts: true,
    interviewReminders: true,
    statusUpdates: true,
    dailyDigest: false,
  });

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswords((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNotificationToggle = (field) => {
    setNotifications((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSaveProfile = async () => {
    if (!profile.fullName || !profile.email) {
      showError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showSuccess("Profile updated successfully!");
    } catch {
      showError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showSuccess("Password updated successfully!");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      showError("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showSuccess("Notification preferences saved!");
    } catch {
      showError("Failed to save notifications");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="crm-shell overflow-hidden p-6 sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <span className="crm-kicker">Workspace Settings</span>
            <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-5xl">
              Tune the workspace around your team, security, and daily rhythm.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Update profile details, strengthen account security, and control
              hiring notifications from a single responsive settings experience.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] border border-white/80 bg-white/82 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Profile
              </p>
              <p className="mt-3 text-3xl font-bold text-slate-950">01</p>
            </div>
            <div className="rounded-[24px] border border-white/80 bg-white/82 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Security
              </p>
              <p className="mt-3 text-3xl font-bold text-slate-950">02</p>
            </div>
            <div className="rounded-[24px] border border-white/80 bg-white/82 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Notifications
              </p>
              <p className="mt-3 text-3xl font-bold text-slate-950">03</p>
            </div>
          </div>
        </div>
      </section>

      <SectionCard
        icon={UserCircle2}
        kicker="Profile"
        title="Profile information"
        description="Keep your account details current so the workspace feels personal and easy to trust."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="crm-label">Full Name</label>
            <input
              type="text"
              className="crm-field"
              placeholder="Enter your full name"
              value={profile.fullName}
              onChange={(event) =>
                handleProfileChange("fullName", event.target.value)
              }
            />
          </div>

          <div>
            <label className="crm-label">Email</label>
            <input
              type="email"
              className="crm-field"
              placeholder="your@email.com"
              value={profile.email}
              onChange={(event) => handleProfileChange("email", event.target.value)}
            />
          </div>

          <div>
            <label className="crm-label">Phone Number</label>
            <input
              type="text"
              className="crm-field"
              placeholder="+91 9876543210"
              value={profile.phone}
              onChange={(event) => handleProfileChange("phone", event.target.value)}
            />
          </div>

          <div>
            <label className="crm-label">Department</label>
            <select
              className="crm-select"
              value={profile.department}
              onChange={(event) =>
                handleProfileChange("department", event.target.value)
              }
            >
              <option value="">Select Department</option>
              <option value="hr">Human Resources</option>
              <option value="tech">Technology</option>
              <option value="sales">Sales</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="crm-label">Position</label>
            <input
              type="text"
              className="crm-field"
              placeholder="Your position in company"
              value={profile.position}
              onChange={(event) =>
                handleProfileChange("position", event.target.value)
              }
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            className="crm-button-primary"
            onClick={handleSaveProfile}
            disabled={loading}
          >
            <Save className="h-[18px] w-[18px]" />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </SectionCard>

      <SectionCard
        icon={LockKeyhole}
        kicker="Security"
        title="Password management"
        description="Keep access secure with a cleaner, more confident password update flow."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="crm-label">Current Password</label>
            <input
              type="password"
              className="crm-field"
              value={passwords.currentPassword}
              onChange={(event) =>
                handlePasswordChange("currentPassword", event.target.value)
              }
            />
          </div>

          <div>
            <label className="crm-label">New Password</label>
            <input
              type="password"
              className="crm-field"
              value={passwords.newPassword}
              onChange={(event) =>
                handlePasswordChange("newPassword", event.target.value)
              }
            />
          </div>

          <div className="md:col-span-2">
            <label className="crm-label">Confirm New Password</label>
            <input
              type="password"
              className="crm-field"
              value={passwords.confirmPassword}
              onChange={(event) =>
                handlePasswordChange("confirmPassword", event.target.value)
              }
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="rounded-[20px] border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm text-slate-600">
            Changing the password will help keep hiring activity and candidate
            records protected.
          </div>

          <button
            className="crm-button-primary"
            onClick={handleUpdatePassword}
            disabled={loading}
          >
            <Shield className="h-[18px] w-[18px]" />
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </SectionCard>

      <SectionCard
        icon={BellRing}
        kicker="Notifications"
        title="Notification preferences"
        description="Choose which updates deserve your attention and keep the signal higher than the noise."
      >
        <div className="space-y-3">
          {[
            {
              key: "emailNotifications",
              title: "Email Notifications",
              description: "Receive email updates about system activities",
            },
            {
              key: "candidateAlerts",
              title: "New Candidate Alerts",
              description: "Get notified when new candidates are added",
            },
            {
              key: "interviewReminders",
              title: "Interview Reminders",
              description: "Reminders for upcoming interviews",
            },
            {
              key: "statusUpdates",
              title: "Status Updates",
              description: "Notifications when candidate status changes",
            },
            {
              key: "dailyDigest",
              title: "Daily Digest",
              description: "Daily summary of interview activities",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex flex-col gap-4 rounded-[22px] border border-white/80 bg-white/82 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h4 className="font-semibold text-slate-900">{item.title}</h4>
                <p className="mt-1 text-sm text-slate-600">{item.description}</p>
              </div>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={notifications[item.key]}
                onChange={() => handleNotificationToggle(item.key)}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            className="crm-button-primary"
            onClick={handleSaveNotifications}
            disabled={loading}
          >
            <BellRing className="h-[18px] w-[18px]" />
            {loading ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </SectionCard>
    </div>
  );
}
