import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
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
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Stepper from "../components/ui/Stepper";
import { buttonClassName } from "../components/ui/Button";
import { useToast } from "../components/ui/Toast";

interface CreateProfileFormData {
  fullName: string;
  bloodGroup: string;
  dateOfBirth: string;
  gender: string;
  allergies: string;
  chronicConditions: string;
  currentMedications: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
  organDonor: boolean;
  notes: string;
}

type FormErrors = Partial<Record<keyof CreateProfileFormData, string>>;

const PATIENTS_ENDPOINT = "http://localhost:5001/api/patients";
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const GENDERS = ["Male", "Female", "Other"];
const STEP_LABELS = ["Personal", "Medical", "Contacts", "Additional", "Review"];

const STEP_FIELDS: Record<number, (keyof CreateProfileFormData)[]> = {
  1: ["fullName", "dateOfBirth", "gender"],
  2: ["bloodGroup", "allergies", "chronicConditions", "currentMedications"],
  3: ["emergencyContactName", "emergencyContactRelation", "emergencyContactPhone"],
  4: ["organDonor", "notes"],
};

const initialFormState: CreateProfileFormData = {
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

function splitToList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function validateForm(formData: CreateProfileFormData): FormErrors {
  const errors: FormErrors = {};

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

interface FieldErrorProps {
  message?: string;
}

function FieldError({ message }: FieldErrorProps) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs font-medium text-rose-600">{message}</p>;
}

interface FieldProps {
  formData: CreateProfileFormData;
  fieldErrors: FormErrors;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

function StepPersonal({ formData, fieldErrors, onChange }: FieldProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
            onChange={onChange}
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
            onChange={onChange}
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
          onChange={onChange}
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
    </div>
  );
}

function StepMedical({ formData, fieldErrors, onChange }: FieldProps) {
  return (
    <div className="space-y-5">
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
            placeholder="Insulin, Albuterol"
            className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm text-slate-700 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>
        <p className="mt-1.5 text-xs text-slate-400">Separate multiple entries with commas.</p>
      </div>
    </div>
  );
}

function StepContact({ formData, fieldErrors, onChange }: FieldProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
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
            onChange={onChange}
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
          onChange={onChange}
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
          onChange={onChange}
          placeholder="+1 555 010 2938"
          className="mt-1.5 w-full rounded-xl border border-slate-300 py-2.5 px-4 text-sm text-slate-700 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
        />
        <FieldError message={fieldErrors.emergencyContactPhone} />
      </div>
    </div>
  );
}

function StepAdditional({ formData, onChange }: FieldProps) {
  return (
    <div className="space-y-5">
      <label className="flex items-center gap-3 rounded-xl border border-slate-300 px-4 py-3">
        <input
          type="checkbox"
          name="organDonor"
          checked={formData.organDonor}
          onChange={onChange}
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
            onChange={onChange}
            placeholder="Any additional information responders should know."
            className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm text-slate-700 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-2.5 last:border-b-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-800">{value}</span>
    </div>
  );
}

function StepReview({ formData }: { formData: CreateProfileFormData }) {
  return (
    <div className="space-y-4">
      <Card className="p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Personal</h3>
        <div className="mt-2">
          <SummaryRow label="Full Name" value={formData.fullName || "—"} />
          <SummaryRow label="Date of Birth" value={formData.dateOfBirth || "—"} />
          <SummaryRow label="Gender" value={formData.gender || "—"} />
        </div>
      </Card>
      <Card className="p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Medical</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge tone="rose" icon={<Droplet className="h-3.5 w-3.5" />}>
            {formData.bloodGroup || "Unknown"}
          </Badge>
        </div>
        <div className="mt-3">
          <SummaryRow label="Allergies" value={formData.allergies || "None reported"} />
          <SummaryRow label="Chronic Conditions" value={formData.chronicConditions || "None reported"} />
          <SummaryRow label="Current Medications" value={formData.currentMedications || "None reported"} />
        </div>
      </Card>
      <Card className="p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Emergency Contact</h3>
        <div className="mt-2">
          <SummaryRow label="Name" value={formData.emergencyContactName || "Not provided"} />
          <SummaryRow label="Relation" value={formData.emergencyContactRelation || "Not provided"} />
          <SummaryRow label="Phone" value={formData.emergencyContactPhone || "Not provided"} />
        </div>
      </Card>
      <Card className="p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Additional</h3>
        <div className="mt-2">
          <SummaryRow label="Organ Donor" value={formData.organDonor ? "Yes" : "No"} />
          <SummaryRow label="Notes" value={formData.notes || "None"} />
        </div>
      </Card>
    </div>
  );
}

function CreateProfilePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CreateProfileFormData>(initialFormState);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = event.target;
    const checked = (event.target as HTMLInputElement).checked;
    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const goNext = () => {
    const allErrors = validateForm(formData);
    const relevantFields = STEP_FIELDS[currentStep] ?? [];
    const stepErrors: FormErrors = {};
    relevantFields.forEach((field) => {
      if (allErrors[field]) stepErrors[field] = allErrors[field];
    });

    setFieldErrors((previous) => ({ ...previous, ...stepErrors }));

    if (Object.keys(stepErrors).length > 0) {
      return;
    }

    setCurrentStep((step) => Math.min(step + 1, STEP_LABELS.length));
  };

  const goBack = () => {
    setCurrentStep((step) => Math.max(step - 1, 1));
  };

  const handleSubmit = async () => {
    setSubmitError("");

    const errors = validateForm(formData);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      showToast("error", "Please review the highlighted fields before submitting.");
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
      await axios.post(PATIENTS_ENDPOINT, payload);
      setIsSuccess(true);
      showToast("success", "Patient profile created successfully.");
      setTimeout(() => navigate("/dashboard"), 1400);
    } catch (error) {
      const message =
        axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message
          ? error.response.data.message
          : "We couldn't create this profile. Please try again.";
      setSubmitError(message);
      showToast("error", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepProps: FieldProps = { formData, fieldErrors, onChange: handleChange };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="mx-auto max-w-3xl px-6 py-10 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
            <HeartPulse className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Create Patient Profile
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Enter accurate medical details so responders can act quickly in an emergency.
            </p>
          </div>
        </div>

        <Card className="mt-8 p-5">
          <Stepper steps={STEP_LABELS} currentStep={currentStep} />
        </Card>

        {submitError && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-rose-600" />
            <p className="text-sm font-medium text-rose-700">{submitError}</p>
          </div>
        )}

        <Card className="mt-6 p-6 sm:p-8">
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center gap-3 py-12 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <p className="text-lg font-semibold text-slate-900">Profile created successfully</p>
              <p className="text-sm text-slate-500">Redirecting to your dashboard...</p>
            </motion.div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-slate-500">
                    {STEP_LABELS[currentStep - 1]} Information
                  </h2>
                  {currentStep === 1 && <StepPersonal {...stepProps} />}
                  {currentStep === 2 && <StepMedical {...stepProps} />}
                  {currentStep === 3 && <StepContact {...stepProps} />}
                  {currentStep === 4 && <StepAdditional {...stepProps} />}
                  {currentStep === 5 && <StepReview formData={formData} />}
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
                {currentStep > 1 ? (
                  <button type="button" onClick={goBack} className={buttonClassName("secondary", "md")}>
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                ) : (
                  <Link to="/dashboard" className={buttonClassName("secondary", "md")}>
                    Cancel
                  </Link>
                )}

                {currentStep < STEP_LABELS.length ? (
                  <button type="button" onClick={goNext} className={buttonClassName("primary", "md")}>
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={buttonClassName("primary", "md")}
                  >
                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isSubmitting ? "Creating Profile..." : "Create Profile"}
                  </button>
                )}
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

export default CreateProfilePage;
