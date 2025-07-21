"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const product_model_1 = require("../product/product.model");
const coupon_model_1 = require("../coupon/coupon.model");
const appError_1 = __importDefault(require("../../errors/appError"));
const http_status_codes_1 = require("http-status-codes");
const orderSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    shop: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Shop",
        required: true,
    },
    products: [
        {
            product: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
            unitPrice: {
                type: Number,
                required: true,
            },
            color: {
                type: String,
                required: true,
            },
        },
    ],
    coupon: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Coupon",
        default: null,
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
    },
    deliveryCharge: {
        type: Number,
        default: 0,
    },
    finalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: ["Pending", "Processing", "Completed", "Cancelled"],
        default: "Pending",
    },
    shippingAddress: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ["COD", "Online"],
        default: "Online",
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending",
    },
}, {
    timestamps: true,
});
// Pre-save hook to calculate total, discount, delivery charge, and final price
orderSchema.pre("validate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const order = this;
        // Step 1: Initialize total amount
        let totalAmount = 0;
        let finalDiscount = 0;
        let shopId = null;
        // Step 2: Calculate total amount for products
        for (let item of order.products) {
            const product = yield product_model_1.Product.findById(item.product).populate("shop");
            if (!product) {
                return next(new Error(`Product not found!.`));
            }
            if (shopId && String(shopId) !== String(product.shop._id)) {
                return next(new Error("Products must be from the same shop."));
            }
            //@ts-ignore
            shopId = product.shop._id;
            const offerPrice = (yield (product === null || product === void 0 ? void 0 : product.calculateOfferPrice())) || 0;
            let productPrice = product.price;
            if (offerPrice)
                productPrice = Number(offerPrice);
            item.unitPrice = productPrice;
            const price = productPrice * item.quantity;
            console.log(price);
            totalAmount += price;
        }
        if (order.coupon) {
            const couponDetails = yield coupon_model_1.Coupon.findById(order.coupon);
            if (String(shopId) === (couponDetails === null || couponDetails === void 0 ? void 0 : couponDetails.shop.toString())) {
                throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "The coupon is not applicable for your selected products");
            }
            if (couponDetails && couponDetails.isActive) {
                if (totalAmount >= couponDetails.minOrderAmount) {
                    if (couponDetails.discountType === "Percentage") {
                        finalDiscount = Math.min((couponDetails.discountValue / 100) * totalAmount, couponDetails.maxDiscountAmount
                            ? couponDetails.maxDiscountAmount
                            : Infinity);
                    }
                    else if (couponDetails.discountType === "Flat") {
                        finalDiscount = Math.min(couponDetails.discountValue, totalAmount);
                    }
                }
            }
        }
        const isDhaka = (_b = (_a = order === null || order === void 0 ? void 0 : order.shippingAddress) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === null || _b === void 0 ? void 0 : _b.includes("dhaka");
        const deliveryCharge = isDhaka ? 60 : 120;
        order.totalAmount = totalAmount;
        order.discount = finalDiscount;
        order.deliveryCharge = deliveryCharge;
        order.finalAmount = totalAmount - finalDiscount + deliveryCharge;
        //@ts-ignore
        order.shop = shopId;
        next();
    });
});
exports.Order = (0, mongoose_1.model)("Order", orderSchema);
