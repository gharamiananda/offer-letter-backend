import axios from "axios";
import { IOfferLetter } from "../../modules/offer-letter/offer-letter.interface";

import puppeteer from "puppeteer";
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
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.CHROME_BIN || undefined,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: { top: "40px", bottom: "60px", left: "40px", right: "40px" },
    });

    await browser.close();
    return Buffer.from(pdfBuffer);
  } catch (err) {
    console.error("PDF generation failed:", err);
    throw err;
  }
};
