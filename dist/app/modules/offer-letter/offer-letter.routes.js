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
router.get("/process-status/:processId", (0, auth_1.default)(user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.USER), offer_letter_controller_1.offerLetterController.getProcessStatus);
router.post("/offer-acknowledge/:employeeEmail", offer_letter_controller_1.offerLetterController.acknowledgeById);
router.post("/upload-letter-csv-socket", (0, auth_1.default)(user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.USER), offer_letter_controller_1.offerLetterController.createBulkOfferLetterWithSocket);
// New socket-enabled bulk endpoint
// router.post('/bulk-socket', authMiddleware, async (req, res) => {
//   try {
//     const { offerLetters } = req.body;
//     const authUser = req.user;
//     if (!offerLetters || !Array.isArray(offerLetters) || offerLetters.length === 0) {
//       return res.status(StatusCodes.BAD_REQUEST).json({
//         success: false,
//         message: 'Invalid offer letters data'
//       });
//     }
//     const result = await offerLetterService.createBulkOfferLettersWithSocket(offerLetters, authUser);
//     res.status(StatusCodes.OK).json({
//       success: true,
//       message: 'Bulk offer letter process started',
//       processId: result.processId,
//       totalEmails: offerLetters.length
//     });
//   } catch (error) {
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: 'Failed to start bulk offer letter process'
//     });
//   }
// });
// // Process status endpoints
// router.get('/process-status/:processId', authMiddleware, (req, res) => {
//   try {
//     const { processId } = req.params;
//     const status = offerLetterService.getProcessStatus(processId);
//     if (!status) {
//       return res.status(StatusCodes.NOT_FOUND).json({
//         success: false,
//         message: 'Process not found or expired'
//       });
//     }
//     res.status(StatusCodes.OK).json({
//       success: true,
//       status
//     });
//   } catch (error) {
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: 'Failed to get process status'
//     });
//   }
// });
// router.get('/active-processes', authMiddleware, (req, res) => {
//   try {
//     const processes = offerLetterService.getAllActiveProcesses();
//     res.status(StatusCodes.OK).json({
//       success: true,
//       processes,
//       count: processes.length
//     });
//   } catch (error) {
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: 'Failed to get active processes'
//     });
//   }
// });
// router.delete('/process/:processId', authMiddleware, (req, res) => {
//   try {
//     const { processId } = req.params;
//     const cancelled = offerLetterService.cancelProcess(processId);
//     if (cancelled) {
//       res.status(StatusCodes.OK).json({
//         success: true,
//         message: 'Process cancelled successfully'
//       });
//     } else {
//       res.status(StatusCodes.NOT_FOUND).json({
//         success: false,
//         message: 'Process not found'
//       });
//     }
//   } catch (error) {
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: 'Failed to cancel process'
//     });
//   }
// });
exports.OfferLetterRoutes = router;
