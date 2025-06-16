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
      required: true,
    },
    employeeDesignation: {
      type: String,
      required: true,
    },
    employeeDateOfJoin: {
      type: String,
      required: true,
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
      required: true,
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
      required: true,
    },
    offerLetterDate: {
      type: String,
      required: true,
    },
    emailSubject: {
      type: String,
      required: true,
    },
    emailMessage: {
      type: String,
      required: true,
    },
    companyContactName: {
      type: String,
      required: true,
    },
    companyPersonTitle: {
      type: String,
      required: true,
    },
    companyContactNumber: {
      type: String,
      validate: {
        validator: function (v: string) {
          return /^\d{10,15}$/.test(v);
        },
        message: "Contact number must be between 10 to 15 digits.",
      },
      required: true,
    },
    companyPersonalEmail: {
      type: String,
      validate: {
        validator: function (v: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Invalid email format.",
      },
      required: true,
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
