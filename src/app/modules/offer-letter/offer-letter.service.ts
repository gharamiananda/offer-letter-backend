import { StatusCodes } from "http-status-codes";
import pLimit from "p-limit";
import QueryBuilder from "../../builder/QueryBuilder";
import { EmailHelper } from "../../utils/emailHelper";
import {
  generateOfferLetterHTML,
  generateOfferLetterPDF,
} from "../../utils/generateOrderInvoicePDF";
import { IJwtPayload } from "../auth/auth.interface";
import { IOfferLetter, offerLetterStatus } from "./offer-letter.interface";
import OfferLetter from "./offer-letter.model";
import AppError from "../../errors/appError";

const limit = pLimit(10); // Max 10 concurrent emails
async function processOneOfferLetter(
  offerLetterData: IOfferLetter,
  authUser: IJwtPayload
) {
  const updatedData: IOfferLetter = { ...offerLetterData };
  let resultStatus = offerLetterStatus.FAILED;

  try {
    const emailContent = await EmailHelper.createEmailContent(
      //@ts-ignore
      { userName: offerLetterData.employeeEmail || "", ...updatedData },
      "offerLetter"
    );

    const pdfBuffer = await generateOfferLetterPDF(offerLetterData);

    const attachment = {
      filename: `offerletter_${offerLetterData.employeeEmail}.pdf`,
      content: pdfBuffer,
      encoding: "base64", // if necessary
    };

    const emailResult = await EmailHelper.sendEmail(
      //@ts-ignore
      offerLetterData.employeeEmail,
      emailContent,
      "Offer letter confirmed!",
      attachment
    );

    resultStatus =
      emailResult.status === offerLetterStatus.SENT
        ? offerLetterStatus.SENT
        : offerLetterStatus.FAILED;

    updatedData.status = resultStatus;
  } catch (error) {
    console.error(`Failed for ${offerLetterData.employeeEmail}:`, error);
    updatedData.status = offerLetterStatus.FAILED;
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

export const offerLetterService = {
  async getOfferLetterAll(query: Record<string, unknown>) {
    const offerLetterQuery = new QueryBuilder(OfferLetter.find(), query)
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
  async getOfferLetterById(id: string) {
    const offerLetter = await OfferLetter.findById(id);
    if (!offerLetter) {
      throw new AppError(StatusCodes.NOT_FOUND, "Offer letter not found!");
    }
    const logoBase64 = ""; // you can fetch actual logo if needed
    const htmlContent = generateOfferLetterHTML(
      offerLetter as IOfferLetter,
      logoBase64
    );

    return htmlContent;
  },
  async acknowledgeById(employeeEmail: string) {
    // First, check if the offer letter exists and its current acknowledge status
    const offerLetter = await OfferLetter.findOne({ employeeEmail });

    if (!offerLetter) {
      throw new AppError(StatusCodes.NOT_FOUND, "Offer letter not found!");
    }

    if (offerLetter.acknowledge) {
      return {
        message: `Offer letter already acknowledged on ${
          offerLetter.dateOfAcknowledge
            ? offerLetter.dateOfAcknowledge.toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "unknown date"
        }`,
      };
    }

    // Update acknowledge to true
    offerLetter.acknowledge = true;
    offerLetter.dateOfAcknowledge = new Date();

    await offerLetter.save();

    return {
      message:
        "Thank you for your confirmation. Your acknowledgement has been recorded successfully.",
    };
  },
  async createOfferLetter(
    offerLetterData: IOfferLetter,
    authUser: IJwtPayload
  ) {
    const updatedData: IOfferLetter = {
      ...offerLetterData,
    };

    if ((offerLetterData.status = offerLetterStatus.SENT)) {
      const emailContent = await EmailHelper.createEmailContent(
        //@ts-ignore
        { userName: offerLetterData.employeeEmail || "", ...updatedData },
        "offerLetter"
      );
      const pdfBuffer = await generateOfferLetterPDF(offerLetterData);

      const attachment = {
        filename: `offerletter_${offerLetterData.employeeEmail}.pdf`,

        content: pdfBuffer,
        encoding: "base64", // if necessary
      };

      const result = await EmailHelper.sendEmail(
        //@ts-ignore
        offerLetterData.employeeEmail,
        emailContent,
        "Offer letter confirmed!",
        attachment
      );

      if (result.status === offerLetterStatus.SENT) {
        updatedData.status = offerLetterStatus.SENT;
      } else {
        updatedData.status = offerLetterStatus.FAILED;
      }
    }
    const newOfferLetter = new OfferLetter({
      ...updatedData,
      generateByUser: authUser.userId,
    });

    const result = await newOfferLetter.save();
    return result;
  },
  async createBulkOfferLetters(
    offerLetters: IOfferLetter[],
    authUser: IJwtPayload
  ) {
    const results = await Promise.all(
      offerLetters.map((data) =>
        limit(() => processOneOfferLetter(data, authUser))
      )
    );

    return results;
  },
};
