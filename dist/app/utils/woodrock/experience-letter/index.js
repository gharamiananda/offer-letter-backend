"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateExperienceLetterPDF = exports.generateExperienceLetterHTML = void 0;
const axios_1 = __importDefault(require("axios"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const generateExperienceLetterHTML = (experienceLetter, logoBase64) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Experience Letter - Woodrock Softonic Pvt Ltd</title>
  <style>
    @page {
      size: A4;
    }

    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: white;
      -webkit-print-color-adjust: exact;
    }

    .page {
      width: 210mm;
      height: 297mm;
      position: relative;
      box-sizing: border-box;
      padding: 40px;
    }

   

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
    }

    .logo-text {
      font-size: 24px;
      font-weight: bold;
    }

    .location {
      font-size: 14px;
      text-align: right;
    }

    .title {
      text-align: center;
      margin: 40px 0 20px 0;
      font-size: 20px;
      font-weight: bold;
      text-decoration: underline;
    }

    .content {
      font-size: 16px;
      line-height: 1.6;
    }

    .highlight {
      color: red;
      font-weight: bold;
    }

    .signature {
      margin-top: 60px;
      font-size: 16px;
    }

    .signature img {
      width: 150px;
      margin-top: 20px;
    }
  </style>
</head>

<body>
  <div class="page">

    <div class="header">
      <div>
        <div class="logo-text">WOODROCK SOFTONIC Private Limited</div>
        <div>KOLKATA, WESTBENGAL</div>
      </div>
      <div>
         <img src="https://media.cakeresume.com/image/upload/s--k9CQtNTA--/c_pad,fl_png8,h_400,w_400/v1691154551/e6idc2sh97xdrmuafkp7.png" alt="Company Logo" width="80" />
      </div>
    </div>

    <div class="title">Experience Letter</div>

    <div class="content">
      <p>To whom it may concern,</p>

      <p>This is to certify that <span class="highlight">${experienceLetter.employeeName}</span> has served at <strong>Woodrock Softonic Private Limited</strong> firm for the period of <span class="highlight">${experienceLetter.employeeDateOfJoin}</span> to <span class="highlight">${experienceLetter.employeeDateOfResign}</span>. At the time of leaving this Organization, she held the position of <strong>${experienceLetter.employeeDesignation}</strong>.</p>

      <p>Throughout her employment, <span class="highlight">${experienceLetter.employeeName}</span> demonstrated a high level of professionalism, dedication, and competence in her work. We acknowledge and appreciate her hard work, commitment, and positive attitude during their time with us.</p>

      <p>We wish her all the best in their future endeavor and have no problem with her joining any other company.</p>

      <div class="signature">
        <p>For Woodrock Softonic Private Limited</p>
        <img src="https://res.cloudinary.com/dri1mh3xh/image/upload/v1750698006/mhyrewrvtfgpqz21lfo7.jpg" alt="Signature" />
        <p><strong>Simran Jha || HR Department</strong></p>
        <p><strong>Woodrock Softonic Pvt Ltd</strong></p>
        <p>Email: <a href="mailto:simran.jha@woodrockgroup.in">simran.jha@woodrockgroup.in</a></p>
      </div>
    </div>
  </div>
</body>
</html>
`;
};
exports.generateExperienceLetterHTML = generateExperienceLetterHTML;
const generateExperienceLetterPDF = (offerLetter) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch logo and convert to base64
        const logoUrl = "https://media.cakeresume.com/image/upload/s--k9CQtNTA--/c_pad,fl_png8,h_400,w_400/v1691154551/e6idc2sh97xdrmuafkp7.png";
        const response = yield axios_1.default.get(logoUrl, { responseType: "arraybuffer" });
        const logoBase64 = Buffer.from(response.data).toString("base64");
        const htmlContent = (0, exports.generateExperienceLetterHTML)(offerLetter, logoBase64);
        // Launch Puppeteer
        const browser = yield puppeteer_1.default.launch({
            headless: true,
            executablePath: "/usr/bin/chromium", // Use the installed Chromium
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
        const page = yield browser.newPage();
        yield page.setContent(htmlContent, { waitUntil: "networkidle0" });
        const pdfBuffer = yield page.pdf({
            format: "A4",
            margin: { top: "40px", bottom: "60px", left: "40px", right: "40px" },
        });
        yield browser.close();
        return Buffer.from(pdfBuffer);
    }
    catch (err) {
        console.error("PDF generation failed:", err);
        throw err;
    }
});
exports.generateExperienceLetterPDF = generateExperienceLetterPDF;
