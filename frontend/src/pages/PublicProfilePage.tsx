import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  HeartPulse,
  Fingerprint,
  Droplet,
  Calendar,
  UserRound,
  ShieldAlert,
  Activity,
  Pill,
  Users,
  Phone,
  BadgeCheck,
  FileText,
  Loader2,
  UserX,
  AlertTriangle,
} from "lucide-react";
import { startEmergencySession } from "../api/emergencyApi";

interface EmergencyContact {
  name?: string;
  relation?: string;
  phone?: string;
}

interface Patient {
  fullName?: string;
  medicalId?: string;
  bloodGroup?: string;
  dateOfBirth?: string;
  gender?: string;
  allergies?: string[];
  chronicConditions?: string[];
  currentMedications?: string[];
  emergencyContacts?: EmergencyContact[];
  organDonor?: boolean;
  notes?: string;
}

const API_URL = import.meta.env.VITE_API_URL;
const PATIENTS_ENDPOINT = `${API_URL}/api/patients`;

function formatDate(value?: string): string {
  if (!value) return "Not provided";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not provided";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatList<T>(value?: T[]): T[] | null {
  return Array.isArray(value) && value.length > 0 ? value : null;
}

interface SectionCardProps {
  icon: LucideIcon;
  title: string;
  tone: "rose" | "amber" | "blue" | "slate";
  children: React.ReactNode;
}

const toneStyles = {
  rose: { border: "border-rose-200", iconBg: "bg-rose-50", iconText: "text-rose-600" },
  amber: { border: "border-amber-200", iconBg: "bg-amber-50", iconText: "text-amber-600" },
  blue: { border: "border-blue-200", iconBg: "bg-blue-50", iconText: "text-blue-600" },
  slate: { border: "border-slate-200", iconBg: "bg-slate-100", iconText: "text-slate-600" },
};

function SectionCard({ icon: Icon, title, tone, children }: SectionCardProps) {
  const styles = toneStyles[tone];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border ${styles.border} bg-white p-6 shadow-card`}
    >
      <div className="flex items-center gap-2.5">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${styles.iconBg} ${styles.iconText}`}>
          <Icon className="h-4 w-4" />
        </div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h2>
      </div>
      <div className="mt-4">{children}</div>
    </motion.div>
  );
}

function TagList({ items, emptyLabel, tone }: { items?: string[]; emptyLabel: string; tone: string }) {
  const values = formatList(items);

  if (!values) {
    return <span className="text-sm text-slate-500">{emptyLabel}</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {values.map((value) => (
        <span
          key={value}
          className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-semibold ${tone}`}
        >
          {value}
        </span>
      ))}
    </div>
  );
}

function PublicProfilePage() {
  const { medicalId } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchPatient() {
      setIsLoading(true);
      setNotFound(false);

      try {
        const response = await axios.get(`${PATIENTS_ENDPOINT}/${medicalId}`);
        const data: Patient | undefined = response.data?.data ?? response.data;

        if (!isMounted) return;

        if (!data) {
          setNotFound(true);
        } else {
          setPatient(data);
          if (medicalId) {
            startEmergencySession(medicalId).catch(() => {
              // Silently ignore: emergency session tracking must never block the public profile.
            });
          }
        }
      } catch (error) {
        if (isMounted) {
          setNotFound(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchPatient();

    return () => {
      isMounted = false;
    };
  }, [medicalId]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-slate-600">Loading emergency profile...</p>
        </div>
      </div>
    );
  }

  if (notFound || !patient) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <UserX className="h-8 w-8 text-rose-600" />
          <h1 className="text-lg font-semibold text-slate-900">Patient Not Found</h1>
          <p className="max-w-sm text-sm text-slate-500">
            We couldn't find an emergency profile matching this LifeTag. Please verify the tag or QR code.
          </p>
        </div>
      </div>
    );
  }

  const emergencyContacts = formatList(patient.emergencyContacts);
  const hasAllergies = formatList(patient.allergies) !== null;

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-6 pb-12 pt-10 text-white sm:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/15">
            <HeartPulse className="h-8 w-8" />
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-blue-100">
            Emergency Medical Profile
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{patient.fullName ?? "Unknown Patient"}</h1>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold">
              <Fingerprint className="h-4 w-4" />
              {patient.medicalId ?? "N/A"}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-base font-bold text-blue-700 shadow-soft">
              <Droplet className="h-4 w-4" />
              {patient.bloodGroup ?? "Unknown"}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto -mt-6 max-w-2xl space-y-4 px-6 sm:px-10">
        {hasAllergies && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 rounded-2xl border-2 border-rose-300 bg-rose-50 px-5 py-4 shadow-soft"
          >
            <AlertTriangle className="h-6 w-6 flex-shrink-0 text-rose-600" />
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-rose-700">Critical: Known Allergies</p>
              <p className="text-sm text-rose-700">{patient.allergies?.join(", ")}</p>
            </div>
          </motion.div>
        )}

        <SectionCard icon={Calendar} title="Personal Information" tone="slate">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs text-slate-400">Date of Birth</p>
              <p className="mt-0.5 text-sm font-semibold text-slate-800">{formatDate(patient.dateOfBirth)}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <UserRound className="h-3.5 w-3.5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-400">Gender</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-800">{patient.gender ?? "Not provided"}</p>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard icon={ShieldAlert} title="Allergies" tone="rose">
          <TagList items={patient.allergies} emptyLabel="No known allergies" tone="bg-rose-50 text-rose-700" />
        </SectionCard>

        <SectionCard icon={Activity} title="Chronic Conditions" tone="amber">
          <TagList items={patient.chronicConditions} emptyLabel="None reported" tone="bg-amber-50 text-amber-700" />
        </SectionCard>

        <SectionCard icon={Pill} title="Current Medications" tone="blue">
          <TagList items={patient.currentMedications} emptyLabel="None reported" tone="bg-blue-50 text-blue-700" />
        </SectionCard>

        <SectionCard icon={Users} title="Emergency Contacts" tone="slate">
          <div className="space-y-3">
            {emergencyContacts ? (
              emergencyContacts.map((contact, index) => (
                <div
                  key={`${contact.name ?? "contact"}-${index}`}
                  className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {contact.name ?? "Unnamed Contact"}
                    </p>
                    <p className="truncate text-xs text-slate-500">{contact.relation ?? "Relation not provided"}</p>
                  </div>
                  {contact.phone && (
                    <a
                      href={`tel:${contact.phone}`}
                      className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      Call
                    </a>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No emergency contacts listed.</p>
            )}
          </div>
        </SectionCard>

        <SectionCard icon={BadgeCheck} title="Organ Donor Status" tone="slate">
          <p className="text-sm font-semibold text-slate-800">
            {patient.organDonor ? "Yes, registered organ donor" : "Not a registered organ donor"}
          </p>
        </SectionCard>

        <SectionCard icon={FileText} title="Medical Notes" tone="slate">
          <p className="text-sm leading-relaxed text-slate-700">
            {patient.notes && patient.notes.trim() ? patient.notes : "No additional notes provided."}
          </p>
        </SectionCard>
      </div>
    </div>
  );
}

export default PublicProfilePage;
