"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentMailStatusRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_interface_1 = require("../user/user.interface");
const mail_status_controller_1 = require("./mail-status.controller");
// import { sentMailStatusController } from './mail-status.controller';
// import { sentMailStatusController } from './sentMailStatus.controller';
const router = (0, express_1.Router)();
// Create a new mail process status
router.post("/", (0, auth_1.default)(user_interface_1.UserRole.ADMIN), // or USER if needed
mail_status_controller_1.sentMailStatusController.createSentMailStatus);
// Get all mail process statuses
router.get("/", (0, auth_1.default)(user_interface_1.UserRole.ADMIN), mail_status_controller_1.sentMailStatusController.getAllSentMailStatuses);
// Get mail status by processId
router.get("/:processId", (0, auth_1.default)(user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.USER), mail_status_controller_1.sentMailStatusController.getSentMailStatusByProcessId);
// Update mail process status
router.patch("/:processId", (0, auth_1.default)(user_interface_1.UserRole.ADMIN), mail_status_controller_1.sentMailStatusController.updateSentMailStatus);
// Soft delete a mail status
router.delete("/:processId", (0, auth_1.default)(user_interface_1.UserRole.ADMIN), mail_status_controller_1.sentMailStatusController.deleteSentMailStatus);
exports.SentMailStatusRoutes = router;
