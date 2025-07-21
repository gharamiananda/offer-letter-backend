"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productValidation = void 0;
const zod_1 = require("zod");
const createProductValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "Product name is required",
        }).min(1, "Product name cannot be empty"),
        description: zod_1.z.string({
            required_error: "Product description is required",
        }).min(1, "Product description cannot be empty"),
        price: zod_1.z.number({
            required_error: "Product price is required",
        }).min(0, "Product price cannot be less than 0"),
        stock: zod_1.z.number({
            required_error: "Product stock is required",
        }).min(0, "Product stock cannot be less than 0"),
        weight: zod_1.z.number().min(0, "Weight cannot be less than 0").nullable().optional(),
        offer: zod_1.z.number().min(0, "Offer cannot be less than 0").optional().default(0),
        category: zod_1.z.string({
            required_error: "Category ID is required",
        }).min(1, "Category ID cannot be empty")
    })
});
const updateProductValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Product name cannot be empty").optional(),
        description: zod_1.z.string().min(1, "Product description cannot be empty").optional(),
        price: zod_1.z.number().min(0, "Product price cannot be less than 0").optional(),
        stock: zod_1.z.number().min(0, "Product stock cannot be less than 0").optional(),
        weight: zod_1.z.number().min(0, "Weight cannot be less than 0").nullable().optional(),
        offer: zod_1.z.number().min(0, "Offer cannot be less than 0").optional(),
        category: zod_1.z.string().min(1, "Category ID cannot be empty").optional(),
    })
});
exports.productValidation = {
    createProductValidationSchema,
    updateProductValidationSchema
};
