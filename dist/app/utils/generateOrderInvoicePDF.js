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
exports.generatePayslipPDF = exports.generateOfferLetterPDF = exports.generatePayslipHTML = exports.generateOfferLetterHTML = exports.generateOrderInvoicePDF = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const axios_1 = __importDefault(require("axios"));
/**
 * Generates a PDF invoice for an order.
 * @param {IOrder} order - The order object to generate the invoice for.
 * @returns {Promise<Buffer>} - The generated PDF as a Buffer.
 */
const generateOrderInvoicePDF = (order) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const logoUrl = "https://res.cloudinary.com/dbgrq28js/image/upload/v1736763971/logoipsum-282_ilqjfb_paw4if.png";
            // Download the logo image as a buffer
            const response = yield axios_1.default.get(logoUrl, {
                responseType: "arraybuffer",
            });
            const logoBuffer = Buffer.from(response.data);
            const doc = new pdfkit_1.default({ margin: 50 });
            const buffers = [];
            //@ts-ignore
            doc.on("data", (chunk) => buffers.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(buffers)));
            doc.on("error", (err) => reject(err));
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
            doc.text(`Order Date: ${order.createdAt.toLocaleDateString()}`);
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
                var _a;
                //@ts-ignore
                const productName = ((_a = item.product) === null || _a === void 0 ? void 0 : _a.name) || "Unknown Product";
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
        }
        catch (err) {
            reject(err);
        }
    }));
});
exports.generateOrderInvoicePDF = generateOrderInvoicePDF;
const generateOfferLetterHTML = (offerLetter, logoBase64) => {
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
exports.generateOfferLetterHTML = generateOfferLetterHTML;
const generatePayslipHTML = (offerLetter, logoBase64) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    return `
 <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Salary Slip - ${offerLetter.month} ${offerLetter.year}</title>
 <style>
    body {
      font-family: Arial, sans-serif;
      margin:0px;
      margin-bottom:20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      padding:0px 40px;
    }
    th, td {
      border: 1px solid #333;
      padding: 6px 10px;
      text-align: left;
    }
    .header {
      background-color: brown;
      text-align: center;
      font-weight: bold;
      font-size: 18px;
    }
    .sub-header {
      text-align: center;
      font-size: 14px;
    }
    .pay-slip-title {
      text-align: center;
      font-weight: bold;
    }
    .highlight {
      color: red;
      font-weight: bold;
    }
    .earnings-header {
      background-color: rgb(152, 251, 152);
      font-weight: bold;
    }
    .gross-total {
      background-color: rgb(152, 251, 152);
      font-weight: bold;
    }
    .net-pay {
      background-color:rgb(152, 251, 152);
      font-weight: bold;
      text-align: center;
      font-size: 16px;
    }
    .footer {
      text-align: center;
      font-style: italic;
      margin-top: 10px;
    }
  </style>
</head>
<body>
 <img 
      src="https://res.cloudinary.com/dri1mh3xh/image/upload/v1750060932/vqqwphzjqzft8u5evzdh.png" 
      alt="Woodrock Logo Left"
      style="height: 160px;  object-fit: cover; width:100%; margin-bottom:20px"
    >
    
<div class="container" style="padding:0px 40px">
  <table>
    <tr>
      <td colspan="4" class="header">WOODROCK SOFTONIC PVT LTD</td>
    </tr>
    <tr>
      <td colspan="4" class="sub-header">FITWAY ENCLAVE DN 12, STREET NO 18, SECTOR 5, KOLKATA - 700091</td>
    </tr>
    <tr>
      <td colspan="4" class="pay-slip-title">Pay Slip <span class=""> ${offerLetter.month}</span></td>
    </tr>
    <tr>
      <th>Employee Name</th>
      <td class=""> ${offerLetter.employeeName}</td>
      <th>Salary Of Employee</th>
      <td> ${offerLetter.salaryOfEmployee}</td>
    </tr>
    <tr>
      <th>Employee ID</th>
      <td class=""> ${offerLetter.employeeId}</td>
      <th>Total Working Days</th>
      <td> ${offerLetter.totalWorkingDays}</td>
    </tr>
    <tr>
      <th>Designation</th>
      <td> ${offerLetter.employeeDesignation}</td>
      <th>Total Present Days</th>
      <td class=""> ${offerLetter.totalPresentDays}</td>
    </tr>
    <tr>
      <th>Department</th>
      <td> ${offerLetter.employeeDepartment}</td>
      <th>Total Absent</th>
      <td class=""> ${(_a = offerLetter.totalAbsent) !== null && _a !== void 0 ? _a : 0}</td>
    </tr>
    <tr>
      <th>UAN NO</th>
      <td>0</td>
      <th>Uninformed Leaves</th>
      <td class=""> ${(_b = offerLetter.uninformedLeaves) !== null && _b !== void 0 ? _b : 0}</td>
    </tr>
    <tr>
      <th>Incentives</th>
      <td> ${offerLetter.incentives ? offerLetter.incentives : 0}</td>
      <th>OT</th>
      <td class="">  ${offerLetter.OT ? offerLetter.OT : 0}</td>
    </tr>
    <tr>
      <th>ESI NO</th>
      <td>0</td>
      <th>Half day</th>
      <td class=""> ${(_c = offerLetter.halfDay) !== null && _c !== void 0 ? _c : 0}</td>
    </tr>
    <tr>
      <th colspan="3">Calculated Salary</th>
      <td>₹${offerLetter === null || offerLetter === void 0 ? void 0 : offerLetter.calculatedSalary}</td>
    </tr>
    <tr class="earnings-header">
      <td colspan="2">Earnings</td>
      <td colspan="2">Deductions</td>
    </tr>
    <tr>
      <td>Basic Salary</td>
      <td class="">₹${(_d = offerLetter.basicSalary) !== null && _d !== void 0 ? _d : 0}</td>
      <td>EPF</td>
      <td>₹0</td>
    </tr>
    <tr>
      <td>House Rent Allowances</td>
      <td class="">₹${(_e = offerLetter.houseRentAllowance) !== null && _e !== void 0 ? _e : 0}</td>
      <td>ESI</td>
      <td>₹0</td>
    </tr>
    <tr>
      <td>Conveyance Allowances</td>
      <td class="">₹ ${(_f = offerLetter.conveyanceAllowance) !== null && _f !== void 0 ? _f : 0}</td>
      <td>Professional Tax</td>
      <td class="">₹ ${(_g = offerLetter.professionalTax) !== null && _g !== void 0 ? _g : 0}</td>
    </tr>
    <tr>
      <td>Training</td>
      <td class="">₹${(_h = offerLetter === null || offerLetter === void 0 ? void 0 : offerLetter.training) !== null && _h !== void 0 ? _h : 0}</td>
      <td></td>
      <td></td>
    </tr>
    <tr class="gross-total">
      <td>Gross Salary</td>
      <td class="">₹ ${(_j = offerLetter.grossSalary) !== null && _j !== void 0 ? _j : 0}</td>
      <td>Total Deductions</td>
      <td class="">₹ ${offerLetter.totalDeductions ? offerLetter.totalDeductions : 0}</td>
    </tr>
    <tr class="net-pay">
      <td colspan="4">Net Pay ₹ ${(_k = offerLetter.netPay) !== null && _k !== void 0 ? _k : 0}</td>
    </tr>
    </table>
  </div>
  <div class="footer">* This is system generated Slip doesn't require signature *</div>
</body>
</html>

`;
};
exports.generatePayslipHTML = generatePayslipHTML;
const html_pdf_node_1 = __importDefault(require("html-pdf-node"));
const generateOfferLetterPDF = (offerLetter) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch logo and convert to base64
        // const logoUrl =
        //   "https://media.cakeresume.com/image/upload/s--k9CQtNTA--/c_pad,fl_png8,h_400,w_400/v1691154551/e6idc2sh97xdrmuafkp7.png";
        // const response = await axios.get(logoUrl, { responseType: "arraybuffer" });
        // const logoBase64 = Buffer.from(response.data).toString("base64");
        // const htmlContent = generateOfferLetterHTML(offerLetter, logoBase64);
        // // Launch Puppeteer
        // const browser = await puppeteer.launch({
        //   headless: true,
        //   executablePath: process.env.CHROME_BIN || undefined,
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
        // Fetch logo and convert to base64
        const logoUrl = "https://media.cakeresume.com/image/upload/s--k9CQtNTA--/c_pad,fl_png8,h_400,w_400/v1691154551/e6idc2sh97xdrmuafkp7.png";
        const response = yield axios_1.default.get(logoUrl, { responseType: "arraybuffer" });
        const logoBase64 = Buffer.from(response.data).toString("base64");
        const htmlContent = (0, exports.generateOfferLetterHTML)(offerLetter, logoBase64);
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
        const pdfBuffer = yield html_pdf_node_1.default.generatePdf(file, options);
        if (!pdfBuffer || pdfBuffer.length === 0) {
            throw new Error("Generated PDF is empty");
        }
        console.log("PDF generated successfully with html-pdf-node, size:", pdfBuffer.length, "bytes");
        return pdfBuffer;
    }
    catch (err) {
        console.error("PDF generation failed:", err);
        throw err;
    }
});
exports.generateOfferLetterPDF = generateOfferLetterPDF;
const generatePayslipPDF = (offerLetter) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch logo and convert to base64
        const logoUrl = "https://media.cakeresume.com/image/upload/s--k9CQtNTA--/c_pad,fl_png8,h_400,w_400/v1691154551/e6idc2sh97xdrmuafkp7.png";
        const response = yield axios_1.default.get(logoUrl, { responseType: "arraybuffer" });
        const logoBase64 = Buffer.from(response.data).toString("base64");
        const htmlContent = (0, exports.generatePayslipHTML)(offerLetter, logoBase64);
        // Launch Puppeteer and generate PDF
        // const browser = await puppeteer.launch({
        //   headless: true,
        //   executablePath: process.env.CHROME_BIN || undefined,
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
        const pdfBuffer = yield html_pdf_node_1.default.generatePdf(file, options);
        if (!pdfBuffer || pdfBuffer.length === 0) {
            throw new Error("Generated PDF is empty");
        }
        console.log("PDF generated successfully with html-pdf-node, size:", pdfBuffer.length, "bytes");
        return pdfBuffer;
    }
    catch (err) {
        throw err;
    }
});
exports.generatePayslipPDF = generatePayslipPDF;
