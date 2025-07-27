import axios from "axios";
import { IOfferLetter } from "../../modules/offer-letter/offer-letter.interface";
import htmlPdf from "html-pdf-node";
import PDFDocument from "pdfkit";

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
			page-break-after: always;
		}

		.top-bar {
			position: absolute;
			top: 0;
			right: 0;
			width: 100%;
			height: 30px;
			background-color: #3b3b3b;
			clip-path: inset(0);
			z-index: 1;
		}

		.header {
			position: relative;
			height: 80px;
			margin-bottom: 20px;
			display: flex;
			align-items: center;
			justify-content: flex-start;
			padding-left: 40px;
		}

		.logo-text {
			position: absolute;
			top: 40px;
			left: 20px;
			font-size: 32px;
			font-weight: bold;
			text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
			z-index: 2;
		}

		.right-ribbon {
			position: absolute;
			top: 40px;
			right: 0;
			width: 250px;
			height: 40px;
			background-color: #3b3b3b;
			clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 20% 100%);
			z-index: 1;
		}

		.maroon-strip {
			background-color: #660505;
			color: white;
			width: 400px;
			padding: 30px 40px;
			clip-path: polygon(0 0, 80% 0, 100% 100%, 0 100%);
			font-size: 22px;
			font-weight: bold;
			margin-top: 20px;
		}

		.maroon-strip span {
			color: red;
		}

		.date {
			text-align: right;
			padding: 5px;
			font-weight: bold;
			font-size: 20px;
			color: red;
		}

		.content {
			padding: 30px;
			line-height: 1.2;
			font-size: 16px;
		}
		.stamp {
  margin-top: 30px;
}

.stamp img {
  width: 150px; /* Adjust size as needed */
  opacity: 0.8;
}

		table {
			width: 100%;
			border-collapse: collapse;
			margin-top: 20px;
		}

		table,
		th,
		td {
			border: 1px solid #000;
		}

		th,
		td {
			padding: 8px;
			text-align: center;
		}

		th {
			background-color: #f2f2f2;
		}

		.signature {
			margin-top: 50px;
		}
	</style>
</head>

