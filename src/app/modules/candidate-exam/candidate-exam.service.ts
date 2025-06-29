import { StatusCodes } from "http-status-codes";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/appError";
import candidateExamModel from "./candidate-exam.model";
import { IJwtPayload } from "../auth/auth.interface";
import { ICandidateExamModel } from "./candidate-exam.interface";
import { IImageFile } from "../../interface/IImageFile";

export const candidateExamService = {
  async getcandidateExamAll(query: Record<string, unknown>) {
    const candidateExamQuery = new QueryBuilder(
      candidateExamModel.find(),
      query
    )
      .search(["candidateName", "candidateEmail"])
      .filter()
      .sort()
      .paginate()
      .fields();

    const result = await candidateExamQuery.modelQuery;
    const meta = await candidateExamQuery.countTotal();

    return {
      meta,
      result,
    };
  },
  async getcandidateExamById(id: string) {
    const candidateExam = await candidateExamModel.findById(id);
    if (!candidateExam) {
      throw new AppError(StatusCodes.NOT_FOUND, "Offer letter not found!");
    }

    return candidateExam;
  },
  async getAndUpdatecandidateExamById(
    productId: string,
    payload: Partial<ICandidateExamModel>
  ) {
    return await candidateExamModel.findByIdAndUpdate(productId, payload, {
      new: true,
    });
  },

  async createcandidateExam(
    candidateExamData: ICandidateExamModel,
    file: IImageFile,

    authUser: IJwtPayload
  ) {
    const newcandidateExam = new candidateExamModel(candidateExamData);

    if (file && file.path) {
      newcandidateExam.cv = file.path;
    }

    const result = await newcandidateExam.save();
    return result;
  },
};
