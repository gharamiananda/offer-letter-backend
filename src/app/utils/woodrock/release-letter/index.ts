import axios from "axios";

import htmlPdf from "html-pdf-node";
import { IReleaseLetter } from "../../../modules/release-letter/release-letter.interface";

export const generateReleaseLetterHTML = (
  releaseLetter: IReleaseLetter,
  logoBase64: string
): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Release Letter - Woodrock Softonic Pvt Ltd</title>
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

    <div class="title">Release Letter</div>

    <div class="content">
      <p>To Whom it May Concern,</p>

      <p>This is to certify that the resignation of <span class="highlight">${
        releaseLetter.employeeName
      }</span> has been accepted by the company.</p>

      <p>${
        releaseLetter.employeeGender === "Female" ? "She" : "He"
      } will be relieved from the services of <strong>WOODROCK SOFTONIC PRIVATE LIMITED</strong> with effect from the closing hours of <span class="highlight">${
    releaseLetter.employeeDateOfJoin
  }</span> as a <strong>${releaseLetter.employeeDesignation}</strong>.</p>

      <p>We appreciate her dedication and contribution during her tenure with us.</p>

      <p>We wish her all the success in all future endeavor.</p>

      <div class="signature">
        <p>Sincerely,</p>
        <img src="https://res.cloudinary.com/dri1mh3xh/image/upload/v1750698006/mhyrewrvtfgpqz21lfo7.jpg" alt="Signature" />
        <p><strong>Simran Jha || HR Department</strong></p>
        <p><strong>Woodrock Softonic Pvt Ltd</strong></p>
        <p>Email: <a href="mailto:simran.jha@woodrockgroup.in">simran.jha@woodrockgroup.in</a></p>
      </div>
    </div>
  </div>
</body>
</html>`;
};
export const generateReleaseLetterPDF = async (
  offerLetter: IReleaseLetter
): Promise<Buffer> => {
  try {
    // Fetch logo and convert to base64
    const logoUrl =
      "https://media.cakeresume.com/image/upload/s--k9CQtNTA--/c_pad,fl_png8,h_400,w_400/v1691154551/e6idc2sh97xdrmuafkp7.png";
    const response = await axios.get(logoUrl, { responseType: "arraybuffer" });
    const logoBase64 = Buffer.from(response.data).toString("base64");

    const htmlContent = generateReleaseLetterHTML(offerLetter, logoBase64);

    // // Launch Puppeteer
    // const browser = await puppeteer.launch({
    //   headless: true,
    //   executablePath: "/usr/bin/chromium", // Use the installed Chromium
    //   args: ["--no-sandbox", "--disable-setuid-sandbox"],
    // });

    // const page = await browser.newPage();
    // await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // const pdfBuffer = await page.pdf({
    //   format: "A4",
    //   margin: { top: "40px", bottom: "60px", left: "40px", right: "40px" },
    // });

    // await browser.close();
    // return Buffer.from(pdfBuffer);

    const options = {
      format: "A4",
      printBackground: true,
      displayHeaderFooter: false,
      margin: {
        top: "0mm",
        right: "0mm",
        bottom: "0mm",
        left: "0mm",
      },
      preferCSSPageSize: true,
      landscape: false,
    };

    const file = { content: htmlContent };
    const pdfBuffer: any = await htmlPdf.generatePdf(file, options);

    if (!pdfBuffer || pdfBuffer.length === 0) {
      throw new Error("Generated PDF is empty");
    }

    console.log(
      "PDF generated successfully with html-pdf-node, size:",
      pdfBuffer.length,
      "bytes"
    );
    return pdfBuffer;
  } catch (err) {
    console.error("PDF generation failed:", err);
    throw err;
  }
};
