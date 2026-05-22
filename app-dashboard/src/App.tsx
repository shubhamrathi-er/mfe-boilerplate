import "./index.css";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { eventBus } from "./utils/eventBus";
import { useCountUp } from "./hooks/useCountUp";
import { motion } from "framer-motion";

const chartData = [
    { month: "Jan", users: 4200, revenue: 24000 },
    { month: "Feb", users: 5800, revenue: 31000 },
    { month: "Mar", users: 5200, revenue: 28000 },
    { month: "Apr", users: 7800, revenue: 42000 },
    { month: "May", users: 9200, revenue: 51000 },
    { month: "Jun", users: 8600, revenue: 47000 },
    { month: "Jul", users: 11200, revenue: 63000 },
];

const activityData = [
    { id: 1, user: "Sarah Johnson", action: "Deployed app-dashboard v2.1", time: "2 min ago", status: "Success" },
    { id: 2, user: "Alex Chen", action: "Updated Module Federation config", time: "15 min ago", status: "Success" },
    { id: 3, user: "Maria Garcia", action: "Fixed shared dependency conflict", time: "1 hr ago", status: "Warning" },
    { id: 4, user: "James Wilson", action: "Added new micro-app remote", time: "2 hrs ago", status: "Success" },
    { id: 5, user: "Emma Davis", action: "Build failed on app-settings", time: "3 hrs ago", status: "Error" },
];

// Update stats array to use raw numbers
const stats = [
    { label: "Total Users", value: 11200, display: "11,200", change: "+12.5%", positive: true, icon: "👥", prefix: "" },
    { label: "Revenue", value: 63000, display: "$63,000", change: "+8.2%", positive: true, icon: "💰", prefix: "$" },
    { label: "Active Sessions", value: 1429, display: "1,429", change: "+3.1%", positive: true, icon: "⚡", prefix: "" },
    { label: "Uptime", value: 999, display: "99.9%", change: "-0.01%", positive: false, icon: "🟢", prefix: "", suffix: "%" },
];

const statusColors: Record<string, string> = {
    Success: "bg-emerald-100 text-emerald-700",
    Warning: "bg-amber-100 text-amber-700",
    Error: "bg-red-100 text-red-700",
};

export default function App() {
    const [isDark, setIsDark] = useState<boolean>(() => {
        return localStorage.getItem("mfe-theme") === "dark";
    });

    useEffect(() => {
        const handler = (e: Event) => {
            const theme = (e as CustomEvent).detail as string;
            setIsDark(theme === "dark");
            localStorage.setItem("mfe-theme", theme);
        };

        window.addEventListener("theme:change", handler);
        return () => window.removeEventListener("theme:change", handler);
    }, []);

    function StatCard({
        stat,
        index,
        isDark,
    }: {
        stat: typeof stats[0];
        index: number;
        isDark: boolean;
    }) {
        const count = useCountUp(stat.value, 1500, index * 150);

        const formatted =
            stat.suffix === "%"
                ? `${(count / 10).toFixed(1)}%`
                : stat.prefix === "$"
                    ? `$${count.toLocaleString()}`
                    : count.toLocaleString();

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`rounded-xl p-4 border shadow-sm ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
                    }`}
            >
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xl">{stat.icon}</span>
                    <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${stat.positive
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-red-50 text-red-600"
                            }`}
                    >
                        {stat.change}
                    </span>
                </div>
                <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
                    {formatted}
                </div>
                <div className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    {stat.label}
                </div>
            </motion.div>
        );
    }

    return (
        <div className={`p-6 min-h-full ${isDark ? "bg-gray-950" : "bg-gray-50"}`}>

            {/* Header */}
            <div className="mb-6">
                <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
                    Dashboard
                </h1>
                <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    Welcome back — here's what's happening today.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                {stats.map((stat, index) => (
                    <StatCard
                        key={stat.label}
                        stat={stat}
                        index={index}
                        isDark={isDark}
                    />
                ))}
            </div>

            {/* Chart */}
            <div
                className={`rounded-xl border p-5 mb-6 shadow-sm ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
                    }`}
            >
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>
                            Growth Overview
                        </h2>
                        <p className={`text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                            Users and revenue over the last 7 months
                        </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-0.5 bg-blue-500 rounded" />
                            <span className={isDark ? "text-gray-400" : "text-gray-500"}>Users</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-0.5 bg-emerald-500 rounded" />
                            <span className={isDark ? "text-gray-400" : "text-gray-500"}>Revenue</span>
                        </div>
                    </div>
                </div>

                <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1f2937" : "#f0f0f0"} />
                        <XAxis
                            dataKey="month"
                            tick={{ fontSize: 11, fill: isDark ? "#9ca3af" : "#6b7280" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 11, fill: isDark ? "#9ca3af" : "#6b7280" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                background: isDark ? "#111827" : "#fff",
                                border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
                                borderRadius: "8px",
                                fontSize: "12px",
                            }}
                        />
                        <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Activity Table */}
            <div
                className={`rounded-xl border shadow-sm ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
                    }`}
            >
                <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                    <h2 className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>
                        Recent Activity
                    </h2>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {activityData.map((item) => (
                        <div key={item.id} className="px-5 py-3.5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-600">
                                    {item.user.charAt(0)}
                                </div>
                                <div>
                                    <div className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-800"}`}>
                                        {item.user}
                                    </div>
                                    <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                        {item.action}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[item.status]}`}>
                                    {item.status}
                                </span>
                                <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                                    {item.time}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}