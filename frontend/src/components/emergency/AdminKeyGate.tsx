import { useState } from "react";
import { ShieldCheck, Loader2, AlertTriangle } from "lucide-react";
import Card from "../ui/Card";
import { buttonClassName } from "../ui/Button";
import { fetchActiveSessions, ADMIN_KEY_STORAGE_KEY } from "../../api/emergencyApi";

interface AdminKeyGateProps {
  onUnlock: (key: string) => void;
}

function AdminKeyGate({ onUnlock }: AdminKeyGateProps) {
  const [key, setKey] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsVerifying(true);

    try {
      await fetchActiveSessions(key.trim());
      sessionStorage.setItem(ADMIN_KEY_STORAGE_KEY, key.trim());
      onUnlock(key.trim());
    } catch (err) {
      setError("Invalid admin key. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <Card className="w-full max-w-sm p-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-lg font-semibold text-slate-900">Admin Access Required</h1>
          <p className="mt-1 text-sm text-slate-500">
            Enter the admin key to view emergency monitoring.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="password"
            value={key}
            onChange={(event) => setKey(event.target.value)}
            placeholder="Admin key"
            autoFocus
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-700 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />

          {error && (
            <div className="flex items-center gap-2 text-sm text-rose-600">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isVerifying || !key.trim()}
            className={buttonClassName("primary", "md", "w-full")}
          >
            {isVerifying && <Loader2 className="h-4 w-4 animate-spin" />}
            {isVerifying ? "Verifying..." : "Unlock Dashboard"}
          </button>
        </form>
      </Card>
    </div>
  );
}

export default AdminKeyGate;
