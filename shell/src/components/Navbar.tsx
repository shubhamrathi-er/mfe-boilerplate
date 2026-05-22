import { useState, useEffect } from "react";

export default function Navbar() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem("mfe-theme") === "dark";
  });

  useEffect(() => {
    if (isDark) document.documentElement.classList.add("dark");

    const handler = (e: Event) => {
      const theme = (e as CustomEvent).detail as string;
      setIsDark(theme === "dark");
      document.documentElement.classList.toggle("dark", theme === "dark");
      localStorage.setItem("mfe-theme", theme);
    };

    window.addEventListener("theme:change", handler);
    return () => window.removeEventListener("theme:change", handler);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    const theme = next ? "dark" : "light";
    localStorage.setItem("mfe-theme", theme);
    document.documentElement.classList.toggle("dark", next);
    window.dispatchEvent(new CustomEvent("theme:change", { detail: theme }));
  };

  return (
    <nav className={`h-14 border-b flex items-center justify-between px-6 flex-shrink-0 ${
      isDark
        ? "bg-gray-900 border-gray-700"
        : "bg-white border-gray-200"
    }`}>
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-xs font-bold">M</span>
        </div>
        <span className={`font-semibold text-sm ${isDark ? "text-white" : "text-gray-800"}`}>
          MFE Boilerplate
        </span>
        <span className="font-mono text-[9px] bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full ml-1">
          STARTER
        </span>
      </div>

      <button
        onClick={toggleTheme}
        className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${
          isDark
            ? "border-gray-700 hover:bg-gray-800"
            : "border-gray-200 hover:bg-gray-50"
        }`}
      >
        {isDark ? "☀️" : "🌙"}
      </button>
    </nav>
  );
}