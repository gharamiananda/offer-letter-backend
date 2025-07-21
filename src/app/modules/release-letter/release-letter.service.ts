import pLimit from "p-limit";
import QueryBuilder from "../../builder/QueryBuilder";
import { EmailHelper } from "../../utils/emailHelper";
import { generateReleaseLetterPDF } from "../../utils/woodrock/release-letter";
import { IJwtPayload } from "../auth/auth.interface";
import { IOrganization } from "../organization/organization.interface";
import Organization from "../organization/organization.model";
import { IEmailStatus, IReleaseLetter } from "./release-letter.interface";
import {
  default as OfferLetter,
  default as ReleaseLetter,
} from "./release-letter.model";

const limit = pLimit(10); // Max 10 concurrent emails
async function processOneReleaseLetter(
  offerLetterData: IReleaseLetter,
  authUser: IJwtPayload
) {
  const updatedData: IReleaseLetter = { ...offerLetterData };
  let resultStatus = IEmailStatus.FAILED;

  try {
    const emailContent = await EmailHelper.createEmailContent(
      //@ts-ignore
      { userName: offerLetterData.employeeEmail || "", ...updatedData },
      "releaseLetter"
    );

    const pdfBuffer = await generateReleaseLetterPDF(offerLetterData);

    const attachment = {
      filename: `releaseLetter_${offerLetterData.employeeEmail}.pdf`,
      content: pdfBuffer,
      encoding: "base64", // if necessary
    };

    const emailResult = await EmailHelper.sendEmail(
      //@ts-ignore
      offerLetterData.employeeEmail,
      emailContent,
      "release letter!",
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

  const newOfferLetter = new OfferLetter({
    ...updatedData,
    generateByUser: authUser.userId,
  });

  await newOfferLetter.save();

  return {
    email: offerLetterData.employeeEmail,
    status: updatedData.status,
  };
}

export const releaseLetterService = {
  async getReleaseLetterAll(query: Record<string, unknown>) {
    const offerLetterQuery = new QueryBuilder(ReleaseLetter.find(), query)
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
  async createBulkReleaseLetters(
    offerLetters: IReleaseLetter[],
    authUser: IJwtPayload
  ) {
    const results = await Promise.all(
      offerLetters.map((data) =>
        limit(() => processOneReleaseLetter(data, authUser))
      )
    );

    return results;
  },
};
