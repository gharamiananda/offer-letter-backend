"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_interface_1 = require("../user/user.interface");
const bodyParser_1 = require("../../middleware/bodyParser");
const multer_config_1 = require("../../config/multer.config");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const organization_controller_1 = require("./organization.controller");
const organization_validation_1 = require("./organization.validation");
const router = (0, express_1.Router)();
router.get("/my-organization", (0, auth_1.default)(user_interface_1.UserRole.USER), organization_controller_1.OrganizationController.getMyOrganization);
router.post("/", (0, auth_1.default)(user_interface_1.UserRole.SUPERADMIN), multer_config_1.multerUpload.single("logo"), bodyParser_1.parseBody, (0, validateRequest_1.default)(organization_validation_1.OrganizationValidation.createOrganizationValidation), organization_controller_1.OrganizationController.createOrganization);
exports.OrganizationRoutes = router;
