"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayslipLetterRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_interface_1 = require("../user/user.interface");
const payslip_controller_1 = require("./payslip.controller");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
router.post("/", (0, auth_1.default)(user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.USER), payslip_controller_1.payslipController.createOfferLetter);
const storage = multer_1.default.memoryStorage();
const multerUpload = (0, multer_1.default)({ storage });
router.post("/upload-payslip-csv", (0, auth_1.default)(user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.USER), multerUpload.single("multiplePayslipCsv"), payslip_controller_1.payslipController.createBulkOfferLetter);
router.get("/", (0, auth_1.default)(user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.USER), payslip_controller_1.payslipController.getOfferLetterAll);
router.get("/html/:id", (0, auth_1.default)(user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.USER), payslip_controller_1.payslipController.getOfferLetterById);
exports.PayslipLetterRoutes = router;
