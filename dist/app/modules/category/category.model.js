"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const mongoose_1 = require("mongoose");
// Define the schema
const categorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Category name is required"],
        unique: true,
        trim: true,
    },
    slug: {
        type: String,
        required: [true, "Category slug is required"],
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    parent: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Category",
        default: null,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    icon: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});
categorySchema.pre("validate", function (next) {
    if (this instanceof mongoose_1.Document) {
        if (this.isModified("name") && !this.slug) {
            this.slug = this.name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
        }
    }
    next();
});
exports.Category = (0, mongoose_1.model)("Category", categorySchema);