<body>

	<div class="page">
		<div class="top-bar"></div>
		<div class="header">
			<div class="logo-text">WOODROCK SOFTONIC PVT LTD</div>
			<div class="right-ribbon"></div>
		</div>

		<div class="maroon-strip">
			Dear ${offerLetter.employeeName}</span>
		</div>

		<div class="date">
			Date: <span> ${offerLetter.offerLetterDate} </span>
		</div>

		<div class="content">
			<p>Congratulations! With reference to your application and subsequent interview with us we are pleased to
				offer you the position of Customer Care Executive with Woodrock Softonic Private Limited. Your beginning
				monthly remuneration will be INR  ${offerLetter.employeeCtc}/-</p>
			<p><strong>Shift Allocated:</strong> Full Time</p>
			<p><strong>Shift Timing Allocated:</strong> Flexible Timing</p>
			<p><strong>Reporting Timing:</strong> 20 mins before login</p>
			<p><strong>Joining Location:</strong> Kolkata</p>
			<p><strong>Venue Details:</strong> Work from office / Work from home</p>

			<p>The offer has been made based on information furnished by you. However, if there is a discrepancy in the
				copies of any document or certificate given by you as proof, we hold the rights to review the offer of
				employment.</p>

			<p>Employment as per this offer is subject to your being medically fit.</p>

			<p>Please sign and return duplicate copy of this letter in token of your acceptance.</p>

			<p>We congratulate you on your appointment and wish you a long and successful career with us. We are
				confident that your contribution will take us further in our journey towards becoming world leaders. We
				assure you of our support for your professional development and growth.</p>

			<p>We look forward to mutually rewarding term with us.</p>

			



			 <div
      style=" font-family: Arial, sans-serif; font-size: 14px; padding: 20px;"
    >
       <div class="signature">
          <p>Sincerely,</p>
          <img
            src="https://res.cloudinary.com/dri1mh3xh/image/upload/v1750698006/mhyrewrvtfgpqz21lfo7.jpg"
          />
          <p><strong>Simran Jha || HR Department</strong></p>
          <p><strong>Woodrock Softonic Pvt Ltd</strong></p>
          <p>Email:
            <a
              href="mailto:Simran.jha@woodrockgroup.in"
            >Simran.jha@woodrockgroup.in</a></p>
        </div>
    </div>
		</div>
	</div>

	<div class="page">
		<div class="top-bar"></div>
		<div class="header">
			<div class="logo-text">WOODROCK SOFTONIC PVT LTD</div>
			<div class="right-ribbon"></div>
		</div>

		<div class="content">
			<h3>Terms & Conditions:</h3>
			<ul>
				<li>Your attendance cycle will be calculated from 1st to 31st of every month. Your salary date will be
					15th of every month for the previous month.</li>
				<li>Training will be of 40 days which includes your On Job Training (OJT).</li>
				<li>Every employee will have their P tax deduction as per norm.</li>
				<li>Flexible shift timings may vary and are subject to change any time within a week.</li>
				<li>Unapproved leave or absenteeism may lead to salary hold.</li>
				<li>Company may modify policies as needed.</li>
				<li>Salary will be disbursed via Cheque/NEFT/IMPS.</li>
				<li>Probation period is 90 days.</li>
				<li>Absenteeism between 1st and 15th may lead to salary hold.</li>
				<li>Official job timing & working days will be informed by your Process Manager.</li>
				<li>Immediate termination may occur for performance or disciplinary issues.</li>
				<li>Minimum 30 working days required for first salary eligibility.</li>
				<li>30-day notice period mandatory for resignation; else dues will be forfeited.</li>
				<li>Strict late-coming policy; 3 lates = 1 day absent.</li>
			</ul>

			<h3>ZTE Policy:</h3>
			<table>
				<thead>
					<tr>
						<th>Parameter</th>
						<th>Target</th>
						<th>Consequence</th>
					</tr>
				</thead>
				<tbody>
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
						<td>Invalid/Forcefully Call disconnection</td>
						<td>0</td>
						<td>Separation under ZT</td>
					</tr>
				</tbody>
			</table>

			<p><strong>Note:</strong></p>
			<ul>
				<li>Salary for the month in which ZT violation occurred will not be disbursed.</li>
				<li>Release letter/experience certificate will not be issued for ZT terminations.</li>
			</ul>

			<h3>Uninformed Leave (UL) Policy:</h3>
			<ul>
				<li>Absence without prior approval will be treated as Uninformed Leave (UL).</li>
				<li>Each UL results in 2 days of Loss of Pay (LOP). Repeated ULs may lead to disciplinary action.</li>
			</ul>

			<div class="signature">
				<p>I, <strong> ${offerLetter.employeeName}</strong>, hereby accept the offer & agree totally to the terms & conditions.</p>
				<p>Employee Signature: _______</p>
			</div>
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

    // Launch Puppeteer
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

// Download image from URL and convert to buffer
async function downloadImage(url: string): Promise<Buffer | null> {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    return Buffer.from(response.data);
  } catch (error) {
    console.error("Failed to download image:", error);
    return null;
  }
}

// Helper method to create table
function createTable(
  doc: PDFKit.PDFDocument,
  x: number,
  y: number,
  data: string[][]
) {
  const cellWidth = 175;
  const cellHeight = 20;

  data.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      const cellX = x + cellIndex * cellWidth;
      const cellY = y + rowIndex * cellHeight;

      // Draw cell border
      doc.rect(cellX, cellY, cellWidth, cellHeight).stroke("#000000");

      // Fill header row
      if (rowIndex === 0) {
        doc.rect(cellX, cellY, cellWidth, cellHeight).fill("#f2f2f2");
      }

      // Add text
      doc
        .fillColor("#000000")
        .fontSize(9)
        .font(rowIndex === 0 ? "Helvetica-Bold" : "Helvetica")
        .text(cell, cellX + 5, cellY + 6, {
          width: cellWidth - 10,
          align: "center",
          lineBreak: false,
        });
    });
  });
}

