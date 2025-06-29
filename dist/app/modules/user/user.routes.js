"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const clientInfoParser_1 = __importDefault(require("../../middleware/clientInfoParser"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const user_validation_1 = require("./user.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_interface_1 = require("./user.interface");
const multer_config_1 = require("../../config/multer.config");
const bodyParser_1 = require("../../middleware/bodyParser");
const router = (0, express_1.Router)();
router.get('/', (0, auth_1.default)(user_interface_1.UserRole.ADMIN), user_controller_1.UserController.getAllUser);
router.get('/me', (0, auth_1.default)(user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.USER), user_controller_1.UserController.myProfile);
router.post('/', clientInfoParser_1.default, (0, validateRequest_1.default)(user_validation_1.UserValidation.userValidationSchema), user_controller_1.UserController.registerUser);
// update profile
router.patch('/update-profile', (0, auth_1.default)(user_interface_1.UserRole.USER), multer_config_1.multerUpload.single('profilePhoto'), bodyParser_1.parseBody, (0, validateRequest_1.default)(user_validation_1.UserValidation.customerInfoValidationSchema), user_controller_1.UserController.updateProfile);
router.patch('/:id/status', (0, auth_1.default)(user_interface_1.UserRole.ADMIN), user_controller_1.UserController.updateUserStatus);
exports.UserRoutes = router;
