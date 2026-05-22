import "./index.css";
import { useState, useEffect } from "react";
import { eventBus } from "./utils/eventBus";

interface ProfileForm {
  name: string;
  email: string;
  role: string;
  timezone: string;
}

interface NotificationSettings {
  deployments: boolean;
  remoteFailures: boolean;
  performanceAlerts: boolean;
  weeklyDigest: boolean;
}

const microApps = [
  { name: "shell", port: "3000", status: "online" },
  { name: "app-dashboard", port: "3001", status: "online" },
  { name: "app-settings", port: "3002", status: "online" },
];

export default function App() {
  const [saved, setSaved] = useState(false);
 const [isDark, setIsDark] = useState<boolean>(() => {
  return localStorage.getItem("mfe-theme") === "dark";
});
  const [profile, setProfile] = useState<ProfileForm>({
    name: "Shubham Rathi",
    email: "shubhamrathi0409@gmail.com",
    role: "Senior Frontend Engineer",
    timezone: "Asia/Kolkata",
  });

  const [notifications, setNotifications] =
    useState<NotificationSettings>({
      deployments: true,
      remoteFailures: true,
      performanceAlerts: false,
      weeklyDigest: true,
    });



useEffect(() => {
  const handler = (e: Event) => {
    const theme = (e as CustomEvent).detail as string;
    setIsDark(theme === "dark");
  };

  window.addEventListener("theme:change", handler);
  return () => window.removeEventListener("theme:change", handler);
}, []);

 const handleThemeToggle = () => {
  const next = !isDark;
  setIsDark(next);
  const theme = next ? "dark" : "light";
  localStorage.setItem("mfe-theme", theme);
  window.dispatchEvent(new CustomEvent("theme:change", { detail: theme }));
  document.documentElement.classList.toggle("dark", next);
};

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const bg = isDark ? "bg-gray-950" : "bg-gray-50";
  const card = isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const text = isDark ? "text-white" : "text-gray-800";
  const subtext = isDark ? "text-gray-400" : "text-gray-500";
  const input = isDark
    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
    : "bg-white border-gray-200 text-gray-800 placeholder-gray-400";

  return (
    <div className={`p-6 min-h-full ${bg}`}>

      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${text}`}>Settings</h1>
        <p className={`text-sm mt-1 ${subtext}`}>
          Manage your profile and application preferences.
        </p>
      </div>

      <div className="max-w-2xl space-y-5">

        {/* Profile Section */}
        <div className={`rounded-xl border p-5 shadow-sm ${card}`}>
          <h2 className={`text-sm font-semibold mb-4 ${text}`}>
            Profile
          </h2>

          <div className="space-y-3">
            {(
              [
                { label: "Full Name", key: "name", type: "text" },
                { label: "Email", key: "email", type: "email" },
                { label: "Role", key: "role", type: "text" },
                { label: "Timezone", key: "timezone", type: "text" },
              ] as const
            ).map((field) => (
              <div key={field.key}>
                <label className={`block text-xs font-medium mb-1.5 ${subtext}`}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={profile[field.key]}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      [field.key]: e.target.value,
                    }))
                  }
                  className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 ${input}`}
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleSave}
            className={`mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              saved
                ? "bg-emerald-500 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {saved ? "✓ Saved" : "Save Changes"}
          </button>
        </div>

        {/* Appearance Section */}
        <div className={`rounded-xl border p-5 shadow-sm ${card}`}>
          <h2 className={`text-sm font-semibold mb-4 ${text}`}>
            Appearance
          </h2>

          <div className="flex items-center justify-between">
            <div>
              <div className={`text-sm font-medium ${text}`}>
                Dark Mode
              </div>
              <div className={`text-xs mt-0.5 ${subtext}`}>
                Applies theme across all micro-apps via event bus
              </div>
            </div>

            <button
              onClick={handleThemeToggle}
              className={`relative w-11 h-6 rounded-full transition-all duration-300 ${
                isDark ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${
                  isDark ? "left-5" : "left-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Notifications Section */}
        <div className={`rounded-xl border p-5 shadow-sm ${card}`}>
          <h2 className={`text-sm font-semibold mb-4 ${text}`}>
            Notifications
          </h2>

          <div className="space-y-3">
            {(
              [
                { key: "deployments", label: "Deployment Events", desc: "Notify on successful deployments" },
                { key: "remoteFailures", label: "Remote Load Failures", desc: "Alert when a micro-app fails to load" },
                { key: "performanceAlerts", label: "Performance Alerts", desc: "Notify on bundle size increases" },
                { key: "weeklyDigest", label: "Weekly Digest", desc: "Summary of MFE system activity" },
              ] as const
            ).map((item) => (
              <div key={item.key} className="flex items-center justify-between py-1">
                <div>
                  <div className={`text-sm font-medium ${text}`}>
                    {item.label}
                  </div>
                  <div className={`text-xs mt-0.5 ${subtext}`}>
                    {item.desc}
                  </div>
                </div>

                <button
                  onClick={() =>
                    setNotifications((prev) => ({
                      ...prev,
                      [item.key]: !prev[item.key],
                    }))
                  }
                  className={`relative w-11 h-6 rounded-full transition-all duration-300 ${
                    notifications[item.key] ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${
                      notifications[item.key] ? "left-5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Connected Micro-Apps */}
        <div className={`rounded-xl border p-5 shadow-sm ${card}`}>
          <h2 className={`text-sm font-semibold mb-4 ${text}`}>
            Connected Micro-Apps
          </h2>

          <div className="space-y-2">
            {microApps.map((app) => (
              <div
                key={app.name}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  isDark ? "bg-gray-800" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-xs">
                    {app.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className={`text-sm font-medium ${text}`}>
                      {app.name}
                    </div>
                    <div className={`font-mono text-xs ${subtext}`}>
                      localhost:{app.port}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-xs text-emerald-600 font-medium">
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}