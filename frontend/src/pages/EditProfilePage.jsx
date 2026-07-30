import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  HeartPulse,
  Droplet,
  Calendar,
  UserRound,
  ShieldAlert,
  Activity,
  Pill,
  Users,
  BadgeCheck,
  FileText,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

const PATIENTS_ENDPOINT = "http://localhost:5001/api/patients";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const GENDERS = ["Male", "Female", "Other"];

const initialFormState = {
  fullName: "",
  bloodGroup: "",
  dateOfBirth: "",
  gender: "",
  allergies: "",
  chronicConditions: "",
  currentMedications: "",
  emergencyContactName: "",
  emergencyContactRelation: "",
  emergencyContactPhone: "",
  organDonor: false,
  notes: "",
};

function splitToList(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinList(value) {
  return Array.isArray(value) ? value.join(", ") : "";
}

function toDateInputValue(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
}

function validateForm(formData) {
  const errors = {};

  if (!formData.fullName.trim()) {
    errors.fullName = "Full name is required.";
  }

  if (!formData.bloodGroup) {
    errors.bloodGroup = "Blood group is required.";
  }

  if (formData.dateOfBirth) {
    const dob = new Date(formData.dateOfBirth);
    if (Number.isNaN(dob.getTime()) || dob > new Date()) {
      errors.dateOfBirth = "Please enter a valid date of birth.";
    }
  }

  const hasAnyContactField =
    formData.emergencyContactName.trim() ||
    formData.emergencyContactRelation.trim() ||
    formData.emergencyContactPhone.trim();

  if (hasAnyContactField) {
    if (!formData.emergencyContactName.trim()) {
      errors.emergencyContactName = "Contact name is required.";
    }
    if (!formData.emergencyContactRelation.trim()) {
      errors.emergencyContactRelation = "Contact relation is required.";
    }
    if (!formData.emergencyContactPhone.trim()) {
      errors.emergencyContactPhone = "Contact phone is required.";
    } else if (!/^[0-9+\-\s()]{7,20}$/.test(formData.emergencyContactPhone.trim())) {
      errors.emergencyContactPhone = "Please enter a valid phone number.";
    }
  }

  return errors;
}

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs font-medium text-rose-600">{message}</p>;
}

function EditProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormState);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchPatient() {
      setIsLoading(true);
      setLoadError("");

      try {
        const response = await axios.get(`${PATIENTS_ENDPOINT}/${id}`);
        const patient = response.data?.data ?? response.data;

        if (!isMounted || !patient) {
          return;
        }

        const emergencyContact = patient.emergencyContacts?.[0] ?? {};

        setFormData({
          fullName: patient.fullName ?? "",
          bloodGroup: patient.bloodGroup ?? "",
          dateOfBirth: toDateInputValue(patient.dateOfBirth),
          gender: patient.gender ?? "",
          allergies: joinList(patient.allergies),
          chronicConditions: joinList(patient.chronicConditions),
          currentMedications: joinList(patient.currentMedications),
          emergencyContactName: emergencyContact.name ?? "",
          emergencyContactRelation: emergencyContact.relation ?? "",
          emergencyContactPhone: emergencyContact.phone ?? "",
          organDonor: Boolean(patient.organDonor),
          notes: patient.notes ?? "",
        });
      } catch (error) {
        if (isMounted) {
          setLoadError("We couldn't load this patient profile. Please try again later.");
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
  }, [id]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage("");
    setSubmitError("");

    const errors = validateForm(formData);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const hasEmergencyContact = Boolean(formData.emergencyContactName.trim());

    const payload = {
      fullName: formData.fullName.trim(),
      bloodGroup: formData.bloodGroup,
      gender: formData.gender || undefined,
      dateOfBirth: formData.dateOfBirth || undefined,
      allergies: splitToList(formData.allergies),
      chronicConditions: splitToList(formData.chronicConditions),
      currentMedications: splitToList(formData.currentMedications),
      emergencyContacts: hasEmergencyContact
        ? [
            {
              name: formData.emergencyContactName.trim(),
              relation: formData.emergencyContactRelation.trim(),
              phone: formData.emergencyContactPhone.trim(),
            },
          ]
        : [],
      organDonor: formData.organDonor,
      notes: formData.notes.trim(),
    };

    setIsSubmitting(true);

    try {
      await axios.put(`${PATIENTS_ENDPOINT}/${id}`, payload);
      setSuccessMessage("Patient profile updated successfully. Redirecting to dashboard...");
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (error) {
      setSubmitError(
        error.response?.data?.message ?? "We couldn't update this profile. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-slate-600">Loading patient profile...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertTriangle className="h-6 w-6 text-rose-600" />
          <p className="text-sm font-medium text-slate-700">{loadError}</p>
          <Link
            to="/dashboard"
            className="mt-2 inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-6 py-10 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
            <HeartPulse className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Edit Patient Profile
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Update medical details to keep this profile accurate for responders.
            </p>
          </div>
        </div>

        {successMessage && (
          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-blue-600" />
            <p className="text-sm font-medium text-blue-700">{successMessage}</p>
          </div>
        )}

        {submitError && (
          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-rose-600" />
            <p className="text-sm font-medium text-rose-700">{submitError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-10">
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Personal Information
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="fullName" className="text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <div className="relative mt-1.5">
                  <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Jordan Miller"
                    className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm text-slate-700 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <FieldError message={fieldErrors.fullName} />
              </div>

              <div>
                <label htmlFor="dateOfBirth" className="text-sm font-medium text-slate-700">
                  Date of Birth
                </label>
                <div className="relative mt-1.5">
                  <Calendar className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm text-slate-700 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <FieldError message={fieldErrors.dateOfBirth} />
              </div>

              <div>
                <label htmlFor="gender" className="text-sm font-medium text-slate-700">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white py-2.5 px-4 text-sm text-slate-700 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                >
                  <option value="">Select gender</option>
                  {GENDERS.map((gender) => (
                    <option key={gender} value={gender}>
                      {gender}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="bloodGroup" className="text-sm font-medium text-slate-700">
                  Blood Group
                </label>
                <div className="relative mt-1.5">
                  <Droplet className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <select
                    id="bloodGroup"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="">Select blood group</option>
                    {BLOOD_GROUPS.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>
                <FieldError message={fieldErrors.bloodGroup} />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Medical Information
            </h2>
            <div className="mt-4 space-y-5">
              <div>
                <label htmlFor="allergies" className="text-sm font-medium text-slate-700">
                  Allergies
                </label>
                <div className="relative mt-1.5">
                  <ShieldAlert className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    id="allergies"
                    name="allergies"
                    type="text"
                    value={formData.allergies}
                    onChange={handleChange}
                    placeholder="Penicillin, Peanuts"
                    className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm text-slate-700 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <p className="mt-1.5 text-xs text-slate-400">Separate multiple entries with commas.</p>
              </div>

              <div>
                <label htmlFor="chronicConditions" className="text-sm font-medium text-slate-700">
                  Chronic Conditions
                </label>
                <div className="relative mt-1.5">
                  <Activity className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    id="chronicConditions"
                    name="chronicConditions"
                    type="text"
                    value={formData.chronicConditions}
                    onChange={handleChange}
                    placeholder="Type 1 Diabetes, Asthma"
                    className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm text-slate-700 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <p className="mt-1.5 text-xs text-slate-400">Separate multiple entries with commas.</p>
              </div>

              <div>
                <label htmlFor="currentMedications" className="text-sm font-medium text-slate-700">
                  Current Medications
                </label>
                <div className="relative mt-1.5">
                  <Pill className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    id="currentMedications"
                    name="currentMedications"
                    type="text"
                    value={formData.currentMedications}
                    onChange={handleChange}
                    placeholder="Insulin, Albuterol"
                    className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm text-slate-700 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <p className="mt-1.5 text-xs text-slate-400">Separate multiple entries with commas.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Emergency Contact
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div>
                <label htmlFor="emergencyContactName" className="text-sm font-medium text-slate-700">
                  Contact Name
                </label>
                <div className="relative mt-1.5">
                  <Users className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="emergencyContactName"
                    name="emergencyContactName"
                    type="text"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                    placeholder="Alex Miller"
                    className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm text-slate-700 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <FieldError message={fieldErrors.emergencyContactName} />
              </div>

              <div>
                <label htmlFor="emergencyContactRelation" className="text-sm font-medium text-slate-700">
                  Relation
                </label>
                <input
                  id="emergencyContactRelation"
                  name="emergencyContactRelation"
                  type="text"
                  value={formData.emergencyContactRelation}
                  onChange={handleChange}
                  placeholder="Spouse"
                  className="mt-1.5 w-full rounded-xl border border-slate-300 py-2.5 px-4 text-sm text-slate-700 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <FieldError message={fieldErrors.emergencyContactRelation} />
              </div>

              <div>
                <label htmlFor="emergencyContactPhone" className="text-sm font-medium text-slate-700">
                  Phone Number
                </label>
                <input
                  id="emergencyContactPhone"
                  name="emergencyContactPhone"
                  type="tel"
                  value={formData.emergencyContactPhone}
                  onChange={handleChange}
                  placeholder="+1 555 010 2938"
                  className="mt-1.5 w-full rounded-xl border border-slate-300 py-2.5 px-4 text-sm text-slate-700 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <FieldError message={fieldErrors.emergencyContactPhone} />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Additional Details
            </h2>
            <div className="mt-4 space-y-5">
              <label className="flex items-center gap-3 rounded-xl border border-slate-300 px-4 py-3">
                <input
                  type="checkbox"
                  name="organDonor"
                  checked={formData.organDonor}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                />
                <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <BadgeCheck className="h-4 w-4 text-blue-600" />
                  Registered Organ Donor
                </span>
              </label>

              <div>
                <label htmlFor="notes" className="text-sm font-medium text-slate-700">
                  Notes
                </label>
                <div className="relative mt-1.5">
                  <FileText className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any additional information responders should know."
                    className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm text-slate-700 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-600 hover:text-blue-600"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfilePage;
