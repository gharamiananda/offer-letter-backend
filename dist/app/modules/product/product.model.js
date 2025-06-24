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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = require("mongoose");
const flashSale_model_1 = require("../flashSell/flashSale.model");
const productSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        unique: true,
        trim: true,
    },
    slug: {
        type: String,
        required: [true, 'Product slug is required'],
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: 0,
    },
    stock: {
        type: Number,
        required: [true, 'Product stock is required'],
        min: 0,
    },
    weight: {
        type: Number,
        min: 0,
        default: null,
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required'],
    },
    imageUrls: {
        type: [String],
        required: [true, 'Product images are required'],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    shop: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Shop',
        required: [true, 'User who created the product is required'],
    },
    brand: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Brand',
        required: [true, 'Brand of product is required'],
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    ratingCount: {
        type: Number,
        default: 0,
        min: 0,
    },
    availableColors: {
        type: [String],
        required: [true, 'Available colors are required'],
    },
    specification: {
        type: mongoose_1.Schema.Types.Mixed,
        default: {},
    },
    keyFeatures: {
        type: [String],
        default: [],
    },
}, {
    timestamps: true,
    // toJSON: { virtuals: true },
    // toObject: { virtuals: true }
});
// Middleware to auto-generate the slug before saving
productSchema.pre('validate', function (next) {
    if (this.isModified('name') && !this.slug) {
        this.slug = this.name
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
    }
    next();
});
productSchema.methods.calculateOfferPrice = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const flashSale = yield flashSale_model_1.FlashSale.findOne({ product: this._id });
        if (flashSale) {
            const discount = (flashSale.discountPercentage / 100) * this.price;
            return this.price - discount;
        }
        return null; // or you can return 0 or another default value
    });
};
exports.Product = (0, mongoose_1.model)('Product', productSchema);