// Create Page 1 - Main Offer Letter
async function createPage1(
  doc: PDFKit.PDFDocument,
  offerLetter: IOfferLetter,
  signatureBuffer: Buffer | null
) {
  const pageWidth = 595.28; // A4 width in points
  const pageHeight = 841.89; // A4 height in points

  // Top dark bar
  doc.rect(0, 0, pageWidth, 25).fill("#3b3b3b");

  // Company name header
  doc
    .fillColor("#000000")
    .fontSize(24)
    .font("Helvetica-Bold")
    .text("WOODROCK SOFTONIC PVT LTD", 20, 45);

  // Right ribbon effect (simulated with a rectangle)
  doc.rect(pageWidth - 200, 35, 200, 30).fill("#3b3b3b");

  // Maroon strip with employee name
  doc.rect(0, 100, 320, 50).fill("#660505");

  doc
    .fillColor("#ffffff")
    .fontSize(18)
    .font("Helvetica-Bold")
    .text(`Dear ${offerLetter.employeeName}`, 30, 118);

  // Date section
  doc
    .fillColor("#ff0000")
    .fontSize(16)
    .font("Helvetica-Bold")
    .text(`Date: ${offerLetter.offerLetterDate}`, pageWidth - 200, 170, {
      align: "right",
    });

  // Main content
  doc
    .fillColor("#000000")
    .fontSize(12)
    .font("Helvetica")
    .text(
      "Congratulations! With reference to your application and subsequent interview with us we are pleased to offer you the position of Customer Care Executive with Woodrock Softonic Private Limited. Your beginning monthly remuneration will be INR " +
        offerLetter.employeeCtc +
        "/-",
      30,
      210,
      { width: 535, lineGap: 3 }
    );

  // Job details section
  let yPosition = 270;
  const jobDetails = [
    "Shift Allocated: Full Time",
    "Shift Timing Allocated: Flexible Timing",
    "Reporting Timing: 20 mins before login",
    "Joining Location: Kolkata",
    "Venue Details: Work from office / Work from home",
  ];

  doc.font("Helvetica-Bold");
  jobDetails.forEach((detail) => {
    const [label, value] = detail.split(": ");
    doc
      .font("Helvetica-Bold")
      .text(label + ":", 30, yPosition, { continued: true })
      .font("Helvetica")
      .text(" " + value);
    yPosition += 20;
  });

  // Additional terms
  yPosition += 10;
  doc
    .font("Helvetica")
    .text(
      "The offer has been made based on information furnished by you. However, if there is a discrepancy in the copies of any document or certificate given by you as proof, we hold the rights to review the offer of employment.",
      30,
      yPosition,
      { width: 535, lineGap: 3 }
    );

  yPosition += 40;
  doc.text(
    "Employment as per this offer is subject to your being medically fit.",
    30,
    yPosition,
    { width: 535 }
  );

  yPosition += 30;
  doc.text(
    "Please sign and return duplicate copy of this letter in token of your acceptance.",
    30,
    yPosition,
    { width: 535 }
  );

  yPosition += 30;
  doc.text(
    "We congratulate you on your appointment and wish you a long and successful career with us. We are confident that your contribution will take us further in our journey towards becoming world leaders. We assure you of our support for your professional development and growth.",
    30,
    yPosition,
    { width: 535, lineGap: 3 }
  );

  yPosition += 60;
  doc.text(
    "We look forward to mutually rewarding term with us.",
    30,
    yPosition,
    { width: 535 }
  );

  // Signature section
  yPosition += 60;
  doc.text("Sincerely,", 30, yPosition);

  // Add signature image if available
  if (signatureBuffer) {
    try {
      doc.image(signatureBuffer, 30, yPosition + 20, {
        width: 120,
        height: 60,
      });
      yPosition += 90;
    } catch (error) {
      console.error("Failed to add signature image:", error);
      yPosition += 30;
    }
  } else {
    yPosition += 30;
  }

  doc.font("Helvetica-Bold").text("Simran Jha || HR Department", 30, yPosition);

  yPosition += 18;
  doc.text("Woodrock Softonic Pvt Ltd", 30, yPosition);

  yPosition += 18;
  doc
    .font("Helvetica")
    .fillColor("#0000ff")
    .text("Email: Simran.jha@woodrockgroup.in", 30, yPosition);
}

