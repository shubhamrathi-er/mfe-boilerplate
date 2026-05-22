import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion,Transition } from "framer-motion";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import SettingsPage from "./pages/SettingsPage";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const pageTransition: Transition = {
  duration: 0.25,
  ease: "easeInOut",
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              className="h-full"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              <DashboardPage />
            </motion.div>
          }
        />
        <Route
          path="/settings"
          element={
            <motion.div
              className="h-full"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              <SettingsPage />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <AnimatedRoutes />
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}