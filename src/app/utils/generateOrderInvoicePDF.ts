import PDFDocument from "pdfkit";
import { IOrder } from "../modules/order/order.interface";
import axios from "axios";
import { IOfferLetter } from "../modules/offer-letter/offer-letter.interface";

import puppeteer from "puppeteer";
import { IPaySlip } from "../modules/payslip/payslip.interface";
/**
 * Generates a PDF invoice for an order.
 * @param {IOrder} order - The order object to generate the invoice for.
 * @returns {Promise<Buffer>} - The generated PDF as a Buffer.
 */
export const generateOrderInvoicePDF = async (
  order: IOrder
): Promise<Buffer> => {
  return new Promise<Buffer>(async (resolve, reject) => {
    try {
      const logoUrl =
        "https://res.cloudinary.com/dbgrq28js/image/upload/v1736763971/logoipsum-282_ilqjfb_paw4if.png";
      // Download the logo image as a buffer
      const response = await axios.get(logoUrl, {
        responseType: "arraybuffer",
      });
      const logoBuffer = Buffer.from(response.data);

      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];
      //@ts-ignore
      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (err: Error) => reject(err));

      // Header with graphical design and logo
      const logoWidth = 70; // Set the desired width for the logo
      const logoX = (doc.page.width - logoWidth) / 2; // Center the logo
      doc.image(logoBuffer, logoX, doc.y, { width: logoWidth });
      doc.moveDown(6); // Move down after the logo

      doc
        .fontSize(20)
        .font("Helvetica-Bold")
        .fillColor("#000000")
        .text("NextMert", { align: "center" });
      doc
        .fontSize(10)
        .text("Level-4, 34, Awal Centre, Banani, Dhaka", { align: "center" });
      doc.fontSize(10).text("Email: support@nextmert.com", { align: "center" });
      doc.fontSize(10).text("Phone: + 06 223 456 678", { align: "center" });
      doc.moveDown(0.5);
      doc
        .fontSize(15)
        .font("Helvetica-Bold")
        .fillColor("#003366")
        .text("Invoice", { align: "center" });
      doc.lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke(); // Horizontal line under header
      doc.moveDown(0.5);

      // Invoice Details
      doc.fontSize(11).fillColor("#000000").text(`Invoice ID: ${order._id}`);
      doc.text(`Order Date: ${(order.createdAt as Date).toLocaleDateString()}`);
      doc.moveDown(0.5);
      //@ts-ignore
      doc.text(`Customer Name: ${order.user.name}`);
      doc.text(`Shipping Address: ${order.shippingAddress}`);
      doc.moveDown(1);

      // Payment Details with graphical design
      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .fillColor("#003366")
        .text("Payment Details:", { underline: true });
      doc.text(`Payment Status: ${order.paymentStatus}`);
      doc.text(`Payment Method: ${order.paymentMethod}`);
      doc.moveDown(1);
      // doc.lineWidth(0.5).moveTo(50, doc.y).lineTo(550, doc.y).stroke();  // Horizontal line

      // // Order Products in a table format
      // doc.moveDown(2);
      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .fillColor("#003366")
        .text("Order Products:", { underline: true });
      doc.moveDown(1);

      const tableTop = doc.y;
      const tableHeight = 20;

      // Table Headers for Products (Bold and Colored)
      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .fillColor("#003366")
        .text("Product Name", 50, tableTop);
      doc.text("Quantity", 300, tableTop);
      doc.text("Price", 450, tableTop);

      doc
        .lineWidth(0.5)
        .moveTo(50, tableTop + tableHeight)
        .lineTo(550, tableTop + tableHeight)
        .stroke(); // Table header line
      let currentY = tableTop + tableHeight + 5;

      // Order Products (Normal text, not bold)
      order.products.forEach((item) => {
        //@ts-ignore
        const productName = item.product?.name || "Unknown Product";
        const quantity = item.quantity;
        //@ts-ignore
        const price = item.unitPrice * quantity || 0;

        doc
          .fontSize(11)
          .fillColor("#000000")
          .text(productName, 50, currentY, { width: 130, align: "left" });
        doc.text(quantity.toString(), 280, currentY, {
          width: 90,
          align: "center",
        });
        doc.text(price.toFixed(2), 400, currentY, {
          width: 90,
          align: "right",
        });
        currentY += tableHeight;
      });

      // Final Table Border
      doc.lineWidth(0.5).moveTo(50, currentY).lineTo(550, currentY).stroke();

      doc.moveDown(2);

      const pricingTableTop = doc.y;

      // Table Headers for Pricing (Bold and Colored)
      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .fillColor("#003366")
        .text("Description", 50, pricingTableTop);
      doc.text("Amount", 450, pricingTableTop);

      doc
        .lineWidth(0.5)
        .moveTo(50, pricingTableTop + tableHeight)
        .lineTo(550, pricingTableTop + tableHeight)
        .stroke(); // Pricing header line
      let pricingY = pricingTableTop + tableHeight + 5;

      // Pricing Breakdown (Normal text, not bold)
      doc
        .fontSize(11)
        .fillColor("#000000")
        .text("Sub Total", 50, pricingY, { width: 200 });
      doc.text(`${order.totalAmount.toFixed(2)} /-`, 400, pricingY, {
        width: 90,
        align: "right",
      });
      pricingY += tableHeight;

      doc
        .fontSize(11)
        .fillColor("#000000")
        .text("Discount", 50, pricingY, { width: 200 });
      doc.text(`-${order.discount.toFixed(2)} /-`, 400, pricingY, {
        width: 90,
        align: "right",
      });
      pricingY += tableHeight;

      doc
        .fontSize(11)
        .fillColor("#000000")
        .text("Delivery Charge", 50, pricingY, { width: 200 });
      doc.text(`${order.deliveryCharge.toFixed(2)} /-`, 400, pricingY, {
        width: 90,
        align: "right",
      });
      pricingY += tableHeight;

      // Final Amount (Bold and Color)
      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .fillColor("#003366")
        .text("Total", 50, pricingY, { width: 200 });
      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .fillColor("#003366")
        .text(`${order.finalAmount.toFixed(2)} /-`, 400, pricingY, {
          width: 90,
          align: "right",
        });
      pricingY += tableHeight;

      // Final Pricing Table Border
      doc.lineWidth(0.5).moveTo(50, pricingY).lineTo(550, pricingY).stroke();

      doc.moveDown(3);
      doc.fontSize(9).text("Thank you for shopping!");
      doc
        .fontSize(9)
        .fillColor("#003366")
        .text("-NextMert", { align: "center" });
      // Finalize the document
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
export const generateOfferLetterHTML = (
  offerLetter: IOfferLetter,
  logoBase64: string
): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Offer Letter - Woodrock Softonic Pvt Ltd</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
      line-height: 1.6;
      color: #333;
    }
    .letter {
      max-width: 800px;
      margin: auto;
      padding: 20px;
      border: 1px solid #ccc;
    }
    .header, .footer {
      text-align: center;
    }
    .section-title {
      font-weight: bold;
      margin-top: 20px;
      text-decoration: underline;
    }
    .terms, .zte-policy, .ul-policy {
      font-size: 0.95em;
    }
    ul {
      padding-left: 20px;
    }
    .signature {
      margin-top: 40px;
    }
  </style>
</head>
<body>
  <div class="letter">
    <div class="header">
      <h2>WOODROCK SOFTONIC PVT LTD</h2>
    </div>

    <p>DEAR  ${offerLetter.employeeName}</p>
    <p style="text-align:right;">Date: 09-06-2025</p>

    <p>Congratulations! With reference to your application and subsequent interview with us, we are pleased to offer you the position of <strong>${offerLetter.employeeDesignation}</strong> with Woodrock Softonic Private Limited. Your beginning monthly remuneration will be <strong>INR ${offerLetter.employeeCtc} /-</strong>.</p>

    <ul>
      <li>Shift Allocated: Full Time</li>
      <li>Shift Timing Allocated: Flexible Timing</li>
      <li>Reporting Timing: 20 mins before login</li>
      <li>Joining Location: Kolkata</li>
      <li>Venue Details: Work from office / Work from home</li>
    </ul>

    <p>The offer has been made based on information furnished by you. However, if there is a discrepancy in any document or certificate provided by you as proof, we reserve the right to review the offer of employment. Employment as per this offer is subject to your being medically fit.</p>

    <p>Please sign and return a duplicate copy of this letter in token of your acceptance. We congratulate you on your appointment and wish you a long and successful career with us. We are confident that your contribution will take us further in our journey towards becoming world leaders. We assure you of our support for your professional development and growth. We look forward to a mutually rewarding term with us.</p>

    <p>Regards,<br>Simran Jha || HR Department<br>Woodrock Softonic Private Limited<br>Mail: Simran.jha@woodrockgroup.in</p>

    <div class="section-title">Terms & Conditions</div>
    <div class="terms">
      <ul>
        <li>Attendance cycle: 1st to 31st, salary date: 15th of next month.</li>
        <li>Training: 40 days including OJT.</li>
        <li>P tax deduction as per norms.</li>
        <li>Flexible shift allocation, no fixed timing.</li>
        <li>Unapproved leave/absenteeism: salary may be held.</li>
        <li>Salary through Cheque / NEFT / IMPS.</li>
        <li>Probation period: 90 days.</li>
        <li>Absenteeism between 1st to 15th: salary hold until rejoining + fortnight work.</li>
        <li>Termination: Immediate for performance/disciplinary issues.</li>
        <li>Resignation: 30 days’ notice required or no dues/documents released.</li>
        <li>Late coming: 3 lates = 1 day absent.</li>
      </ul>
    </div>

    <div class="section-title">ZTE Policy</div>
    <div class="zte-policy">
      <table border="1" cellspacing="0" cellpadding="5">
        <tr>
          <th>Parameter</th>
          <th>Target</th>
          <th>Consequence</th>
        </tr>
        <tr>
          <td>CMB</td>
          <td>0</td>
          <td>Separation under ZT</td>
        </tr>
        <tr>
          <td>CNR</td>
          <td>0</td>
          <td>Separation under ZT</td>
        </tr>
        <tr>
          <td>Rude/Sarcastic Call</td>
          <td>0</td>
          <td>Separation under ZT</td>
        </tr>
        <tr>
          <td>Re-Assignment Case</td>
          <td>0</td>
          <td>Separation under ZT</td>
        </tr>
        <tr>
          <td>Invalid/Forceful Call Disconnection</td>
          <td>0</td>
          <td>Separation under ZT</td>
        </tr>
      </table>
      <p>Salary for the month with ZT violation will not be processed. No release letter/experience certificate for ZT cases.</p>
    </div>

    <div class="section-title">Uninformed Leave (UL) Policy</div>
    <div class="ul-policy">
      <p>Each uninformed leave: 2 days Loss of Pay (LOP). Repeated ULs may lead to disciplinary action.</p>
    </div>

    <div class="signature">
      <p>I ${offerLetter.employeeName}, hereby accept the offer & agree totally to the terms & conditions.</p>
      <p>Employee Signature: ___________________</p>
    </div>
  </div>
</body>
</html>
`;
};

export const generatePayslipHTML = (
  offerLetter: IPaySlip,
  logoBase64: string
): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Offer Letter - Woodrock Softonic Pvt Ltd</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
      line-height: 1.6;
      color: #333;
    }
    .letter {
      max-width: 800px;
      margin: auto;
      padding: 20px;
      border: 1px solid #ccc;
    }
    .header, .footer {
      text-align: center;
    }
    .section-title {
      font-weight: bold;
      margin-top: 20px;
      text-decoration: underline;
    }
    .terms, .zte-policy, .ul-policy {
      font-size: 0.95em;
    }
    ul {
      padding-left: 20px;
    }
    .signature {
      margin-top: 40px;
    }
  </style>
</head>
<body>
  <div class="letter">
    <div class="header">
      <h2>WOODROCK SOFTONIC PVT LTD</h2>
    </div>

    <p>DEAR  ${offerLetter.employeeName}</p>
    <p style="text-align:right;">Date: 09-06-2025</p>

    <p>Congratulations! With reference to your application and subsequent interview with us, we are pleased to offer you the position of <strong>${offerLetter.employeeDesignation}</strong> with Woodrock Softonic Private Limited. Your beginning monthly remuneration will be <strong>INR ${offerLetter.basicSalary} /-</strong>.</p>

    <ul>
      <li>Shift Allocated: Full Time</li>
      <li>Shift Timing Allocated: Flexible Timing</li>
      <li>Reporting Timing: 20 mins before login</li>
      <li>Joining Location: Kolkata</li>
      <li>Venue Details: Work from office / Work from home</li>
    </ul>

    <p>The offer has been made based on information furnished by you. However, if there is a discrepancy in any document or certificate provided by you as proof, we reserve the right to review the offer of employment. Employment as per this offer is subject to your being medically fit.</p>

    <p>Please sign and return a duplicate copy of this letter in token of your acceptance. We congratulate you on your appointment and wish you a long and successful career with us. We are confident that your contribution will take us further in our journey towards becoming world leaders. We assure you of our support for your professional development and growth. We look forward to a mutually rewarding term with us.</p>

    <p>Regards,<br>Simran Jha || HR Department<br>Woodrock Softonic Private Limited<br>Mail: Simran.jha@woodrockgroup.in</p>

    <div class="section-title">Terms & Conditions</div>
    <div class="terms">
      <ul>
        <li>Attendance cycle: 1st to 31st, salary date: 15th of next month.</li>
        <li>Training: 40 days including OJT.</li>
        <li>P tax deduction as per norms.</li>
        <li>Flexible shift allocation, no fixed timing.</li>
        <li>Unapproved leave/absenteeism: salary may be held.</li>
        <li>Salary through Cheque / NEFT / IMPS.</li>
        <li>Probation period: 90 days.</li>
        <li>Absenteeism between 1st to 15th: salary hold until rejoining + fortnight work.</li>
        <li>Termination: Immediate for performance/disciplinary issues.</li>
        <li>Resignation: 30 days’ notice required or no dues/documents released.</li>
        <li>Late coming: 3 lates = 1 day absent.</li>
      </ul>
    </div>

    <div class="section-title">ZTE Policy</div>
    <div class="zte-policy">
      <table border="1" cellspacing="0" cellpadding="5">
        <tr>
          <th>Parameter</th>
          <th>Target</th>
          <th>Consequence</th>
        </tr>
        <tr>
          <td>CMB</td>
          <td>0</td>
          <td>Separation under ZT</td>
        </tr>
        <tr>
          <td>CNR</td>
          <td>0</td>
          <td>Separation under ZT</td>
        </tr>
        <tr>
          <td>Rude/Sarcastic Call</td>
          <td>0</td>
          <td>Separation under ZT</td>
        </tr>
        <tr>
          <td>Re-Assignment Case</td>
          <td>0</td>
          <td>Separation under ZT</td>
        </tr>
        <tr>
          <td>Invalid/Forceful Call Disconnection</td>
          <td>0</td>
          <td>Separation under ZT</td>
        </tr>
      </table>
      <p>Salary for the month with ZT violation will not be processed. No release letter/experience certificate for ZT cases.</p>
    </div>

    <div class="section-title">Uninformed Leave (UL) Policy</div>
    <div class="ul-policy">
      <p>Each uninformed leave: 2 days Loss of Pay (LOP). Repeated ULs may lead to disciplinary action.</p>
    </div>

    <div class="signature">
      <p>I ${offerLetter.employeeName}, hereby accept the offer & agree totally to the terms & conditions.</p>
      <p>Employee Signature: ___________________</p>
    </div>
  </div>
</body>
</html>
`;
};
export const generateOfferLetterPDF = async (
  offerLetter: IOfferLetter
): Promise<Buffer> => {
  try {
    // Fetch logo and convert to base64
    const logoUrl =
      "https://media.cakeresume.com/image/upload/s--k9CQtNTA--/c_pad,fl_png8,h_400,w_400/v1691154551/e6idc2sh97xdrmuafkp7.png";
    const response = await axios.get(logoUrl, { responseType: "arraybuffer" });
    const logoBase64 = Buffer.from(response.data).toString("base64");

    const htmlContent = generateOfferLetterHTML(offerLetter, logoBase64);

    // Launch Puppeteer and generate PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: { top: "40px", bottom: "60px", left: "40px", right: "40px" },
    });

    await browser.close();
    return Buffer.from(pdfBuffer);
  } catch (err) {
    throw err;
  }
};

