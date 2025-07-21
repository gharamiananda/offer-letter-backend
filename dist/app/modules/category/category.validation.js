"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryValidation = void 0;
const zod_1 = require("zod");
const createCategoryValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .nonempty("Category name is required")
            .max(100, "Category name should not exceed 100 characters"),
        description: zod_1.z.string().optional(),
        parent: zod_1.z.string().optional().nullable()
    })
});
const updateCategoryValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .max(100, "Category name should not exceed 100 characters")
            .optional(),
        description: zod_1.z.string().optional(),
        parent: zod_1.z.string().optional().nullable(),
        isActive: zod_1.z.boolean().optional()
    })
});
exports.categoryValidation = {
    createCategoryValidationSchema,
    updateCategoryValidationSchema
};
