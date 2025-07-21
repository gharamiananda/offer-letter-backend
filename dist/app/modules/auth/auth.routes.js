"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const clientInfoParser_1 = __importDefault(require("../../middleware/clientInfoParser"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_interface_1 = require("../user/user.interface");
const router = (0, express_1.Router)();
router.post('/login', clientInfoParser_1.default, auth_controller_1.AuthController.loginUser);
router.post('/refresh-token', 
// validateRequest(AuthValidation.refreshTokenZodSchema),
auth_controller_1.AuthController.refreshToken);
router.post('/change-password', (0, auth_1.default)(user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.USER), auth_controller_1.AuthController.changePassword);
router.post('/forgot-password', auth_controller_1.AuthController.forgotPassword);
router.post('/verify-otp', auth_controller_1.AuthController.verifyOTP);
router.post('/reset-password', auth_controller_1.AuthController.resetPassword);
exports.AuthRoutes = router;
