import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Radio, History, Inbox, LogOut } from "lucide-react";
import Navbar from "../components/Navbar";
import Card from "../components/ui/Card";
import AdminKeyGate from "../components/emergency/AdminKeyGate";
import ActiveEmergencyCard from "../components/emergency/ActiveEmergencyCard";
import RecentEmergencyCard from "../components/emergency/RecentEmergencyCard";
import { useToast } from "../components/ui/Toast";
import {
  fetchActiveSessions,
  fetchEmergencyHistory,
  closeEmergencySession,
  ADMIN_KEY_STORAGE_KEY,
} from "../api/emergencyApi";
import type { EmergencySession } from "../types/emergencySession";

const POLL_INTERVAL_MS = 10000;

const staggerContainerVariant = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

function AdminEmergencyPage() {
  const { showToast } = useToast();
  const [adminKey, setAdminKey] = useState<string | null>(() =>
    sessionStorage.getItem(ADMIN_KEY_STORAGE_KEY)
  );
  const [activeSessions, setActiveSessions] = useState<EmergencySession[]>([]);
  const [historySessions, setHistorySessions] = useState<EmergencySession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [closingId, setClosingId] = useState<string | null>(null);

  const loadSessions = useCallback(async () => {
    if (!adminKey) return;

    try {
      const [active, history] = await Promise.all([
        fetchActiveSessions(adminKey),
        fetchEmergencyHistory(adminKey),
      ]);
      setActiveSessions(active);
      setHistorySessions(history);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("We couldn't load emergency sessions right now.");
    } finally {
      setIsLoading(false);
    }
  }, [adminKey]);

  useEffect(() => {
    if (!adminKey) return;

    loadSessions();
    const interval = setInterval(loadSessions, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [adminKey, loadSessions]);

  const handleClose = async (id: string) => {
    if (!adminKey) return;
    setClosingId(id);
    try {
      await closeEmergencySession(id, adminKey);
      showToast("success", "Emergency session closed.");
      await loadSessions();
    } catch (error) {
      showToast("error", "Couldn't close this session.");
    } finally {
      setClosingId(null);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_KEY_STORAGE_KEY);
    setAdminKey(null);
  };

  if (!adminKey) {
    return <AdminKeyGate onUnlock={setAdminKey} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Emergency Monitoring
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Live view of every emergency profile currently being accessed.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-rose-600"
          >
            <LogOut className="h-4 w-4" />
            Lock Dashboard
          </button>
        </div>

        {errorMessage && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-rose-600" />
            <p className="text-sm font-medium text-rose-700">{errorMessage}</p>
          </div>
        )}

        <section className="mt-8">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            <Radio className="h-4 w-4 text-rose-600" />
            Active Emergencies
          </h2>

          <div className="mt-4">
            {isLoading ? (
              <p className="text-sm text-slate-400">Loading...</p>
            ) : activeSessions.length === 0 ? (
              <Card className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                <Inbox className="h-6 w-6 text-blue-600" />
                <p className="text-sm font-medium text-slate-700">No active emergencies</p>
                <p className="text-sm text-slate-500">Sessions appear here the moment a LifeTag is scanned.</p>
              </Card>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainerVariant}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
              >
                {activeSessions.map((session) => (
                  <ActiveEmergencyCard
                    key={session._id}
                    session={session}
                    onClose={handleClose}
                    isClosing={closingId === session._id}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            <History className="h-4 w-4 text-slate-500" />
            Recent Emergencies
          </h2>

          <div className="mt-4">
            {!isLoading && historySessions.length === 0 ? (
              <Card className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                <Inbox className="h-6 w-6 text-slate-400" />
                <p className="text-sm font-medium text-slate-700">No closed sessions yet</p>
              </Card>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainerVariant}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
              >
                {historySessions.map((session) => (
                  <RecentEmergencyCard key={session._id} session={session} />
                ))}
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminEmergencyPage;
