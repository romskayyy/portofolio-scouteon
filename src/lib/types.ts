export type UserRole = "seafarer" | "employer" | "admin";

export type ApplicationStage =
  | "applied"
  | "shortlisted"
  | "interview"
  | "offer"
  | "accepted"
  | "rejected";

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface SeafarerProfile {
  id: string;
  date_of_birth: string | null;
  nationality: string | null;
  address: string | null;
  rank: string | null;
  desired_rank: string | null;
  desired_vessel_type: string | null;
  desired_salary: number | null;
  available_from: string | null;
  years_of_experience: number | null;
  bio: string | null;
  cv_url: string | null;
}

export interface SeaServiceHistory {
  id: string;
  seafarer_id: string;
  vessel_name: string;
  vessel_type: string;
  rank: string;
  company_name: string;
  sign_on_date: string;
  sign_off_date: string | null;
  description: string | null;
}

export interface DocumentRecord {
  id: string;
  seafarer_id: string;
  document_type: string;
  document_name: string;
  file_url: string;
  issue_date: string | null;
  expiry_date: string | null;
  status: "valid" | "expiring_soon" | "expired";
}

export interface Company {
  id: string;
  owner_id: string;
  company_name: string;
  company_type: string | null;
  address: string | null;
  website: string | null;
  logo_url: string | null;
  description: string | null;
  verification_status: "pending" | "verified" | "rejected";
}

export interface Job {
  id: string;
  company_id: string;
  title: string;
  rank_required: string | null;
  vessel_type: string | null;
  vessel_name: string | null;
  contract_duration: string | null;
  salary_range: string | null;
  embarkation_date: string | null;
  location: string | null;
  description: string | null;
  requirements: string | null;
  status: "open" | "closed" | "filled";
  created_at: string;
  companies?: Company;
}

export interface Application {
  id: string;
  job_id: string;
  seafarer_id: string;
  stage: ApplicationStage;
  cover_note: string | null;
  applied_at: string;
  jobs?: Job;
  seafarer_profiles?: SeafarerProfile & { profiles?: Profile };
}

export const STAGE_LABELS: Record<ApplicationStage, string> = {
  applied: "Melamar",
  shortlisted: "Shortlist",
  interview: "Interview",
  offer: "Penawaran",
  accepted: "Diterima",
  rejected: "Ditolak",
};
