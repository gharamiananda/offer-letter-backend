"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../user/user.model"));
const appError_1 = __importDefault(require("../../errors/appError"));
const http_status_codes_1 = require("http-status-codes");
const organization_model_1 = __importDefault(require("./organization.model"));
const createOrganization = (OrganizationData, logo, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Check if the user already exists by email
        const existingUser = yield user_model_1.default.findById(authUser.userId).session(session);
        if (!existingUser) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, "User is not exists!");
        }
        if (!existingUser.isActive) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, "User is not active!");
        }
        if (logo) {
            OrganizationData.logo = logo.path;
        }
        const organization = new organization_model_1.default(Object.assign(Object.assign({}, OrganizationData), { user: existingUser._id }));
        const createdOrganization = yield organization.save({ session });
        yield user_model_1.default.findByIdAndUpdate(existingUser._id, { hasOrganization: true }, { new: true, session });
        // Commit the transaction
        yield session.commitTransaction();
        session.endSession();
        return createdOrganization;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const getMyOrganization = (authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield user_model_1.default.checkUserExist(authUser.userId);
    if (!existingUser.hasOrganization) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "You have no Organization!");
    }
    const organization = yield organization_model_1.default.findOne({
        user: existingUser._id,
    }).populate("user");
    return organization;
});
exports.OrganizationService = {
    createOrganization,
    getMyOrganization,
};
