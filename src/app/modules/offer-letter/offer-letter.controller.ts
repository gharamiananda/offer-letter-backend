import { Request, Response } from "express";
import { offerLetterService } from "./offer-letter.service";
import { IJwtPayload } from "../auth/auth.interface";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";

export const offerLetterController = {
  // async getAll() {
  //   return catchAsync(async (req, res) => {
  //     const result = await offerLetterService.getOfferLetterAll(req.query);

  //     sendResponse(res, {
  //       statusCode: StatusCodes.OK,
  //       success: true,
  //       message: "OfferLetter are retrieved successfully",
  //       meta: result.meta,
  //       data: result.result,
  //     });
  //   });
  // },
  getOfferLetterAll: catchAsync(async (req, res) => {
    const result = await offerLetterService.getOfferLetterAll(req.query);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "OfferLetter are retrieved successfully",
      meta: result.meta,
      data: result.result,
    });
  }),
  async createOfferLetter(req: Request, res: Response) {
    const result = await offerLetterService.createOfferLetter(
      req.body,
      req.user as IJwtPayload
    );

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Offer Letter created succesfully",
      data: result,
    });
  },
};
