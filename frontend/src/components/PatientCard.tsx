import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Droplet, Fingerprint, Phone, Eye, Pencil, AlertTriangle, Clock } from "lucide-react";
import type { Patient } from "../types/patient";
import Badge from "./ui/Badge";
import { buttonClassName } from "./ui/Button";

const fadeUpVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

function getInitials(fullName?: string): string {
  if (!fullName) return "NA";
  const parts = fullName.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "");
  return initials.join("") || "NA";
}

function formatRelativeTime(value?: string): string {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.round(diffMs / 60000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

interface PatientCardProps {
  patient: Patient;
}

function PatientCard({ patient }: PatientCardProps) {
  const primaryContact = patient.emergencyContacts?.[0];
  const hasCriticalAllergy = Array.isArray(patient.allergies) && patient.allergies.length > 0;

  return (
    <motion.div
      variants={fadeUpVariant}
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-shadow hover:shadow-soft"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
            {getInitials(patient.fullName)}
          </div>
          <div>
            <h3 className="text-lg font-semibold leading-tight text-slate-900">
              {patient.fullName ?? "Unnamed Patient"}
            </h3>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
              <Clock className="h-3 w-3" />
              Updated {formatRelativeTime(patient.updatedAt)}
            </div>
          </div>
        </div>
        {hasCriticalAllergy && (
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600" title="Has known allergies">
            <AlertTriangle className="h-4 w-4" />
          </span>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Badge tone="rose" icon={<Droplet className="h-3.5 w-3.5" />}>
          {patient.bloodGroup ?? "Unknown"}
        </Badge>
        <Badge tone="blue" icon={<Fingerprint className="h-3.5 w-3.5" />}>
          {patient.medicalId ?? "N/A"}
        </Badge>
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
        {primaryContact ? (
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-700">{primaryContact.name}</p>
              <p className="truncate text-xs text-slate-400">{primaryContact.relation}</p>
            </div>
            {primaryContact.phone && (
              <a
                href={`tel:${primaryContact.phone}`}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700"
                aria-label={`Call ${primaryContact.name ?? "emergency contact"}`}
              >
                <Phone className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-400">No emergency contact listed.</p>
        )}
      </div>

      <div className="mt-5 flex gap-3">
        <Link to={`/profile/${patient.medicalId}`} className={buttonClassName("primary", "sm", "flex-1")}>
          <Eye className="h-4 w-4" />
          View
        </Link>
        <Link to={`/edit/${patient.medicalId}`} className={buttonClassName("secondary", "sm", "flex-1")}>
          <Pencil className="h-4 w-4" />
          Edit
        </Link>
      </div>
    </motion.div>
  );
}

export default PatientCard;
