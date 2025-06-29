export enum CandidateExamStatus {
  PENDING = "pending",
  UNDER_REVIEW = "under_review",
  SELECTED = "selected",
  REJECTED = "rejected",
  WITHDRAWN = "withdrawn",
}

export interface ICandidateExamModel extends Document {
  id: string;
  candidateName: string;
  contactNumber: string;
  emergencyContactNumber: string;
  candidateEmail: string;
  cv: string;
  status: CandidateExamStatus;
  examBy?: string;
  referredBy?: string;
}
