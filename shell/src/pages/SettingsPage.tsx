import { Suspense, lazy } from "react";
import ErrorBoundary from "../components/ErrorBoundary";

const Settings = lazy(() => import("appSettings/Settings"));

function LoadingSkeleton() {
  return (
    <div className="p-6 space-y-4 animate-pulse">
      <div className="h-8 w-48 bg-gray-100 rounded-lg" />
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-100 rounded-xl" />
      ))}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ErrorBoundary name="Settings">
      <Suspense fallback={<LoadingSkeleton />}>
        <Settings />
      </Suspense>
    </ErrorBoundary>
  );
}