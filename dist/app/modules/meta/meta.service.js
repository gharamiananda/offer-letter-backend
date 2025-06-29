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
exports.MetaService = void 0;
const http_status_codes_1 = require("http-status-codes");
const appError_1 = __importDefault(require("../../errors/appError"));
const order_model_1 = require("../order/order.model");
const shop_model_1 = __importDefault(require("../shop/shop.model"));
const user_model_1 = __importDefault(require("../user/user.model"));
const product_model_1 = require("../product/product.model");
const payment_model_1 = require("../payment/payment.model");
const getMetaData = (query, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { startDate, endDate } = query;
    // For Admin-based meta data
    if (authUser.role === 'admin') {
        const totalShops = yield shop_model_1.default.countDocuments();
        const totalUsers = yield user_model_1.default.countDocuments();
        const totalOrders = yield order_model_1.Order.countDocuments();
        const totalProducts = yield product_model_1.Product.countDocuments();
        const totalRevenue = yield order_model_1.Order.aggregate([
            { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
        ]);
        const totalPayments = yield payment_model_1.Payment.countDocuments();
        const paymentStatusCounts = yield payment_model_1.Payment.aggregate([
            { $group: { _id: '$status', totalPayments: { $sum: 1 } } },
            { $project: { status: '$_id', totalPayments: 1, _id: 0 } },
        ]);
        // More statistics you can add for admin
        const activeShops = yield shop_model_1.default.countDocuments({ isActive: true });
        const inactiveShops = yield shop_model_1.default.countDocuments({ isActive: false });
        return {
            totalShops,
            totalUsers,
            totalOrders,
            totalProducts,
            totalRevenue: ((_a = totalRevenue[0]) === null || _a === void 0 ? void 0 : _a.totalRevenue) || 0,
            totalPayments,
            paymentStatusCounts,
            activeShops,
            inactiveShops
        };
    }
    // For User-based data (when the user has a shop)
    if (authUser.role === 'user') {
        const userShop = yield shop_model_1.default.findOne({ user: authUser.userId });
        if (!userShop) {
            throw new Error('User does not have a valid shop.');
        }
        // Pie chart data
        const pieChartData = yield order_model_1.Order.aggregate([
            { $match: { shop: userShop._id } },
            { $group: { _id: '$products.category', total: { $sum: '$totalAmount' } } },
            { $project: { category: '$_id', totalAmount: 1, _id: 0 } },
        ]);
        // Bar chart data (total orders per month)
        const barChartData = yield order_model_1.Order.aggregate([
            { $match: { shop: userShop._id } },
            { $group: { _id: { $month: '$createdAt' }, totalOrders: { $sum: 1 } } },
            { $sort: { '_id': 1 } },
            { $project: { month: '$_id', totalOrders: 1, _id: 0 } },
        ]);
        // Line chart data (sales over time)
        const lineChartData = yield order_model_1.Order.aggregate([
            { $match: { shop: userShop._id } },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, totalSales: { $sum: '$totalAmount' } } },
            { $sort: { '_id': 1 } },
            { $project: { date: '$_id', totalSales: 1, _id: 0 } },
        ]);
        // Payment data (filter by start and end date)
        const paymentData = yield payment_model_1.Payment.aggregate([
            { $match: { shop: userShop._id } },
            ...(startDate && endDate
                ? [
                    {
                        $match: {
                            createdAt: {
                                $gte: new Date(startDate),
                                $lte: new Date(endDate),
                            },
                        },
                    },
                ]
                : []),
            { $group: { _id: '$status', totalPayments: { $sum: 1 } } },
            { $project: { status: '$_id', totalPayments: 1, _id: 0 } },
        ]);
        // Order data (based on shop)
        const orderData = yield order_model_1.Order.aggregate([
            { $match: { shop: userShop._id } },
            { $group: { _id: '$status', totalOrders: { $sum: 1 } } },
            { $project: { status: '$_id', totalOrders: 1, _id: 0 } },
        ]);
        // More statistics for user
        const totalOrdersForUser = yield order_model_1.Order.countDocuments({ shop: userShop._id });
        const totalRevenueForUser = yield order_model_1.Order.aggregate([
            { $match: { shop: userShop._id } },
            { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
        ]);
        // Today's Sales - Filter orders placed today
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        const todaysSales = yield order_model_1.Order.aggregate([
            { $match: { shop: userShop._id, createdAt: { $gte: startOfDay, $lte: endOfDay } } },
            { $group: { _id: null, totalSales: { $sum: '$totalAmount' } } },
        ]);
        const todaysSalesAmount = ((_b = todaysSales[0]) === null || _b === void 0 ? void 0 : _b.totalSales) || 0;
        return {
            pieChartData,
            barChartData,
            lineChartData,
            paymentData,
            orderData,
            totalOrdersForUser,
            totalRevenueForUser: ((_c = totalRevenueForUser[0]) === null || _c === void 0 ? void 0 : _c.totalRevenue) || 0,
            todaysSalesAmount,
        };
    }
    throw new Error('User does not have the required permissions or shop.');
});
exports.default = getMetaData;
const getOrdersByDate = (startDate, endDate, groupBy) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({ startDate });
    if (startDate && !endDate) {
        const orders = yield order_model_1.Order.aggregate([
            {
                $group: {
                    _id: {
                        date: {
                            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                        },
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $match: {
                    '_id.date': startDate,
                },
            },
        ]);
        if (orders.length === 0) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'No orders found for the given date');
        }
        return orders;
    }
    if (startDate && endDate) {
        const orders = yield order_model_1.Order.aggregate([
            {
                $group: {
                    _id: {
                        date: {
                            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                        },
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $match: {
                    '_id.date': {
                        $gte: startDate,
                        $lte: endDate,
                    },
                },
            },
        ]);
        if (orders.length === 0) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'No orders found for the given date range');
        }
        return orders;
    }
    if (startDate && endDate && groupBy === 'week') {
    }
});
exports.MetaService = {
    getMetaData,
    getOrdersByDate,
};
