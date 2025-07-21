"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const express_1 = require("express");
const review_controller_1 = require("./review.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_interface_1 = require("../user/user.interface");
const router = (0, express_1.Router)();
router.get('/', (0, auth_1.default)(user_interface_1.UserRole.ADMIN), review_controller_1.ReviewControllers.getAllReviews);
router.post('/', (0, auth_1.default)(user_interface_1.UserRole.USER), review_controller_1.ReviewControllers.createReview);
exports.ReviewRoutes = router;
