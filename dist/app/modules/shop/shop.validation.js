"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopValidation = void 0;
const zod_1 = require("zod");
const createShopValidation = zod_1.z.object({
    body: zod_1.z.object({
        shopName: zod_1.z.string().min(1, "Shop name is required."),
        businessLicenseNumber: zod_1.z.string().min(1, "Business license number is required."),
        address: zod_1.z.string().min(1, "Address is required."),
        contactNumber: zod_1.z.string().min(1, "Contact number is required."),
        website: zod_1.z.string().url().nullable().optional(),
        servicesOffered: zod_1.z.array(zod_1.z.string()).min(1, "At least one service must be offered."),
        ratings: zod_1.z
            .number()
            .min(0, "Ratings cannot be less than 0.")
            .max(5, "Ratings cannot exceed 5.")
            .default(0),
        establishedYear: zod_1.z.number().min(1900, "Invalid year.").max(new Date().getFullYear(), "Year cannot be in the future."),
        socialMediaLinks: zod_1.z.record(zod_1.z.string()).nullable().optional(),
        taxIdentificationNumber: zod_1.z.string().min(1, "Tax identification number is required.")
    })
});
exports.ShopValidation = {
    createShopValidation
};
