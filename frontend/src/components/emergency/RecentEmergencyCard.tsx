import { Fingerprint, Eye } from "lucide-react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import type { EmergencySession } from "../../types/emergencySession";

function formatDateTime(value?: string): string {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(seconds?: number): string {
  if (!seconds || seconds < 1) return "Under a minute";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

interface RecentEmergencyCardProps {
  session: EmergencySession;
}

function RecentEmergencyCard({ session }: RecentEmergencyCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{session.patientName ?? "Unknown Patient"}</h3>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <Fingerprint className="h-3.5 w-3.5" />
            {session.medicalId}
          </div>
        </div>
        <Badge tone="slate">⚫ Closed</Badge>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm">
        <div>
          <p className="text-xs text-slate-500">Started</p>
          <p className="font-medium text-slate-800">{formatDateTime(session.startedAt)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Ended</p>
          <p className="font-medium text-slate-800">{formatDateTime(session.closedAt)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Duration</p>
          <p className="font-medium text-slate-800">{formatDuration(session.duration)}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <Eye className="h-3.5 w-3.5 text-slate-400" />
          <div>
            <p className="text-xs text-slate-500">Views</p>
            <p className="font-medium text-slate-800">{session.viewCount}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default RecentEmergencyCard;
