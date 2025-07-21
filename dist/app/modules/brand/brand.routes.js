"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandRoutes = void 0;
const express_1 = require("express");
const multer_config_1 = require("../../config/multer.config");
const bodyParser_1 = require("../../middleware/bodyParser");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_interface_1 = require("../user/user.interface");
const brand_controller_1 = require("./brand.controller");
const router = (0, express_1.Router)();
router.get("/", brand_controller_1.BrandController.getAllBrand);
router.post('/', (0, auth_1.default)(user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.USER), multer_config_1.multerUpload.single('logo'), bodyParser_1.parseBody, brand_controller_1.BrandController.createBrand);
router.patch('/:id', (0, auth_1.default)(user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.USER), multer_config_1.multerUpload.single('logo'), bodyParser_1.parseBody, brand_controller_1.BrandController.updateBrand);
router.delete('/:id', (0, auth_1.default)(user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.USER), brand_controller_1.BrandController.deleteBrand);
exports.BrandRoutes = router;
