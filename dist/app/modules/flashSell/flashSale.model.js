"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlashSale = void 0;
const mongoose_1 = require("mongoose");
const flashSaleSchema = new mongoose_1.Schema({
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product ID is required"],
    },
    discountPercentage: {
        type: Number,
        required: [true, "Discount percentage is required"],
        min: 0,
        max: 100,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"]
    },
}, { timestamps: true });
exports.FlashSale = (0, mongoose_1.model)("FlashSale", flashSaleSchema);
