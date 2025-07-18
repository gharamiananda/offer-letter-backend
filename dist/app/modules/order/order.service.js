"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.OrderService = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const coupon_model_1 = require("../coupon/coupon.model");
const order_model_1 = require("./order.model");
const product_model_1 = require("../product/product.model");
const payment_model_1 = require("../payment/payment.model");
const payment_utils_1 = require("../payment/payment.utils");
const sslcommerz_service_1 = require("../sslcommerz/sslcommerz.service");
const user_model_1 = __importDefault(require("../user/user.model"));
const appError_1 = __importDefault(require("../../errors/appError"));
const http_status_codes_1 = require("http-status-codes");
const shop_model_1 = __importDefault(require("../shop/shop.model"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const createOrder = (orderData, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        if (orderData.products) {
            for (const productItem of orderData.products) {
                const product = yield product_model_1.Product.findById(productItem.product)
                    .populate("shop")
                    .session(session);
                if (product) {
                    if (product.isActive === false) {
                        throw new Error(`Product ${product === null || product === void 0 ? void 0 : product.name} is inactive.`);
                    }
                    if (product.stock < productItem.quantity) {
                        throw new Error(`Insufficient stock for product: ${product.name}`);
                    }
                    // Decrement the product stock
                    product.stock -= productItem.quantity;
                    yield product.save({ session });
                }
                else {
                    throw new Error(`Product not found: ${productItem.product}`);
                }
            }
        }
        // Handle coupon and update orderData
        if (orderData.coupon) {
            const coupon = yield coupon_model_1.Coupon.findOne({ code: orderData.coupon }).session(session);
            if (coupon) {
                const currentDate = new Date();
                // Check if the coupon is within the valid date range
                if (currentDate < coupon.startDate) {
                    throw new Error(`Coupon ${coupon.code} has not started yet.`);
                }
                if (currentDate > coupon.endDate) {
                    throw new Error(`Coupon ${coupon.code} has expired.`);
                }
                orderData.coupon = coupon._id;
            }
            else {
                throw new Error("Invalid coupon code.");
            }
        }
        // Create the order
        const order = new order_model_1.Order(Object.assign(Object.assign({}, orderData), { user: authUser.userId }));
        const createdOrder = yield order.save({ session });
        yield createdOrder.populate("user products.product");
        const transactionId = (0, payment_utils_1.generateTransactionId)();
        const payment = new payment_model_1.Payment({
            user: authUser.userId,
            shop: createdOrder.shop,
            order: createdOrder._id,
            method: orderData.paymentMethod,
            transactionId,
            amount: createdOrder.finalAmount,
        });
        yield payment.save({ session });
        let result;
        if (createdOrder.paymentMethod == "Online") {
            result = yield sslcommerz_service_1.sslService.initPayment({
                total_amount: createdOrder.finalAmount,
                tran_id: transactionId,
            });
            result = { paymentUrl: result };
        }
        else {
            result = order;
        }
        // Commit the transaction
        yield session.commitTransaction();
        session.endSession();
        // const pdfBuffer = await generateOrderInvoicePDF(createdOrder);
        // const emailContent = await EmailHelper.createEmailContent(
        //   //@ts-ignore
        //   { userName: createdOrder.user.name || "" },
        //   "orderInvoice"
        // );
        // const attachment = {
        //   filename: `Invoice_${createdOrder._id}.pdf`,
        //   content: pdfBuffer,
        //   encoding: "base64", // if necessary
        // };
        // await EmailHelper.sendEmail(
        //   //@ts-ignore
        //   createdOrder.user.email,
        //   emailContent,
        //   "Order confirmed!",
        //   attachment
        // );
        return result;
    }
    catch (error) {
        console.log(error);
        // Rollback the transaction in case of error
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const getMyShopOrders = (query, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const userHasShop = yield user_model_1.default.findById(authUser.userId).select("isActive hasShop");
    if (!userHasShop)
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found!");
    if (!userHasShop.isActive)
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User account is not active!");
    // if (!userHasShop.hasShop)
    //   throw new AppError(StatusCodes.BAD_REQUEST, "User does not have any shop!");
    const shopIsActive = yield shop_model_1.default.findOne({
        user: userHasShop._id,
        isActive: true,
    }).select("isActive");
    if (!shopIsActive)
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Shop is not active!");
    const orderQuery = new QueryBuilder_1.default(order_model_1.Order.find({ shop: shopIsActive._id }).populate("user products.product coupon"), query)
        .search(["user.name", "user.email", "products.product.name"])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield orderQuery.modelQuery;
    const meta = yield orderQuery.countTotal();
    return {
        meta,
        result,
    };
});
const getOrderDetails = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.Order.findById(orderId).populate("user products.product coupon");
    if (!order) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Order not Found");
    }
    order.payment = yield payment_model_1.Payment.findOne({ order: order._id });
    return order;
});
const getMyOrders = (query, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const orderQuery = new QueryBuilder_1.default(order_model_1.Order.find({ user: authUser.userId }).populate("user products.product coupon"), query)
        .search(["user.name", "user.email", "products.product.name"])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield orderQuery.modelQuery;
    const meta = yield orderQuery.countTotal();
    return {
        meta,
        result,
    };
});
const changeOrderStatus = (orderId, status, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const userHasShop = yield user_model_1.default.findById(authUser.userId).select("isActive hasShop");
    if (!userHasShop)
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found!");
    if (!userHasShop.isActive)
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User account is not active!");
    // if (!userHasShop.hasShop)
    //   throw new AppError(StatusCodes.BAD_REQUEST, "User does not have any shop!");
    const shopIsActive = yield shop_model_1.default.findOne({
        user: userHasShop._id,
        isActive: true,
    }).select("isActive");
    if (!shopIsActive)
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Shop is not active!");
    const order = yield order_model_1.Order.findOneAndUpdate({ _id: new mongoose_1.Types.ObjectId(orderId), shop: shopIsActive._id }, { status }, { new: true });
    return order;
});
exports.OrderService = {
    createOrder,
    getMyShopOrders,
    getOrderDetails,
    getMyOrders,
    changeOrderStatus,
};
