"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlashSaleRoutes = void 0;
const express_1 = require("express");
const flashSale_controller_1 = require("./flashSale.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_interface_1 = require("../user/user.interface");
const router = (0, express_1.Router)();
router.get('/', flashSale_controller_1.FlashSaleController.getActiveFlashSalesService);
router.post('/', (0, auth_1.default)(user_interface_1.UserRole.USER), flashSale_controller_1.FlashSaleController.createFlashSale);
exports.FlashSaleRoutes = router;
