import { StatusCodes } from "http-status-codes";
import pLimit from "p-limit";
import QueryBuilder from "../../builder/QueryBuilder";
import { EmailHelper } from "../../utils/emailHelper";
import {
  generateOfferLetterHTML,
  generateOfferLetterPDF,
} from "../../utils/generateOrderInvoicePDF";
import { IJwtPayload } from "../auth/auth.interface";
import { IOfferLetter } from "./offer-letter.interface";
import OfferLetter from "./offer-letter.model";
import AppError from "../../errors/appError";
import Organization from "../organization/organization.model";
import { IOrganization } from "../organization/organization.interface";
import { IEmailStatus } from "../release-letter/release-letter.interface";
import { IBulkProcessStatus, SocketManager } from "../socket/socket-manager";
const processStatuses = new Map<string, IBulkProcessStatus>();
import { v4 as uuidv4 } from "uuid";

const limit = pLimit(10); // Max 10 concurrent emails

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

    if ((offerLetterData.status = IEmailStatus.SENT)) {
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

      if (result.status === IEmailStatus.SENT) {
        updatedData.status = IEmailStatus.SENT;
      } else {
        updatedData.status = IEmailStatus.FAILED;
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
        limit(() => this.processOneOfferLetter(data, authUser))
      )
    );

    return results;
  },
  // Async processing function
  async processOfferLettersAsync(
    offerLetters: IOfferLetter[],
    authUser: IJwtPayload,
    processId: string
  ) {
    const status = processStatuses.get(processId);
    if (!status) return;

    // Update status to processing
    status.status = "PROCESSING";
    SocketManager.emitProcessUpdate(processId, { ...status });

    try {
      const results = await Promise.all(
        offerLetters.map((data) =>
          limit(() =>
            this.processOneOfferLetterWithSocket(data, authUser, processId)
          )
        )
      );

      console.log(
        `Bulk process ${processId} completed with ${results.length} results`
      );
    } catch (error) {
      console.error("Bulk process failed:", error);
      const errorStatus = processStatuses.get(processId);
      if (errorStatus) {
        errorStatus.status = "FAILED";
        SocketManager.emitProcessComplete(processId, { ...errorStatus });
      }
    }
  },
  // New socket-enabled bulk function
  async createBulkOfferLettersWithSocket(
    offerLetters: IOfferLetter[],
    authUser: IJwtPayload
  ): Promise<{ processId: string; status: string }> {
    const processId = uuidv4();
    const total = offerLetters.length;

    // Initialize process status
    const initialStatus: IBulkProcessStatus = {
      processId,
      total,
      sent: 0,
      failed: 0,
      pending: total,
      status: "PENDING",
      completedEmails: [],
      failedEmails: [],
    };

    processStatuses.set(processId, initialStatus);

    // Start processing asynchronously (don't await)
    this.processOfferLettersAsync(offerLetters, authUser, processId).catch(
      (error) => {
        console.error(`Process ${processId} failed:`, error);
        const errorStatus = processStatuses.get(processId);
        if (errorStatus) {
          errorStatus.status = "FAILED";
          SocketManager.emitProcessComplete(processId, { ...errorStatus });
        }
      }
    );

    return { processId, status: "started" };
  },

  async processOneOfferLetter(
    offerLetterData: IOfferLetter,
    authUser: IJwtPayload
  ) {
    const updatedData: IOfferLetter = { ...offerLetterData };
    let resultStatus = IEmailStatus.FAILED;

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
  },
  async processOneOfferLetterWithSocket(
    offerLetterData: IOfferLetter,
    authUser: IJwtPayload,
    processId: string
  ): Promise<{ email: string; status: IEmailStatus }> {
    const result = await this.processOneOfferLetter(offerLetterData, authUser);

    // Update process status after processing each email
    this.updateProcessStatus(
      processId,
      offerLetterData.employeeEmail,
      result.status
    );

    return result;
  },

  // Helper function to update process status
  updateProcessStatus(processId: string, email: string, status: IEmailStatus) {
    const processStatus = processStatuses.get(processId);
    if (!processStatus) return;

    if (status === IEmailStatus.SENT) {
      processStatus.sent++;
      processStatus.completedEmails.push(email);
    } else {
      processStatus.failed++;
      processStatus.failedEmails.push(email);
    }

    processStatus.pending =
      processStatus.total - processStatus.sent - processStatus.failed;

    // Update status
    if (processStatus.pending === 0) {
      processStatus.status =
        processStatus.failed === processStatus.total ? "FAILED" : "COMPLETED";
    }

    // Emit update to all clients in the process room
    SocketManager.emitProcessUpdate(processId, { ...processStatus });

    // If process is complete, emit completion event
    if (processStatus.pending === 0) {
      SocketManager.emitProcessComplete(processId, { ...processStatus });

      // Clean up after 5 minutes
      setTimeout(() => {
        processStatuses.delete(processId);
      }, 300000);
    }
  },

  // Get process status
  getProcessStatus(processId: string): IBulkProcessStatus | null {
    return processStatuses.get(processId) || null;
  },

  // Get all active processes
  getAllActiveProcesses(): IBulkProcessStatus[] {
    return Array.from(processStatuses.values());
  },

  // Cancel/delete a process
  cancelProcess(processId: string): boolean {
    const deleted = processStatuses.delete(processId);
    if (deleted) {
      SocketManager.emitProcessCancelled(processId);
    }
    return deleted;
  },

  // Clean up expired processes (call this periodically)
  cleanupExpiredProcesses() {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    for (const [processId, status] of processStatuses.entries()) {
      if (status.status === "COMPLETED" || status.status === "FAILED") {
        // Check if process is older than maxAge (you'd need to add timestamp to status)
        // For now, just clean up completed processes after some time
        if (processStatuses.size > 100) {
          // Prevent memory bloat
          processStatuses.delete(processId);
        }
      }
    }
  },
};
