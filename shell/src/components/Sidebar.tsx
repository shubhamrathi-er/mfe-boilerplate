import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", icon: "📊" },
  { to: "/settings", label: "Settings", icon: "⚙️" },
];

export default function Sidebar() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem("mfe-theme") === "dark";
  });

  useEffect(() => {
    const handler = (e: Event) => {
      const theme = (e as CustomEvent).detail as string;
      setIsDark(theme === "dark");
    };

    window.addEventListener("theme:change", handler);
    return () => window.removeEventListener("theme:change", handler);
  }, []);

  return (
    <aside className={`w-56 border-r flex flex-col p-3 flex-shrink-0 ${
      isDark
        ? "bg-gray-900 border-gray-700"
        : "bg-white border-gray-200"
    }`}>
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

      {/* MFE Status */}
      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className={`text-[10px] font-semibold uppercase tracking-widest mb-2 px-1 ${
          isDark ? "text-gray-500" : "text-gray-400"
        }`}>
          Micro-Apps
        </div>
        {[
          { name: "shell", port: "3000" },
          { name: "dashboard", port: "3001" },
          { name: "settings", port: "3002" },
        ].map((app) => (
          <div
            key={app.name}
            className="flex items-center justify-between px-2 py-1.5"
          >
            <span className={`text-[11px] ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              {app.name}
            </span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="font-mono text-[9px] text-gray-400">
                :{app.port}
              </span>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}