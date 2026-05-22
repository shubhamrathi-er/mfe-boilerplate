import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", icon: "📊" },
  { to: "/settings", label: "Settings", icon: "⚙️" },
];

interface AppHealth {
  name: string;
  port: string;
  url: string;
  status: "online" | "offline" | "checking";
}

const APPS: AppHealth[] = [
  { name: "shell", port: "3000", url: "http://localhost:3000", status: "online" },
  { name: "dashboard", port: "3001", url: "http://localhost:3001/remoteEntry.js", status: "checking" },
  { name: "settings", port: "3002", url: "http://localhost:3002/remoteEntry.js", status: "checking" },
];

const STATUS_CONFIG = {
  online: {
    dot: "bg-emerald-400",
    glow: "shadow-emerald-400/50",
    text: "text-emerald-500",
    label: "online",
  },
  offline: {
    dot: "bg-red-400",
    glow: "shadow-red-400/50",
    text: "text-red-500",
    label: "offline",
  },
  checking: {
    dot: "bg-amber-400 animate-pulse",
    glow: "shadow-amber-400/50",
    text: "text-amber-500",
    label: "checking",
  },
};

async function checkHealth(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      mode: "no-cors", // avoids CORS issues for health checks
    });

    clearTimeout(timeout);
    return true; // no-cors always returns opaque response — if we get here it's up
  } catch {
    return false;
  }
}

export default function Sidebar() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem("mfe-theme") === "dark";
  });

  const [apps, setApps] = useState<AppHealth[]>(APPS);

  // Theme listener
  useEffect(() => {
    const handler = (e: Event) => {
      const theme = (e as CustomEvent).detail as string;
      setIsDark(theme === "dark");
    };
    window.addEventListener("theme:change", handler);
    return () => window.removeEventListener("theme:change", handler);
  }, []);

  // Health check — runs immediately then every 5 seconds
  useEffect(() => {
    const runChecks = async () => {
      const updated = await Promise.all(
        apps.map(async (app) => {
          if (app.name === "shell") {
            return { ...app, status: "online" as const };
          }
          const isOnline = await checkHealth(app.url);
          return {
            ...app,
            status: isOnline ? ("online" as const) : ("offline" as const),
          };
        })
      );
      setApps(updated);
    };

    // Run immediately
    runChecks();

    // Then every 5 seconds
    const interval = setInterval(runChecks, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside
      className={`w-56 border-r flex flex-col p-3 flex-shrink-0 transition-colors duration-300 ${
        isDark
          ? "bg-gray-900 border-gray-700"
          : "bg-white border-gray-200"
      }`}
    >
      {/* Navigation Links */}
      <div className="space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : isDark
                  ? "text-gray-400 hover:bg-gray-800"
                  : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            <span>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </div>

      {/* MFE Health Status */}
      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
        <div
          className={`text-[10px] font-semibold uppercase tracking-widest mb-3 px-1 ${
            isDark ? "text-gray-500" : "text-gray-400"
          }`}
        >
          Micro-Apps
        </div>

        <div className="space-y-1.5">
          {apps.map((app) => {
            const config = STATUS_CONFIG[app.status];
            return (
              <div
                key={app.name}
                className={`flex items-center justify-between px-2 py-2 rounded-lg transition-all ${
                  isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 shadow-sm ${config.dot} ${config.glow}`}
                  />
                  <span
                    className={`text-[11px] font-medium ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {app.name}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`text-[9px] font-medium ${config.text}`}>
                    {app.status}
                  </span>
                  <span
                    className={`font-mono text-[9px] ${
                      isDark ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    :{app.port}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Last checked indicator */}
        <div
          className={`mt-3 px-2 text-[9px] font-mono ${
            isDark ? "text-gray-600" : "text-gray-400"
          }`}
        >
          Checks every 5s
        </div>
      </div>
    </aside>
  );
}