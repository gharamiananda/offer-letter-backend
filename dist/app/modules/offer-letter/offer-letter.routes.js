"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferLetterRoutes = void 0;
const express_1 = require("express");
const offer_letter_controller_1 = require("./offer-letter.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_interface_1 = require("../user/user.interface");
const router = (0, express_1.Router)();
// Define routes
// router.get("/", offerLetterController.getAll);
router.post("/", (0, auth_1.default)(user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.USER), 
// validateRequest(categoryValidation.createCategoryValidationSchema),
offer_letter_controller_1.offerLetterController.createOfferLetter);
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const multerUpload = (0, multer_1.default)({ storage });
router.post("/upload-offer-letter-csv", (0, auth_1.default)(user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.USER), multerUpload.single("multipleOfferLetterCsv"), 
// validateRequest(categoryValidation.createCategoryValidationSchema),
offer_letter_controller_1.offerLetterController.createBulkOfferLetter);
router.get("/", (0, auth_1.default)(user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.USER), offer_letter_controller_1.offerLetterController.getOfferLetterAll);
router.get("/html/:id", (0, auth_1.default)(user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.USER), offer_letter_controller_1.offerLetterController.getOfferLetterById);
router.get("/offer-acknowledge/:id", offer_letter_controller_1.offerLetterController.acknowledgeById);
exports.OfferLetterRoutes = router;
