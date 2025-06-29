import { Request, Response } from "express";
import { candidateExamService } from "./candidate-exam.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { IJwtPayload } from "../auth/auth.interface";
import { IImageFile } from "../../interface/IImageFile";

export const candidateExamController = {
  getcandidateExamAll: catchAsync(async (req, res) => {
    const result = await candidateExamService.getcandidateExamAll(req.query);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "candidateExam are retrieved successfully",
      meta: result.meta,
      data: result.result,
    });
  }),
  async createcandidateExam(req: Request, res: Response) {
    const result = await candidateExamService.createcandidateExam(
      req.body,
      req.file as IImageFile,

      req.user as IJwtPayload
    );

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Offer Letter created succesfully",
      data: result,
    });
  },
  async getcandidateExamById(req: Request, res: Response) {
    const result = await candidateExamService.getcandidateExamById(
      req.params.id
    );

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Offer Letter retrived succesfully",
      data: result,
    });
  },
  async updateCandidateExamById(req: Request, res: Response) {
    const result = await candidateExamService.getAndUpdatecandidateExamById(
      req.params.candidateId,
      req.body
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Offer Letter Updated succesfully",
      data: result,
    });
  },
};
