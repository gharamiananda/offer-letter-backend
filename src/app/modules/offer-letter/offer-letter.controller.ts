import { Request, Response } from "express";
import { offerLetterService } from "./offer-letter.service";
import { IJwtPayload } from "../auth/auth.interface";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import { IOfferLetter } from "./offer-letter.interface";
import * as XLSX from "xlsx";
import AppError from "../../errors/appError";

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
  async getOfferLetterById(req: Request, res: Response) {
    const result = await offerLetterService.getOfferLetterById(req.params.id);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Offer Letter retrived succesfully",
      data: result,
    });
  },
  acknowledgeById: catchAsync(async (req, res) => {
    // async acknowledgeById(req: Request, res: Response) {
    const message = await offerLetterService.acknowledgeById(
      req.params.employeeEmail
    );

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: message.message || "Offer letter acknowledged successfully",
      data: null,
    });
  }),

  async createBulkOfferLetter(req: Request, res: Response) {
    const file = req.file;
    if (!file) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Empty or invalid Excel file"
      );
    }

    const workbook = XLSX.read(file.buffer, {
      type: "buffer",
      cellDates: true, // Important: forces cells to be parsed as Date objects
    });

    const sheetName = workbook.SheetNames[0];

    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
      defval: "", // Keeps empty cells instead of skipping
      raw: false, // Converts dates and numbers properly
    });

    const results = await offerLetterService.createBulkOfferLetters(
      rows as IOfferLetter[],
      req.user as IJwtPayload
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Bulk offer letters processed",
      data: results,
    });
  },
};
