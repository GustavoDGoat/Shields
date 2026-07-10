import { Id } from "../../../../convex/_generated/dataModel";

export type IncidentType = 'phishing' | 'malware' | 'identity_theft' | 'data_breach' | 'unauthorized_access' | 'other';
export type IncidentStatus = 'pending' | 'investigating' | 'resolved';
export type IncidentUrgency = 'low' | 'medium' | 'high';

export interface Incident {
  _id: Id<"incidents">;
  _creationTime: number;
  studentId: string;
  incidentType: IncidentType;
  description: string;
  status: IncidentStatus;
  urgencyLevel: IncidentUrgency;
  evidenceUrl?: string | null;
  adminNote?: string | null;
  updatedAt?: string;
  studentName?: string;
  studentEmail?: string;
}

export const incidentTypeLabels: Record<IncidentType, string> = {
  phishing: 'Phishing Attempt',
  malware: 'Malware/Virus',
  identity_theft: 'Identity Theft',
  data_breach: 'Data Breach',
  unauthorized_access: 'Unauthorized Access',
  other: 'Other',
};

export const statusLabels: Record<IncidentStatus, string> = {
  pending: 'Pending Review',
  investigating: 'Under Investigation',
  resolved: 'Resolved',
};

export const urgencyLabels: Record<IncidentUrgency, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};
