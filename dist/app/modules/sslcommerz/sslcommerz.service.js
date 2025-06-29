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
exports.sslService = void 0;
const express_1 = __importDefault(require("express"));
const sslcommerz_lts_1 = __importDefault(require("sslcommerz-lts"));
const config_1 = __importDefault(require("../../config"));
const appError_1 = __importDefault(require("../../errors/appError"));
const http_status_codes_1 = require("http-status-codes");
const payment_model_1 = require("../payment/payment.model");
const order_model_1 = require("../order/order.model");
const mongoose_1 = __importDefault(require("mongoose"));
const generateOrderInvoicePDF_1 = require("../../utils/generateOrderInvoicePDF");
const emailHelper_1 = require("../../utils/emailHelper");
const app = (0, express_1.default)();
const store_id = config_1.default.ssl.store_id;
const store_passwd = config_1.default.ssl.store_pass;
const is_live = false; // true for live, false for sandbox
// SSLCommerz init
const initPayment = (paymentData) => __awaiter(void 0, void 0, void 0, function* () {
    const { total_amount, tran_id } = paymentData;
    const data = {
        total_amount,
        currency: 'BDT',
        tran_id, // Use unique tran_id for each API call
        success_url: `${config_1.default.ssl.validation_url}?tran_id=${tran_id}`,
        fail_url: config_1.default.ssl.failed_url,
        cancel_url: config_1.default.ssl.cancel_url,
        ipn_url: 'http://next-mart-steel.vercel.app/api/v1/ssl/ipn',
        shipping_method: 'Courier',
        product_name: 'N/A.',
        product_category: 'N/A',
        product_profile: 'general',
        cus_name: 'N/A',
        cus_email: 'N/A',
        cus_add1: 'Dhaka',
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: '01711111111',
        cus_fax: '01711111111',
        ship_name: 'N/A',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };
    const sslcz = new sslcommerz_lts_1.default(store_id, store_passwd, is_live);
    try {
        const apiResponse = yield sslcz.init(data);
        // Redirect the user to the payment gateway
        const GatewayPageURL = apiResponse.GatewayPageURL;
        if (GatewayPageURL) {
            return GatewayPageURL;
        }
        else {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_GATEWAY, "Failed to generate payment gateway URL.");
        }
    }
    catch (error) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "An error occurred while processing payment.");
    }
});
const validatePaymentService = (tran_id) => __awaiter(void 0, void 0, void 0, function* () {
    const sslcz = new sslcommerz_lts_1.default(store_id, store_passwd, is_live);
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        //@ts-ignore
        const validationResponse = yield sslcz.transactionQueryByTransactionId({
            tran_id
        });
        console.log(validationResponse.element);
        let data;
        if (validationResponse.element[0].status === 'VALID' || validationResponse.element[0].status === 'VALIDATED') {
            data = {
                status: 'Paid',
                gatewayResponse: validationResponse.element[0]
            };
        }
        else if (validationResponse.element[0].status === 'INVALID_TRANSACTION') {
            data = {
                status: 'Failed',
                gatewayResponse: validationResponse.element[0]
            };
        }
        else {
            data = {
                status: 'Failed',
                gatewayResponse: validationResponse.element[0]
            };
        }
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: validationResponse.element[0].tran_id }, data, { new: true, session });
        if (!updatedPayment) {
            throw new Error("Payment not updated");
        }
        const updatedOrder = yield order_model_1.Order.findByIdAndUpdate(updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.order, {
            paymentStatus: data.status
        }, { new: true, session }).populate('user products.product');
        if (!updatedOrder) {
            throw new Error("Order not updated");
        }
        if (data.status === 'Failed') {
            throw new Error("Payment failed");
        }
        // Commit transaction only if no errors occurred
        yield session.commitTransaction();
        session.endSession();
        console.log("email");
        const pdfBuffer = yield (0, generateOrderInvoicePDF_1.generateOrderInvoicePDF)(updatedOrder);
        const emailContent = yield emailHelper_1.EmailHelper.createEmailContent(
        //@ts-ignore
        { userName: updatedOrder.user.name || "" }, 'orderInvoice');
        const attachment = {
            filename: `Invoice_${updatedOrder._id}.pdf`,
            content: pdfBuffer,
            encoding: 'base64',
        };
        yield emailHelper_1.EmailHelper.sendEmail(
        //@ts-ignore
        updatedOrder.user.email, emailContent, "Order confirmed-Payment Success!", attachment);
        return true;
    }
    catch (error) {
        // Only abort the transaction if an error occurred
        yield session.abortTransaction();
        session.endSession();
        console.error(error); // Log the error for debugging
        return false;
    }
});
exports.sslService = {
    initPayment,
    validatePaymentService
};
