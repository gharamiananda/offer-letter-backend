import mongoose, { Schema, Document, Model } from "mongoose";
import { IOrganization } from "./organization.interface";

const organizationSchema = new Schema<IOrganization>(
  {
    organizationName: {
      type: String,
      required: true,
    },
    businessLicenseNumber: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      default: null,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    servicesOffered: {
      type: [String],
      default: [],
    },
    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    establishedYear: {
      type: Number,
      required: true,
    },
    socialMediaLinks: {
      type: Map,
      of: String,
      default: null,
    },
    taxIdentificationNumber: {
      type: String,
      required: true,
      unique: true,
    },
    logo: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Organization: Model<IOrganization> = mongoose.model<IOrganization>(
  "Organization",
  organizationSchema
);
export default Organization;
