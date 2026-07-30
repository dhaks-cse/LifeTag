export interface EmergencyContact {
  name?: string;
  relation?: string;
  phone?: string;
}

export interface Patient {
  medicalId?: string;
  fullName?: string;
  bloodGroup?: string;
  dateOfBirth?: string;
  gender?: string;
  allergies?: string[];
  chronicConditions?: string[];
  currentMedications?: string[];
  emergencyContacts?: EmergencyContact[];
  organDonor?: boolean;
  notes?: string;
  updatedAt?: string;
}
