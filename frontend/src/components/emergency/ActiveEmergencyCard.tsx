import { Fingerprint, Eye, Clock, Loader2 } from "lucide-react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import { buttonClassName } from "../ui/Button";
import CountdownTimer from "./CountdownTimer";
import type { EmergencySession } from "../../types/emergencySession";

function formatTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

interface ActiveEmergencyCardProps {
  session: EmergencySession;
  onClose: (id: string) => void;
  isClosing: boolean;
}

function ActiveEmergencyCard({ session, onClose, isClosing }: ActiveEmergencyCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{session.patientName ?? "Unknown Patient"}</h3>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <Fingerprint className="h-3.5 w-3.5" />
            {session.medicalId}
          </div>
        </div>
        <Badge tone="rose">🔴 Active Emergency</Badge>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-rose-50/60 px-4 py-3 text-sm">
        <div>
          <p className="text-xs text-slate-500">Started</p>
          <p className="font-medium text-slate-800">{formatTime(session.startedAt)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Time Remaining</p>
          <CountdownTimer expiresAt={session.expiresAt} />
        </div>
        <div className="flex items-center gap-1.5">
          <Eye className="h-3.5 w-3.5 text-slate-400" />
          <div>
            <p className="text-xs text-slate-500">Views</p>
            <p className="font-medium text-slate-800">{session.viewCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <div>
            <p className="text-xs text-slate-500">Last Viewed</p>
            <p className="font-medium text-slate-800">{formatTime(session.lastViewedAt)}</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onClose(session._id)}
        disabled={isClosing}
        className={buttonClassName("secondary", "sm", "mt-4 w-full")}
      >
        {isClosing && <Loader2 className="h-4 w-4 animate-spin" />}
        {isClosing ? "Closing..." : "Close Session"}
      </button>
    </Card>
  );
}

export default ActiveEmergencyCard;
