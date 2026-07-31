import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import CreateProfilePage from "./pages/CreateProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import PublicProfilePage from "./pages/PublicProfilePage";
import AdminEmergencyPage from "./pages/AdminEmergencyPage";
import PageTransition from "./components/PageTransition";
import { ToastProvider } from "./components/ui/Toast";

function App() {
  const location = useLocation();

  return (
    <ToastProvider>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/dashboard"
            element={
              <PageTransition>
                <DashboardPage />
              </PageTransition>
            }
          />
          <Route
            path="/create"
            element={
              <PageTransition>
                <CreateProfilePage />
              </PageTransition>
            }
          />
          <Route
            path="/edit/:medicalId"
            element={
              <PageTransition>
                <EditProfilePage />
              </PageTransition>
            }
          />
          <Route
            path="/profile/:medicalId"
            element={
              <PageTransition>
                <PublicProfilePage />
              </PageTransition>
            }
          />
          <Route
            path="/admin/emergency"
            element={
              <PageTransition>
                <AdminEmergencyPage />
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
    </ToastProvider>
  );
}

export default App;
