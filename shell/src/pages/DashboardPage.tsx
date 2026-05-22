import { Suspense, lazy } from "react";
import ErrorBoundary from "../components/ErrorBoundary";

const Dashboard = lazy(() => import("appDashboard/Dashboard"));

function LoadingSkeleton() {
  return (
    <div className="p-6 space-y-4 animate-pulse">
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-xl" />
        ))}
      </div>
      <div className="h-64 bg-gray-100 rounded-xl" />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ErrorBoundary name="Dashboard">
      <Suspense fallback={<LoadingSkeleton />}>
        <Dashboard />
      </Suspense>
    </ErrorBoundary>
  );
}