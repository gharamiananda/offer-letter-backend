import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as XLSX from "xlsx";
import AppError from "../../errors/appError";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { IJwtPayload } from "../auth/auth.interface";
import { payslipService } from "./payslip.service";
import { IPaySlip } from "./payslip.interface";

export const payslipController = {
  getOfferLetterAll: catchAsync(async (req, res) => {
    const result = await payslipService.getOfferLetterAll(req.query);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "OfferLetter are retrieved successfully",
      meta: result.meta,
      data: result.result,
    });
  }),
  async createOfferLetter(req: Request, res: Response) {
    const result = await payslipService.createOfferLetter(
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
    const result = await payslipService.getOfferLetterById(req.params.id);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Offer Letter retrived succesfully",
      data: result,
    });
  },
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

    const results = await payslipService.createBulkOfferLetters(
      rows as IPaySlip[],
      req.user as IJwtPayload
    );

    console.log(rows, rows.length, "rows");

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Bulk offer letters processed",
      data: results,
    });
  },
};
