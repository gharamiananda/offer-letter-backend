import { Schema, model, Document } from "mongoose";
import { IOfferLetter, offerLetterStatus } from "./offer-letter.interface";

const offerLetterSchema = new Schema<IOfferLetter>(
  {
    employeeName: {
      type: String,
      required: true,
    },
    employeeEmail: {
      type: String,
      required: true,
    },
    employeeAddress: {
      type: String,
      default: "",
    },
    employeeDesignation: {
      type: String,
      default: "",
    },
    employeeDateOfJoin: {
      type: String,
      default: "",
    },
    employeeCtc: {
      type: String,
      required: true,
    },
    companyLogo: {
      type: String,
      default: "",
    },
    companyName: {
      type: String,
      default: "",
    },
    acknowledge: {
      type: Boolean,
      default: false,
    },
    dateOfAcknowledge: {
      type: Date,
      default: null,
    },
    status: {
      type: String,

      enum: offerLetterStatus,
      default: offerLetterStatus.DRAFT,
    },
    companyAddress: {
      type: String,
      default: "",
    },
    offerLetterDate: {
      type: String,
      default: "",
    },
    emailSubject: {
      type: String,
      default: "",
    },
    emailMessage: {
      type: String,
      required: true,
    },
    companyContactName: {
      type: String,
      default: "",
    },
    companyPersonTitle: {
      type: String,
      default: "",
    },
    companyContactNumber: {
      type: String,

      default: "0",
    },
    companyPersonalEmail: {
      type: String,
      default: "",
    },
    generateByUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const OfferLetter = model<IOfferLetter>("OfferLetter", offerLetterSchema);

export default OfferLetter;
