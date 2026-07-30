import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Search,
  Plus,
  Fingerprint,
  Droplet,
  Users,
  Eye,
  Pencil,
  AlertTriangle,
  Inbox,
  UserRoundPlus,
  ExternalLink,
  RefreshCw,
  UsersRound,
  FileCheck2,
} from "lucide-react";

interface EmergencyContact {
  name?: string;
  relation?: string;
  phone?: string;
}

interface Patient {
  _id?: string;
  id?: string;
  fullName?: string;
  medicalId?: string;
  bloodGroup?: string;
  emergencyContacts?: EmergencyContact[];
}

const PATIENTS_ENDPOINT = "http://localhost:5001/api/patients";

const staggerContainerVariant = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

function extractPatientList(payload: unknown): Patient[] {
  if (Array.isArray(payload)) return payload;
  const record = payload as { data?: unknown; patients?: unknown } | null | undefined;
  if (Array.isArray(record?.data)) return record.data;
  if (Array.isArray(record?.patients)) return record.patients;
  return [];
}

function getEmergencyContactCount(patient: Patient): number {
  return Array.isArray(patient.emergencyContacts) ? patient.emergencyContacts.length : 0;
}

function getInitials(fullName?: string): string {
  if (!fullName) return "NA";
  const parts = fullName.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "");
  return initials.join("") || "NA";
}

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
}

function StatCard({ icon: Icon, label, value }: StatCardProps) {
  return (
    <motion.div
      variants={fadeUpVariant}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          <p className="text-xs font-medium text-slate-500">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

interface QuickActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  to?: string;
}

function QuickActionButton({ icon: Icon, label, onClick, to }: QuickActionButtonProps) {
  const className =
    "flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-600 hover:text-blue-600";

  if (to) {
    return (
      <Link to={to} className={className}>
        <Icon className="h-4 w-4" />
        {label}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

interface PatientCardProps {
  patient: Patient;
}

function PatientCard({ patient }: PatientCardProps) {
  const patientId = patient._id ?? patient.id;

  return (
    <motion.div
      variants={fadeUpVariant}
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
          {getInitials(patient.fullName)}
        </div>
        <h3 className="text-lg font-semibold text-slate-900">
          {patient.fullName ?? "Unnamed Patient"}
        </h3>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
          <Droplet className="h-3.5 w-3.5" />
          {patient.bloodGroup ?? "Unknown"}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          <Fingerprint className="h-3.5 w-3.5" />
          {patient.medicalId ?? "N/A"}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          <Users className="h-3.5 w-3.5" />
          {getEmergencyContactCount(patient)} contacts
        </span>
      </div>

      <div className="mt-6 flex gap-3">
        <Link
          to={`/profile/${patientId}`}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          <Eye className="h-4 w-4" />
          View
        </Link>
        <Link
          to={`/edit/${patientId}`}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-600 hover:text-blue-600"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Link>
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-slate-200" />
        <div className="h-4 w-32 rounded bg-slate-200" />
      </div>
      <div className="mt-5 flex gap-2">
        <div className="h-6 w-16 rounded-full bg-slate-200" />
        <div className="h-6 w-16 rounded-full bg-slate-200" />
        <div className="h-6 w-20 rounded-full bg-slate-200" />
      </div>
      <div className="mt-6 flex gap-3">
        <div className="h-10 flex-1 rounded-full bg-slate-200" />
        <div className="h-10 flex-1 rounded-full bg-slate-200" />
      </div>
    </div>
  );
}

function DashboardPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPatients = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.get(PATIENTS_ENDPOINT);
      setPatients(extractPatientList(response.data));
    } catch (error) {
      setErrorMessage("We couldn't load patient records right now. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const filteredPatients = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return patients;
    return patients.filter((patient) => {
      const fullName = patient.fullName?.toLowerCase() ?? "";
      const medicalId = patient.medicalId?.toLowerCase() ?? "";
      return fullName.includes(query) || medicalId.includes(query);
    });
  }, [patients, searchTerm]);

  const stats = useMemo(() => {
    const bloodGroups = new Set(patients.map((patient) => patient.bloodGroup).filter(Boolean));
    const totalContacts = patients.reduce((sum, patient) => sum + getEmergencyContactCount(patient), 0);

    return {
      totalPatients: patients.length,
      bloodGroupsAvailable: bloodGroups.size,
      totalEmergencyContacts: totalContacts,
      profilesCreated: patients.length,
    };
  }, [patients]);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Patient Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Manage emergency medical profiles across your organization.
            </p>
          </div>
          <Link
            to="/create"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Create Profile
          </Link>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainerVariant}
          className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <StatCard icon={UsersRound} label="Total Patients" value={stats.totalPatients} />
          <StatCard icon={Droplet} label="Blood Groups Available" value={stats.bloodGroupsAvailable} />
          <StatCard icon={Users} label="Total Emergency Contacts" value={stats.totalEmergencyContacts} />
          <StatCard icon={FileCheck2} label="Profiles Created" value={stats.profilesCreated} />
        </motion.div>

        <div className="mt-8 flex flex-wrap gap-3">
          <QuickActionButton icon={UserRoundPlus} label="Create Patient" to="/create" />
          <QuickActionButton icon={ExternalLink} label="View Public Profile" to="/profile/demo" />
          <QuickActionButton icon={RefreshCw} label="Refresh" onClick={fetchPatients} />
        </div>

        <div className="relative mt-8 max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search patients by name or medical ID..."
            className="w-full rounded-full border border-slate-300 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div className="mt-10">
          {isLoading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          )}

          {!isLoading && errorMessage && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-20">
              <AlertTriangle className="h-6 w-6 text-rose-600" />
              <p className="text-sm font-medium text-slate-700">{errorMessage}</p>
            </div>
          )}

          {!isLoading && !errorMessage && filteredPatients.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-20 text-center">
              <Inbox className="h-6 w-6 text-blue-600" />
              <p className="text-sm font-medium text-slate-700">
                {patients.length === 0 ? "No patient profiles yet" : "No patients match your search"}
              </p>
              <p className="max-w-sm text-sm text-slate-500">
                {patients.length === 0
                  ? "Create your first patient profile to start building your emergency response network."
                  : "Try a different name or medical ID."}
              </p>
              {patients.length === 0 && (
                <Link
                  to="/create"
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Create Profile
                </Link>
              )}
            </div>
          )}

          {!isLoading && !errorMessage && filteredPatients.length > 0 && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainerVariant}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filteredPatients.map((patient) => (
                <PatientCard key={patient._id ?? patient.id} patient={patient} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
