import { Request, Response } from "express";
import { offerLetterService } from "./offer-letter.service";
import { IJwtPayload } from "../auth/auth.interface";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import { IOfferLetter, offerLetterStatus } from "./offer-letter.interface";
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

    // Read the file from buffer
    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

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
  // async createBulkOfferLetter(req: Request, res: Response) {
  //   const offerLetters: IOfferLetter[] = req.body;
  //   const file = req.file;
  //   if (!file) {
  //     return res.status(400).json({ message: "Empty or invalid Excel file" });
  //   }

  //   const workbook = XLSX.readFile(file.path);
  //   const sheetName = workbook.SheetNames[0];
  //   const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  //   if (!Array.isArray(rows) || rows.length === 0) {
  //     return res.status(400).json({ message: "Empty or invalid Excel file" });
  //   }

  //   console.log(rows, "rows");
  //   return;
  //   const results = await offerLetterService.createBulkOfferLetters(
  //     offerLetters,
  //     req.user as IJwtPayload
  //   );

  //   res.status(201).json({
  //     success: true,
  //     message: "Bulk offer letters processed",
  //     total: offerLetters.length,
  //     sent: results.filter((r) => r.status === offerLetterStatus.SENT).length,
  //     failed: results.filter((r) => r.status === offerLetterStatus.FAILED),
  //   });
  // },
};
