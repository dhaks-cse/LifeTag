import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
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
} from "lucide-react";

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

const PATIENTS_ENDPOINT = "http://localhost:5001/api/patients";

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

interface InfoRowProps {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}

function InfoRow({ icon: Icon, label, children }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3 border-b border-slate-100 py-4 last:border-b-0">
      <Icon className="mt-0.5 h-4.5 w-4.5 flex-shrink-0 text-blue-600" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        <div className="mt-1 text-sm font-medium text-slate-800">{children}</div>
      </div>
    </div>
  );
}

interface TagListProps {
  items?: string[];
  emptyLabel: string;
  tone: string;
}

function TagList({ items, emptyLabel, tone }: TagListProps) {
  const values = formatList(items);

  if (!values) {
    return <span className="text-sm text-slate-500">{emptyLabel}</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {values.map((value) => (
        <span
          key={value}
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${tone}`}
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
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-slate-600">Loading emergency profile...</p>
        </div>
      </div>
    );
  }

  if (notFound || !patient) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6">
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

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-6 py-10 lg:px-8">
        <div className="rounded-3xl bg-blue-600 px-6 py-8 text-center text-white sm:px-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/15">
            <HeartPulse className="h-7 w-7" />
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-blue-100">
            Emergency Medical Profile
          </p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{patient.fullName ?? "Unknown Patient"}</h1>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
              <Fingerprint className="h-3.5 w-3.5" />
              {patient.medicalId ?? "N/A"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-700">
              <Droplet className="h-3.5 w-3.5" />
              {patient.bloodGroup ?? "Unknown"}
            </span>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Personal Information
          </h2>
          <div className="mt-2">
            <InfoRow icon={Calendar} label="Date of Birth">
              {formatDate(patient.dateOfBirth)}
            </InfoRow>
            <InfoRow icon={UserRound} label="Gender">
              {patient.gender ?? "Not provided"}
            </InfoRow>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Medical Information
          </h2>
          <div className="mt-2">
            <InfoRow icon={ShieldAlert} label="Allergies">
              <TagList
                items={patient.allergies}
                emptyLabel="No known allergies"
                tone="bg-rose-50 text-rose-700"
              />
            </InfoRow>
            <InfoRow icon={Activity} label="Chronic Conditions">
              <TagList
                items={patient.chronicConditions}
                emptyLabel="None reported"
                tone="bg-amber-50 text-amber-700"
              />
            </InfoRow>
            <InfoRow icon={Pill} label="Current Medications">
              <TagList
                items={patient.currentMedications}
                emptyLabel="None reported"
                tone="bg-blue-50 text-blue-700"
              />
            </InfoRow>
            <InfoRow icon={BadgeCheck} label="Organ Donor">
              {patient.organDonor ? "Yes, registered organ donor" : "Not a registered organ donor"}
            </InfoRow>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Emergency Contacts
          </h2>
          <div className="mt-4 space-y-3">
            {emergencyContacts ? (
              emergencyContacts.map((contact, index) => (
                <div
                  key={`${contact.name ?? "contact"}-${index}`}
                  className="flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {contact.name ?? "Unnamed Contact"}
                      </p>
                      <p className="text-xs text-slate-500">{contact.relation ?? "Relation not provided"}</p>
                    </div>
                  </div>
                  {contact.phone && (
                    <a
                      href={`tel:${contact.phone}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      {contact.phone}
                    </a>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No emergency contacts listed.</p>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Notes</h2>
          <div className="mt-2 flex items-start gap-3">
            <FileText className="mt-0.5 h-4.5 w-4.5 flex-shrink-0 text-blue-600" />
            <p className="text-sm leading-relaxed text-slate-700">
              {patient.notes && patient.notes.trim() ? patient.notes : "No additional notes provided."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicProfilePage;
