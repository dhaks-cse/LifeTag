import axios from "axios";
import type { EmergencySession } from "../types/emergencySession";

const API_URL = import.meta.env.VITE_API_URL;
const EMERGENCY_ENDPOINT = `${API_URL}/api/emergency`;

export const ADMIN_KEY_STORAGE_KEY = "lifetag_admin_key";

function adminHeaders(adminKey: string) {
  return { headers: { "x-admin-key": adminKey } };
}

export async function startEmergencySession(medicalId: string): Promise<void> {
  await axios.post(`${EMERGENCY_ENDPOINT}/start`, { medicalId });
}

export async function fetchActiveSessions(adminKey: string): Promise<EmergencySession[]> {
  const response = await axios.get(`${EMERGENCY_ENDPOINT}/active`, adminHeaders(adminKey));
  return response.data?.data ?? [];
}

export async function fetchEmergencyHistory(adminKey: string): Promise<EmergencySession[]> {
  const response = await axios.get(`${EMERGENCY_ENDPOINT}/history`, adminHeaders(adminKey));
  return response.data?.data ?? [];
}

export async function closeEmergencySession(id: string, adminKey: string): Promise<void> {
  await axios.patch(`${EMERGENCY_ENDPOINT}/close/${id}`, {}, adminHeaders(adminKey));
}
