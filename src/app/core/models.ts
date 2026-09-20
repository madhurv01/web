export type UserRole = 'citizen' | 'government';

export interface Profile {
  id: string;
  name: string;
  role: UserRole;
  created_at?: string;
}

export type ComplaintStatus = 'Active' | 'In Progress' | 'Resolved' | 'Rejected';

export const ISSUE_OPTIONS = [
  'No Water Supply',
  'Contaminated Water',
  'Low Pressure',
  'Pipe Leakage',
  'Billing Issue',
] as const;

export type IssueType = (typeof ISSUE_OPTIONS)[number];

export interface Complaint {
  id?: string;
  user_id?: string | null;
  name: string;
  address: string;
  phone: string;
  issue: string;
  details: string;
  complaint_date: string;
  code?: string;
  status?: ComplaintStatus;
  created_at?: string;
}

export interface PublicStats {
  total_complaints: number;
  active_count: number;
  resolved_count: number;
  no_water_supply_count: number;
}
