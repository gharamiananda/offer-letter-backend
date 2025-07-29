import { Document, Types } from "mongoose";

export interface ISentMailStatus extends Document {
  processId: string;
  total: number;
  sent: number;
  failed: number;
  pending: number;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  completedEmails: string[];
  failedEmails: string[];
  mailType: "OFFERLETTER" | "PAYSLIP" | "EXPERIENCE";
}
