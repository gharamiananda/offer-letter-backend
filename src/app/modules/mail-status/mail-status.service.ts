import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/appError";
import { ISentMailStatus } from "./mail-status.interface";
import QueryBuilder from "../../builder/QueryBuilder";
import { MailStatus } from "./mail-status.model";

const createSentMailStatus = async (statusData: Partial<ISentMailStatus>) => {
  const status = new MailStatus({
    ...statusData,
    status: "PENDING",
    completedEmails: [],
    failedEmails: [],
  });

  return await status.save();
};

const getAllMailStatuses = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(MailStatus.find(), query)
    .search(["processId", "mailType"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await queryBuilder.modelQuery;
  const meta = await queryBuilder.countTotal();

  return { meta, result };
};

const updateMailStatus = async (
  processId: string,
  payload: Partial<ISentMailStatus>
) => {
  const status = await MailStatus.findOne({ processId });

  if (!status) {
    throw new AppError(StatusCodes.NOT_FOUND, "Mail process not found.");
  }

  const updated = await MailStatus.findByIdAndUpdate(
    status._id,
    { $set: payload },
    { new: true, runValidators: true }
  );

  return updated;
};

const getMailStatusByProcessId = async (processId: string) => {
  const status = await MailStatus.findOne({ processId });

  if (!status) {
    throw new AppError(StatusCodes.NOT_FOUND, "Mail status not found.");
  }

  return status;
};

const deleteMailStatus = async (processId: string) => {
  const status = await MailStatus.findOne({ processId });

  if (!status) {
    throw new AppError(StatusCodes.NOT_FOUND, "Mail status not found.");
  }

  await MailStatus.updateOne({ _id: status._id }, { isDeleted: true });

  return { message: "Mail status deleted successfully." };
};

export const SentMailStatusService = {
  createSentMailStatus,
  getAllMailStatuses,
  updateMailStatus,
  getMailStatusByProcessId,
  deleteMailStatus,
};
