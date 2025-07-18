import { Schema } from "mongoose";

export interface IOrganization extends Document {
  organizationName: string;
  businessLicenseNumber: string;
  address: string;
  contactNumber: string;
  website?: string;
  user?: Schema.Types.ObjectId;
  servicesOffered?: string[];
  ratings?: number;
  establishedYear: number;
  socialMediaLinks?: Map<string, string>;
  taxIdentificationNumber: string;
  logo?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
