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
exports.ReviewServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const review_model_1 = require("./review.model");
const appError_1 = __importDefault(require("../../errors/appError"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const mongoose_1 = __importDefault(require("mongoose"));
const product_model_1 = require("../product/product.model");
//@ need to fix
const createReview = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const existingReview = yield review_model_1.Review.findOne({
            user: user.userId,
            product: payload.product,
        }, null, { session });
        if (existingReview) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'You have already reviewed this product.');
        }
        const review = yield review_model_1.Review.create([Object.assign(Object.assign({}, payload), { user: user.userId })], {
            session,
        });
        // Aggregate reviews for the product
        const reviews = yield review_model_1.Review.aggregate([
            {
                $match: {
                    product: review[0].product,
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' },
                    ratingCount: { $sum: 1 },
                },
            },
        ]);
        const { averageRating = 0, ratingCount = 0 } = reviews[0] || {};
        const updatedProduct = yield product_model_1.Product.findByIdAndUpdate(payload.product, { averageRating, ratingCount }, { session, new: true });
        if (!updatedProduct) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Product not found during rating update.');
        }
        yield session.commitTransaction();
        return review;
    }
    catch (err) {
        yield session.abortTransaction();
        throw err;
    }
    finally {
        session.endSession();
    }
});
const getAllReviews = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const brandQuery = new QueryBuilder_1.default(review_model_1.Review.find().populate('product user'), query)
        .search(['review'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield brandQuery.modelQuery;
    const meta = yield brandQuery.countTotal();
    return {
        meta,
        result,
    };
});
exports.ReviewServices = {
    createReview,
    getAllReviews,
};
