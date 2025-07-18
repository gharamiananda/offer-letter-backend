import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { OrganizationService } from "./organization.service";
import { IImageFile } from "../../interface/IImageFile";
import { IJwtPayload } from "../auth/auth.interface";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const createOrganization = catchAsync(async (req: Request, res: Response) => {
  const result = await OrganizationService.createOrganization(
    req.body,
    req.file as IImageFile,
    req.user as IJwtPayload
  );

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Organization created successfully!",
    data: result,
  });
});

const getMyOrganization = catchAsync(async (req: Request, res: Response) => {
  const result = await OrganizationService.getMyOrganization(
    req.user as IJwtPayload
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Organization retrive successfully!",
    data: result,
  });
});

export const OrganizationController = {
  createOrganization,
  getMyOrganization,
};
