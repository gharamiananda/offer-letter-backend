import { z } from "zod";

const createOrganizationValidation = z.object({
  body: z.object({
    organizationName: z.string().min(1, "Organization name is required."),
    businessLicenseNumber: z
      .string()
      .min(1, "Business license number is required."),
    address: z.string().min(1, "Address is required."),
    contactNumber: z.string().min(1, "Contact number is required."),
    website: z.string().url().nullable().optional(),
    servicesOffered: z.array(z.string()).default([]),
    ratings: z
      .number()
      .min(0, "Ratings cannot be less than 0.")
      .max(5, "Ratings cannot exceed 5.")
      .default(0),
    establishedYear: z
      .number()
      .min(1900, "Invalid year.")
      .max(new Date().getFullYear(), "Year cannot be in the future."),
    socialMediaLinks: z.record(z.string()).nullable().optional(),
    taxIdentificationNumber: z
      .string()
      .min(1, "Tax identification number is required."),
  }),
});

export const OrganizationValidation = {
  createOrganizationValidation,
};
