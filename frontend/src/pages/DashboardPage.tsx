import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  AlertTriangle,
  Inbox,
  UserRoundPlus,
  ExternalLink,
  RefreshCw,
  UsersRound,
  Droplet,
  Users,
  FileCheck2,
  Clock,
  Filter,
} from "lucide-react";
import type { Patient } from "../types/patient";
import Navbar from "../components/Navbar";
import PatientCard from "../components/PatientCard";
import Card from "../components/ui/Card";
import Skeleton from "../components/ui/Skeleton";
import { buttonClassName } from "../components/ui/Button";
import { useToast } from "../components/ui/Toast";

const API_URL = import.meta.env.VITE_API_URL;
const PATIENTS_ENDPOINT = `${API_URL}/api/patients`;

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

function formatRelativeTime(value?: string): string {
  if (!value) return "recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "recently";
  const diffMinutes = Math.round((Date.now() - date.getTime()) / 60000);
  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.round(diffHours / 24)}d ago`;
}

interface StatCardProps {
  icon: typeof UsersRound;
  label: string;
  value: number;
}

function StatCard({ icon: Icon, label, value }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          <p className="text-xs font-medium text-slate-500">{label}</p>
        </div>
      </div>
    </Card>
  );
}

interface QuickActionButtonProps {
  icon: typeof UserRoundPlus;
  label: string;
  onClick?: () => void;
  to?: string;
}

function QuickActionButton({ icon: Icon, label, onClick, to }: QuickActionButtonProps) {
  const className = buttonClassName("secondary", "sm");

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

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="mt-5 flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-12 w-full" />
      <div className="mt-5 flex gap-3">
        <Skeleton className="h-10 flex-1 rounded-full" />
        <Skeleton className="h-10 flex-1 rounded-full" />
      </div>
    </div>
  );
}

function DashboardPage() {
  const { showToast } = useToast();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [bloodGroupFilter, setBloodGroupFilter] = useState("all");

  const fetchPatients = useCallback(
    async (isManualRefresh = false) => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await axios.get(PATIENTS_ENDPOINT);
        setPatients(extractPatientList(response.data));
        if (isManualRefresh) showToast("success", "Patient list refreshed.");
      } catch (error) {
        setErrorMessage("We couldn't load patient records right now. Please try again later.");
        if (isManualRefresh) showToast("error", "Couldn't refresh patient list.");
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  useEffect(() => {
    fetchPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bloodGroups = useMemo(
    () => Array.from(new Set(patients.map((patient) => patient.bloodGroup).filter(Boolean))) as string[],
    [patients]
  );

  const filteredPatients = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return patients.filter((patient) => {
      const fullName = patient.fullName?.toLowerCase() ?? "";
      const medicalId = patient.medicalId?.toLowerCase() ?? "";
      const matchesQuery = !query || fullName.includes(query) || medicalId.includes(query);
      const matchesBloodGroup = bloodGroupFilter === "all" || patient.bloodGroup === bloodGroupFilter;
      return matchesQuery && matchesBloodGroup;
    });
  }, [patients, searchTerm, bloodGroupFilter]);

  const recentPatients = useMemo(() => {
    return [...patients]
      .sort((a, b) => new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime())
      .slice(0, 5);
  }, [patients]);

  const stats = useMemo(() => {
    const uniqueBloodGroups = new Set(patients.map((patient) => patient.bloodGroup).filter(Boolean));
    const totalContacts = patients.reduce((sum, patient) => sum + getEmergencyContactCount(patient), 0);

    return {
      totalPatients: patients.length,
      bloodGroupsAvailable: uniqueBloodGroups.size,
      totalEmergencyContacts: totalContacts,
      profilesCreated: patients.length,
    };
  }, [patients]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

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
          <Link to="/create" className={buttonClassName("primary", "md")}>
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
          <QuickActionButton icon={RefreshCw} label="Refresh" onClick={() => fetchPatients(true)} />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search patients by name or medical ID..."
                  className="w-full rounded-full border border-slate-300 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div className="relative">
                <Filter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select
                  value={bloodGroupFilter}
                  onChange={(event) => setBloodGroupFilter(event.target.value)}
                  className="w-full rounded-full border border-slate-300 bg-white py-2.5 pl-11 pr-8 text-sm text-slate-700 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 sm:w-52"
                >
                  <option value="all">All Blood Groups</option>
                  {bloodGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6">
              {isLoading && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <SkeletonCard key={index} />
                  ))}
                </div>
              )}

              {!isLoading && errorMessage && (
                <Card className="flex flex-col items-center justify-center gap-3 py-20">
                  <AlertTriangle className="h-6 w-6 text-rose-600" />
                  <p className="text-sm font-medium text-slate-700">{errorMessage}</p>
                </Card>
              )}

              {!isLoading && !errorMessage && filteredPatients.length === 0 && (
                <Card className="flex flex-col items-center justify-center gap-3 py-20 text-center">
                  <Inbox className="h-6 w-6 text-blue-600" />
                  <p className="text-sm font-medium text-slate-700">
                    {patients.length === 0 ? "No patient profiles yet" : "No patients match your filters"}
                  </p>
                  <p className="max-w-sm text-sm text-slate-500">
                    {patients.length === 0
                      ? "Create your first patient profile to start building your emergency response network."
                      : "Try a different name, medical ID, or blood group."}
                  </p>
                  {patients.length === 0 && (
                    <Link to="/create" className={buttonClassName("primary", "sm", "mt-2")}>
                      <Plus className="h-4 w-4" />
                      Create Profile
                    </Link>
                  )}
                </Card>
              )}

              {!isLoading && !errorMessage && filteredPatients.length > 0 && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainerVariant}
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
                >
                  {filteredPatients.map((patient) => (
                    <PatientCard key={patient.medicalId} patient={patient} />
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-5">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Clock className="h-4 w-4 text-blue-600" />
                Recent Activity
              </h2>
              <div className="mt-4 space-y-1">
                {recentPatients.length === 0 && (
                  <p className="text-sm text-slate-400">No activity yet.</p>
                )}
                {recentPatients.map((patient) => (
                  <Link
                    key={patient.medicalId}
                    to={`/profile/${patient.medicalId}`}
                    className="flex items-center justify-between gap-2 rounded-xl px-2 py-2.5 text-sm transition-colors hover:bg-slate-50"
                  >
                    <span className="truncate font-medium text-slate-700">
                      {patient.fullName ?? "Unnamed Patient"}
                    </span>
                    <span className="flex-shrink-0 text-xs text-slate-400">
                      {formatRelativeTime(patient.updatedAt)}
                    </span>
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