export const generatePayslipPDF = async (
  offerLetter: IPaySlip
): Promise<Buffer> => {
  try {
    // Fetch logo and convert to base64
    const logoUrl =
      "https://media.cakeresume.com/image/upload/s--k9CQtNTA--/c_pad,fl_png8,h_400,w_400/v1691154551/e6idc2sh97xdrmuafkp7.png";
    const response = await axios.get(logoUrl, { responseType: "arraybuffer" });
    const logoBase64 = Buffer.from(response.data).toString("base64");

    const htmlContent = generatePayslipHTML(offerLetter, logoBase64);

    // Launch Puppeteer and generate PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: { top: "40px", bottom: "60px", left: "40px", right: "40px" },
    });

    await browser.close();
    return Buffer.from(pdfBuffer);
  } catch (err) {
    throw err;
  }
};

// export const generateOfferLetterPDF = async (
//   offerLetter: IOfferLetter
// ): Promise<Buffer> => {
//   return new Promise<Buffer>(async (resolve, reject) => {
//     try {
//       // Fetch company logo
//       const logoUrl =
//         "https://media.cakeresume.com/image/upload/s--k9CQtNTA--/c_pad,fl_png8,h_400,w_400/v1691154551/e6idc2sh97xdrmuafkp7.png";
//       // Download the logo image as a buffer
//       const response = await axios.get(logoUrl, {
//         responseType: "arraybuffer",
//       });
//       //   const logoBuffer = Buffer.from(response.data);
//       //   const response = await axios.get(offerLetter.companyLogo, {
//       //     responseType: "arraybuffer",
//       //   });
//       const logoBuffer = Buffer.from(response.data);

