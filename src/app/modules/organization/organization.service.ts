import mongoose from "mongoose";
import { IImageFile } from "../../interface/IImageFile";
import { IOrganization } from "./organization.interface";
import { IJwtPayload } from "../auth/auth.interface";
import User from "../user/user.model";
import AppError from "../../errors/appError";
import { StatusCodes } from "http-status-codes";
import Organization from "./organization.model";

const createOrganization = async (
  OrganizationData: Partial<IOrganization>,
  logo: IImageFile,
  authUser: IJwtPayload
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if the user already exists by email
    const existingUser = await User.findById(authUser.userId).session(session);

    if (!existingUser) {
      throw new AppError(StatusCodes.NOT_ACCEPTABLE, "User is not exists!");
    }

    if (!existingUser.isActive) {
      throw new AppError(StatusCodes.NOT_ACCEPTABLE, "User is not active!");
    }

    if (logo) {
      OrganizationData.logo = logo.path;
    }

    const organization = new Organization({
      ...OrganizationData,
      user: existingUser._id,
    });

    const createdOrganization = await organization.save({ session });

    await User.findByIdAndUpdate(
      existingUser._id,
      { hasOrganization: true },
      { new: true, session }
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return createdOrganization;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getMyOrganization = async (authUser: IJwtPayload) => {
  const existingUser = await User.checkUserExist(authUser.userId);
  if (!existingUser.hasOrganization) {
    throw new AppError(StatusCodes.NOT_FOUND, "You have no Organization!");
  }

  const organization = await Organization.findOne({
    user: existingUser._id,
  }).populate("user");
  return organization;
};

export const OrganizationService = {
  createOrganization,
  getMyOrganization,
};
