import pLimit from "p-limit";
import QueryBuilder from "../../builder/QueryBuilder";
import { EmailHelper } from "../../utils/emailHelper";
import { IJwtPayload } from "../auth/auth.interface";
import { IOrganization } from "../organization/organization.interface";
import { IEmailStatus, IExperienceLetter } from "./experience-letter.interface";
import ExperienceLetter from "./experience-letter.model";
import { generateExperienceLetterPDF } from "../../utils/woodrock/experience-letter";
import Organization from "../organization/organization.model";

const limit = pLimit(10); // Max 10 concurrent emails
async function processOneExperienceLetter(
  offerLetterData: IExperienceLetter,
  authUser: IJwtPayload
) {
  const updatedData: IExperienceLetter = { ...offerLetterData };
  let resultStatus = IEmailStatus.FAILED;

  try {
    const emailContent = await EmailHelper.createEmailContent(
      //@ts-ignore
      { userName: offerLetterData.employeeEmail || "", ...updatedData },
      "experienceLetter"
    );

    const pdfBuffer = await generateExperienceLetterPDF(offerLetterData);

    const attachment = {
      filename: `experienceLetter_${offerLetterData.employeeEmail}.pdf`,
      content: pdfBuffer,
      encoding: "base64", // if necessary
    };

    const emailResult = await EmailHelper.sendEmail(
      //@ts-ignore
      offerLetterData.employeeEmail,
      emailContent,
      "Experience letter!",
      attachment
    );

    resultStatus =
      emailResult.status === IEmailStatus.SENT
        ? IEmailStatus.SENT
        : IEmailStatus.FAILED;

    updatedData.status = resultStatus;
  } catch (error) {
    console.error(`Failed for ${offerLetterData.employeeEmail}:`, error);
    updatedData.status = IEmailStatus.FAILED;
  }

  const newOfferLetter = new ExperienceLetter({
    ...updatedData,
    generateByUser: authUser.userId,
  });

  await newOfferLetter.save();

  return {
    email: offerLetterData.employeeEmail,
    status: updatedData.status,
  };
}

export const experienceLetterService = {
  async getExperienceLetterAll(query: Record<string, unknown>) {
    const offerLetterQuery = new QueryBuilder(ExperienceLetter.find(), query)
      .search(["employeeName", "employeeEmail"])
      .filter()
      .sort()
      .paginate()
      .fields();

    const result = await offerLetterQuery.modelQuery;
    const meta = await offerLetterQuery.countTotal();

    return {
      meta,
      result,
    };
  },
  async createBulkExperienceLetters(
    offerLetters: IExperienceLetter[],
    authUser: IJwtPayload
  ) {
    const results = await Promise.all(
      offerLetters.map((data) =>
        limit(() => processOneExperienceLetter(data, authUser))
      )
    );

    return results;
  },
};
