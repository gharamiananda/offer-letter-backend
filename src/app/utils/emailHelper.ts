import * as fs from "fs";
import * as path from "path";
const Util = require("util");
const ReadFile = Util.promisify(fs.readFile);
const Handlebars = require("handlebars");
import nodemailer from "nodemailer";
import config from "../config";
import { offerLetterStatus } from "../modules/offer-letter/offer-letter.interface";

const sendEmail = async (
  email: string,
  html: string,
  subject: string,
  attachment?: { filename: string; content: Buffer; encoding: string }
): Promise<{
  status: offerLetterStatus;
  messageId?: string;
  error?: string;
}> => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: config.sender_email,
        pass: config.sender_app_password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions: any = {
      from: `Woodrock <${config.sender_email}>`, // corrected formatting
      to: email,
      subject,
      html,
    };

    if (attachment) {
      mailOptions.attachments = [
        {
          filename: attachment.filename,
          content: attachment.content,
          encoding: attachment.encoding,
        },
      ];
    }

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return {
      status: offerLetterStatus.SENT,
      messageId: info.messageId,
    };
  } catch (error: any) {
    console.error("Error sending email:", error.message || error);
    return {
      status: offerLetterStatus.FAILED,
      error: error.message || "Unknown error",
    };
  }
};

const createEmailContent = async (data: object, templateType: string) => {
  try {
    const templatePath = path.join(
      process.cwd(),
      `/src/templates/${templateType}.template.hbs`
    );

    const content = await ReadFile(templatePath, "utf8");
    const template = Handlebars.compile(content);
    return template(data);
  } catch (error) {
    console.log(error, "complier error");
  }
};

export const EmailHelper = {
  sendEmail,
  createEmailContent,
};
