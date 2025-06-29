import { StatusCodes } from "http-status-codes";
import pLimit from "p-limit";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/appError";
import { EmailHelper } from "../../utils/emailHelper";
import {
  generateOfferLetterHTML,
  generateOfferLetterPDF,
  generateOrderInvoicePDF,
  generatePayslipPDF,
} from "../../utils/generateOrderInvoicePDF";
import { IJwtPayload } from "../auth/auth.interface";
import PaySlip from "./payslip.model";
import { IPaySlip, offerLetterStatus } from "./payslip.interface";

const limit = pLimit(10); // Max 10 concurrent emails
async function processOneOfferLetter(
  offerLetterData: IPaySlip,
  authUser: IJwtPayload
) {
  try {
    const emailContent = await EmailHelper.createEmailContent(
      //@ts-ignore
      { userName: offerLetterData.employeeEmail || "", ...offerLetterData },
      "payslip"
    );

    const pdfBuffer = await generatePayslipPDF(offerLetterData);

    const attachment = {
      filename: `payslip_${offerLetterData.employeeEmail}.pdf`,
      content: pdfBuffer,
      encoding: "base64",
    };

    const emailResult = await EmailHelper.sendEmail(
      //@ts-ignore
      offerLetterData.employeeEmail,
      emailContent,
      "Payslip generated!",
      attachment
    );

    const resultStatus =
      emailResult.status === offerLetterStatus.SENT
        ? offerLetterStatus.SENT
        : offerLetterStatus.FAILED;
    const newOfferLetter = new PaySlip({
      ...offerLetterData,
      generateByUser: authUser.userId,
      status: resultStatus,
    });

    const result = await newOfferLetter.save();
    return result;
  } catch (error) {
    console.error(`Failed for ${offerLetterData.employeeEmail}:`, error);
  }

  const newOfferLetter = new PaySlip({
    ...offerLetterData,
    generateByUser: authUser.userId,
  });

  await newOfferLetter.save();

  return {
    email: offerLetterData.employeeEmail,
  };
}

export const payslipService = {
  async getOfferLetterAll(query: Record<string, unknown>) {
    const offerLetterQuery = new QueryBuilder(PaySlip.find(), query)
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
    const offerLetter = await PaySlip.findById(id);
    if (!offerLetter) {
      throw new AppError(StatusCodes.NOT_FOUND, "Offer letter not found!");
    }
    const htmlContent = generatePayslipPDF(offerLetter as IPaySlip);

    return htmlContent;
  },

  async createOfferLetter(offerLetterData: IPaySlip, authUser: IJwtPayload) {
    const updatedData: IPaySlip = {
      ...offerLetterData,
    };

    const emailContent = await EmailHelper.createEmailContent(
      //@ts-ignore
      { userName: offerLetterData.employeeEmail || "", ...updatedData },
      "offerLetter"
    );
    const pdfBuffer = await generatePayslipPDF(offerLetterData);

    const attachment = {
      filename: `offerletter_${offerLetterData.employeeEmail}.pdf`,

      content: pdfBuffer,
      encoding: "base64", // if necessary
    };

    await EmailHelper.sendEmail(
      //@ts-ignore
      offerLetterData.employeeEmail,
      emailContent,
      "Offer letter confirmed!",
      attachment
    );

    const newOfferLetter = new PaySlip({
      ...updatedData,
      generateByUser: authUser.userId,
    });

    const result = await newOfferLetter.save();
    return result;
  },
  async createBulkOfferLetters(
    offerLetters: IPaySlip[],
    authUser: IJwtPayload
  ) {
    const results = await Promise.all(
      offerLetters.map((data) =>
        limit(() => {
          if (data?.employeeEmail) {
            return processOneOfferLetter(data, authUser);
          }
          return;
        })
      )
    );

    return results;
  },
};
