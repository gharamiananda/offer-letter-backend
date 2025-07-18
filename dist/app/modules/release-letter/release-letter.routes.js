"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReleaseLetterRoutes = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_interface_1 = require("../user/user.interface");
const release_letter_controller_1 = require("./release-letter.controller");
const router = (0, express_1.Router)();
const storage = multer_1.default.memoryStorage();
const multerUpload = (0, multer_1.default)({ storage });
router.post("/upload-release-letter-csv", (0, auth_1.default)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.USER), multerUpload.single("multipleReleaseLetterCsv"), release_letter_controller_1.releaseLetterController.createBulkOfferLetter);
router.post("/send-release-letter-csv", (0, auth_1.default)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.USER), release_letter_controller_1.releaseLetterController.createBulkReleaseLetterWithData);
router.get("/", (0, auth_1.default)(user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.USER), release_letter_controller_1.releaseLetterController.getOfferLetterAll);
exports.ReleaseLetterRoutes = router;
