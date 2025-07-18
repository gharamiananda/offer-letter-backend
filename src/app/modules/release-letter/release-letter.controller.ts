import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as XLSX from "xlsx";
import AppError from "../../errors/appError";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { IJwtPayload } from "../auth/auth.interface";
import { releaseLetterService } from "./release-letter.service";
import { IReleaseLetter } from "./release-letter.interface";

export const releaseLetterController = {
  getOfferLetterAll: catchAsync(async (req, res) => {
    const result = await releaseLetterService.getReleaseLetterAll(req.query);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "ReleaseLetter are retrieved successfully",
      meta: result.meta,
      data: result.result,
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

    const results = await releaseLetterService.createBulkReleaseLetters(
      rows as IReleaseLetter[],
      req.user as IJwtPayload
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Bulk offer letters processed",
      data: results,
    });
  },
  async createBulkReleaseLetterWithData(req: Request, res: Response) {
    const results = await releaseLetterService.createBulkReleaseLetters(
      req.body as IReleaseLetter[],
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