// Create Page 2 - Terms & Conditions
async function createPage2(doc: PDFKit.PDFDocument, offerLetter: IOfferLetter) {
  const pageWidth = 595.28;

  // Top dark bar
  doc.rect(0, 0, pageWidth, 25).fill("#3b3b3b");

  // Company name header
  doc
    .fillColor("#000000")
    .fontSize(24)
    .font("Helvetica-Bold")
    .text("WOODROCK SOFTONIC PVT LTD", 20, 45);

  // Right ribbon effect
  doc.rect(pageWidth - 200, 35, 200, 30).fill("#3b3b3b");

  // Terms & Conditions heading
  doc
    .fillColor("#000000")
    .fontSize(16)
    .font("Helvetica-Bold")
    .text("Terms & Conditions:", 30, 100);

  // Terms list
  const terms = [
    "Your attendance cycle will be calculated from 1st to 31st of every month. Your salary date will be 15th of every month for the previous month.",
    "Training will be of 40 days which includes your On Job Training (OJT).",
    "Every employee will have their P tax deduction as per norm.",
    "Flexible shift timings may vary and are subject to change any time within a week.",
    "Unapproved leave or absenteeism may lead to salary hold.",
    "Company may modify policies as needed.",
    "Salary will be disbursed via Cheque/NEFT/IMPS.",
    "Probation period is 90 days.",
    "Absenteeism between 1st and 15th may lead to salary hold.",
    "Official job timing & working days will be informed by your Process Manager.",
    "Immediate termination may occur for performance or disciplinary issues.",
    "Minimum 30 working days required for first salary eligibility.",
    "30-day notice period mandatory for resignation; else dues will be forfeited.",
    "Strict late-coming policy; 3 lates = 1 day absent.",
  ];

  let yPosition = 130;
  doc.fontSize(10).font("Helvetica");

  terms.forEach((term, index) => {
    doc.text(`• ${term}`, 35, yPosition, { width: 525, lineGap: 2 });
    yPosition += 20;
  });

  // ZTE Policy heading
  yPosition += 20;
  doc.fontSize(14).font("Helvetica-Bold").text("ZTE Policy:", 30, yPosition);

  // ZTE Policy table
  yPosition += 25;
  createTable(doc, 30, yPosition, [
    ["Parameter", "Target", "Consequence"],
    ["CMB", "0", "Separation under ZT"],
    ["CNR", "0", "Separation under ZT"],
    ["Rude/Sarcastic Call", "0", "Separation under ZT"],
    ["Re-Assignment Case", "0", "Separation under ZT"],
    ["Invalid/Forcefully Call disconnection", "0", "Separation under ZT"],
  ]);

  yPosition += 140;

  // Note section
  doc.fontSize(12).font("Helvetica-Bold").text("Note:", 30, yPosition);

  yPosition += 20;
  doc
    .fontSize(10)
    .font("Helvetica")
    .text(
      "• Salary for the month in which ZT violation occurred will not be disbursed.",
      35,
      yPosition,
      { width: 525 }
    );

  yPosition += 15;
  doc.text(
    "• Release letter/experience certificate will not be issued for ZT terminations.",
    35,
    yPosition,
    { width: 525 }
  );

  // Uninformed Leave Policy
  yPosition += 30;
  doc
    .fontSize(14)
    .font("Helvetica-Bold")
    .text("Uninformed Leave (UL) Policy:", 30, yPosition);

  yPosition += 20;
  doc
    .fontSize(10)
    .font("Helvetica")
    .text(
      "• Absence without prior approval will be treated as Uninformed Leave (UL).",
      35,
      yPosition,
      { width: 525 }
    );

  yPosition += 15;
  doc.text(
    "• Each UL results in 2 days of Loss of Pay (LOP). Repeated ULs may lead to disciplinary action.",
    35,
    yPosition,
    { width: 525 }
  );

  // Employee acceptance signature
  yPosition += 50;
  doc
    .fontSize(12)
    .font("Helvetica")
    .text(
      `I, ${offerLetter.employeeName}, hereby accept the offer & agree totally to the terms & conditions.`,
      30,
      yPosition,
      { width: 535 }
    );

  yPosition += 30;
  doc.text("Employee Signature: _______________________", 30, yPosition);
}

// Main function to generate PDF from offer letter data
export async function generateOfferLetterPDFByPdfKIt(
  offerLetter: IOfferLetter
): Promise<Buffer> {
  try {
    return new Promise(async (resolve, reject) => {
      const doc = new PDFDocument({
        size: "A4",
        margin: 0,
        bufferPages: true,
      });

      const buffer: Uint8Array[] = [];
      doc.on("data", (chunk) => buffer.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffer)));
      doc.on("error", (err) => reject(err));

      // Download signature image
      const signatureBuffer = await downloadImage(
        "https://res.cloudinary.com/dri1mh3xh/image/upload/v1750698006/mhyrewrvtfgpqz21lfo7.jpg"
      );

      // PAGE 1 - Main Offer Letter
      await createPage1(doc, offerLetter, signatureBuffer);

      // PAGE 2 - Terms & Conditions
      doc.addPage();
      await createPage2(doc, offerLetter);

      doc.end();
    });
  } catch (error: any) {
    console.error("PDF creation error:", error);
    throw new Error(`PDF creation failed: ${error.message}`);
  }
}
