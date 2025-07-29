import { Router } from "express";
import { offerLetterController } from "./offer-letter.controller";
import auth from "../../middleware/auth";
import { UserRole } from "../user/user.interface";
// import { multerUpload } from "../../config/multer.config";
import { parseBody } from "../../middleware/bodyParser";

const router = Router();

// Define routes
// router.get("/", offerLetterController.getAll);
router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),
  // validateRequest(categoryValidation.createCategoryValidationSchema),
  offerLetterController.createOfferLetter
);
import multer from "multer";
import { StatusCodes } from "http-status-codes";
import { offerLetterService } from "./offer-letter.service";

const storage = multer.memoryStorage();
const multerUpload = multer({ storage });

router.post(
  "/upload-offer-letter-csv",
  auth(UserRole.ADMIN, UserRole.USER),
  multerUpload.single("multipleOfferLetterCsv"),

  // validateRequest(categoryValidation.createCategoryValidationSchema),
  offerLetterController.createBulkOfferLetter
);
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),

  offerLetterController.getOfferLetterAll
);

router.get(
  "/html/:id",
  auth(UserRole.ADMIN, UserRole.USER),
  offerLetterController.getOfferLetterById
);
router.get(
  "/process-status/:processId",
  auth(UserRole.ADMIN, UserRole.USER),
  offerLetterController.getProcessStatus
);

router.post(
  "/offer-acknowledge/:employeeEmail",
  offerLetterController.acknowledgeById
);

router.post(
  "/upload-letter-csv-socket",
  auth(UserRole.ADMIN, UserRole.USER),
  offerLetterController.createBulkOfferLetterWithSocket
);

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

export const OfferLetterRoutes = router;