//       const doc = new PDFDocument({ margin: 50 });
//       const buffers: Buffer[] = [];

//       doc.on("data", (chunk) => buffers.push(chunk));
//       doc.on("end", () => resolve(Buffer.concat(buffers)));
//       doc.on("error", (err: Error) => reject(err));

//       // Company Logo
//       const logoWidth = 80;
//       const logoX = (doc.page.width - logoWidth) / 2;
//       doc.image(logoBuffer, logoX, doc.y, { width: logoWidth });
//       doc.moveDown(2);

//       // Title
//       doc
//         .fontSize(18)
//         .font("Helvetica-Bold")
//         .fillColor("#003366")
//         .text("Offer Letter", { align: "center" });
//       doc.moveDown(1);

//       // Date
//       doc
//         .fontSize(12)
//         .fillColor("black")
//         .text(`Date: ${offerLetter.offerLetterDate}`);
//       doc.moveDown(1);

//       // Employee Details
//       doc.text(`To,`);
//       doc.text(`${offerLetter.employeeName}`);
//       doc.text(`${offerLetter.employeeAddress}`);
//       doc.moveDown(1);

//       doc.text(`Subject: Offer of Employment`);
//       doc.moveDown(1);

//       // Body
//       doc
//         .font("Helvetica")
//         .text(
//           `Dear ${offerLetter.employeeName},\n\nWe are pleased to offer you the position of ${offerLetter.employeeDesignation} at ${offerLetter.companyName}. ` +
//             `Your joining date will be ${offerLetter.employeeDateOfJoin}, and your total annual CTC will be ₹${offerLetter.employeeCtc}.\n\n` +
//             `This position will be based at our office located at ${offerLetter.companyAddress}. Please report to ${offerLetter.companyContactName}, ` +
//             `${offerLetter.companyPersonTitle}, on your first day. You may contact them at ${offerLetter.companyContactNumber} or ` +
//             `${offerLetter.companyPersonalEmail} for any further details.\n\n` +
//             `We are excited to have you join our team and look forward to a mutually beneficial relationship.\n\n` +
//             `Sincerely,\n\n${offerLetter.companyContactName}\n${offerLetter.companyPersonTitle}\n${offerLetter.companyName}`
//         );

//       doc.moveDown(3);
//       doc
//         .fontSize(10)
//         .fillColor("#888888")
//         .text(
//           "This is a system-generated letter and does not require a signature.",
//           { align: "center" }
//         );

//       doc.end();
//     } catch (err) {
//       reject(err);
//     }
//   });
// };
