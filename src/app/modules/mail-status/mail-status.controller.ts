import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { SentMailStatusService } from "./mail-status.service";

const createSentMailStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await SentMailStatusService.createSentMailStatus(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Mail status created successfully",
    data: result,
  });
});

const getAllSentMailStatuses = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SentMailStatusService.getAllMailStatuses(req.query);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Mail statuses fetched successfully",
      data: result,
    });
  }
);

const updateSentMailStatus = catchAsync(async (req: Request, res: Response) => {
  const { processId } = req.params;

  const result = await SentMailStatusService.updateMailStatus(
    processId,
    req.body
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Mail status updated successfully",
    data: result,
  });
});

const getSentMailStatusByProcessId = catchAsync(
  async (req: Request, res: Response) => {
    const { processId } = req.params;

    const result = await SentMailStatusService.getMailStatusByProcessId(
      processId
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Mail status fetched successfully",
      data: result,
    });
  }
);

const deleteSentMailStatus = catchAsync(async (req: Request, res: Response) => {
  const { processId } = req.params;

  const result = await SentMailStatusService.deleteMailStatus(processId);

  res.status(StatusCodes.OK).json({
    statusCode: StatusCodes.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

export const sentMailStatusController = {
  createSentMailStatus,
  getAllSentMailStatuses,
  updateSentMailStatus,
  getSentMailStatusByProcessId,
  deleteSentMailStatus,
};
