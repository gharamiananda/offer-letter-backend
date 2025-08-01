import * as fs from "fs";
import nodemailer from "nodemailer";
import * as path from "path";
import config from "../config";
import { IEmailStatus } from "../modules/release-letter/release-letter.interface";
const Util = require("util");
const ReadFile = Util.promisify(fs.readFile);
const Handlebars = require("handlebars");

const sendEmail = async (
  email: string,
  html: string,
  subject: string,
  attachment?: { filename: string; content: Buffer; encoding: string }
): Promise<{
  status: IEmailStatus;
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
    console.log("Email sent:", info.messageId, email);

    return {
      status: IEmailStatus.SENT,
      messageId: info.messageId,
    };
  } catch (error: any) {
    console.error("Error sending email:", error.message || error);
    return {
      status: IEmailStatus.FAILED,
      error: error.message || "Unknown error",
    };
  }
};

const verifyEmailCredentials = async (): Promise<boolean> => {
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

    await transporter.verify(); // This checks if the connection/auth is OK
    console.log("SMTP credentials are valid.");
    return true;
  } catch (err: any) {
    console.error("Invalid SMTP credentials:", err.message || err);
    return false;
  }
};

const sendEmailFromAdmin = async (
  email: string,
  html: string,
  subject: string,
  attachment?: { filename: string; content: Buffer; encoding: string }
): Promise<{
  status: IEmailStatus;
  messageId?: string;
  error?: string;
}> => {
  // SENDER_EMAIL="anandagharami.am@gmail.com"
  // SENDER_APP_PASS="gcjm dbqa idpd jcfh"
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "anandagharami.am@gmail.com",
        pass: "gcjm dbqa idpd jcfh",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions: any = {
      from: `Woodrock <${"anandagharami.am@gmail.com"}>`, // corrected formatting
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
    console.log("Email sent:", info.messageId, email);
    return {
      status: IEmailStatus.SENT,
      messageId: info.messageId,
    };
  } catch (error: any) {
    console.error("Error sending email:", error.message || error);
    return {
      status: IEmailStatus.FAILED,
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
  sendEmailFromAdmin,
  verifyEmailCredentials
};
