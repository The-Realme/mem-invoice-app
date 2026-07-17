const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const pool = require("../database/db");
const renderTemplate = require("../helpers/templateHelper");
const { ToWords } = require("to-words");
const generateQuotationPDF = async (req, res) => {

    try {

        const id = req.params.id;

        // ===========================
        // Read Document
        // ===========================

        const documentResult = await pool.query(

            `SELECT *
             FROM documents
             WHERE id = $1`,

            [id]

        );

        if (documentResult.rows.length === 0) {

            return res.status(404).send("Quotation not found");

        }

        const document = documentResult.rows[0];

        // ===========================
        // Read Customer
        // ===========================

        const customerResult = await pool.query(

            `SELECT *
             FROM customers
             WHERE id = $1`,

            [document.customer_id]

        );

        const customer = customerResult.rows[0];

        // ===========================
        // Read Items
        // ===========================

        const itemsResult = await pool.query(

            `SELECT *
             FROM document_items
             WHERE document_id = $1`,

            [id]

        );

        const items = itemsResult.rows;
        const GST_RATE = 18;
        const subtotal = items.reduce(

            (sum, item) => sum + Number(item.amount),

            0

        );


        const gstAmount = subtotal * GST_RATE / 100;

        const cgst = gstAmount / 2;

        const sgst = gstAmount / 2;

        const freight = 0;

        const grandTotal = subtotal + gstAmount + freight;


        const toWords = new ToWords({
            localeCode: "en-IN"
        });

        const amountInWords =
            toWords.convert(grandTotal) + " Rupees Only";



        const companyResult = await pool.query(

            `SELECT * FROM company LIMIT 1`

        );

        const company = companyResult.rows[0];
        let itemRows = "";

        items.forEach((item, index) => {

            itemRows += `

<tr>

<td>${index + 1}</td>

<td>${item.description}</td>

<td>${item.hsn_code ?? "-"}</td>

<td>${item.quantity}</td>

<td>${item.uom ?? "Nos"}</td>

<td>${Number(item.unit_price).toFixed(2)}</td>

<td>${Number(item.amount).toFixed(2)}</td>

</tr>

`;



        });


        // ===========================
        // Launch Browser
        // ===========================

        // const browser = await puppeteer.launch({

        //     headless: true

        // });

        const browser = await puppeteer.launch({
    headless: true,
    args: [
        "--no-sandbox",
        "--disable-setuid-sandbox"
    ]
});



        const page = await browser.newPage();

        // ===========================
        // HTML
        // ===========================

        const templatePath = path.join(

            __dirname,

            "..",

            "templates",

            "quotationTemplate.html"

        );

        let template = fs.readFileSync(

            templatePath,

            "utf8"

        );

        const cssPath = path.join(
            __dirname,
            "..",
            "public",
            "css",
            "quotationTemplate.css"
        );

        const css = fs.readFileSync(cssPath, "utf8");


        const headerImage = fs.readFileSync(
            path.join(__dirname, "..", "public", "assets", "header.jpg")
        ).toString("base64");

        const footerImage = fs.readFileSync(
            path.join(__dirname, "..", "public", "assets", "footer.jpg")
        ).toString("base64");

        const watermarkImage = fs.readFileSync(
            path.join(__dirname, "..", "public", "assets", "watermark.jpg")
        ).toString("base64");

        const signatureImage = fs.readFileSync(
            path.join(__dirname, "..", "public", "assets", "signaturenew.png")
        ).toString("base64");




        template = template.replace(
            '<link rel="stylesheet" href="/css/quotationTemplate.css">',
            `<style>${css}</style>`
        );

        template = template

            .replace(
                '/assets/header.jpg',
                `data:image/jpeg;base64,${headerImage}`
            )

            .replace(
                '/assets/footer.jpg',
                `data:image/jpeg;base64,${footerImage}`
            )

            .replace(
                '/assets/watermark.jpg',
                `data:image/jpeg;base64,${watermarkImage}`
            )

            .replace(
                '/assets/signaturenew.png',
                `data:image/jpeg;base64,${signatureImage}`
            );


        const html = renderTemplate(

            template,

            {

                // Company

                companyName: company.company_name,

                bankName: company.bank_name,

                accountNumber: company.account_number,

                ifsc: company.ifsc,

                branch: company.branch,

                terms: company.terms,

                // Document

                quotationNo: document.document_number,

                quotationDate: new Date(
                    document.document_date
                ).toLocaleDateString("en-IN"),

                validUpto: "15 Days",

                paymentTerms: "Advance",

                delivery: "Ex-Works",

                currency: "INR",

                // Customer

                billTo: customer.billing_address.replace(/\n/g, "<br>"),

                shipTo: (customer.shipping_address || customer.billing_address)
                    .replace(/\n/g, "<br>"),

                // Table

                itemRows: itemRows,

                subtotal: subtotal.toFixed(2),

                cgst: cgst.toFixed(2),

                sgst: sgst.toFixed(2),

                freight: freight.toFixed(2),

                grandTotal: grandTotal.toFixed(2),

                amountInWords: amountInWords,
                customerName: customer.customer_name,

            }

        );

        await page.setContent(html, {

            waitUntil: "networkidle0"

        });

        const pdfPath = path.join(

            __dirname,

            "..",

            "generated",

            "quotations",

            `quotation_${document.document_number}.pdf`

        );


        await page.pdf({

            path: pdfPath,

            format: "A4",

            printBackground: true

        });

        await browser.close();

        res.download(pdfPath);

    }

    catch (error) {

        console.log(error);

        res.status(500).send("PDF Generation Failed");

    }

};



const generateInvoicePDF = async (req, res) => {

    try {

        const id = req.params.id;

        // ===========================
        // Read Document
        // ===========================

        const documentResult = await pool.query(

            `SELECT *
             FROM documents
             WHERE id = $1`,

            [id]

        );

        if (documentResult.rows.length === 0) {

            return res.status(404).send("Invoice not found");

        }

        const document = documentResult.rows[0];

        // ===========================
        // Read Customer
        // ===========================

        const customerResult = await pool.query(

            `SELECT *
             FROM customers
             WHERE id = $1`,

            [document.customer_id]

        );

        const customer = customerResult.rows[0];

        // ===========================
        // Read Items
        // ===========================

        const itemsResult = await pool.query(

            `SELECT *
             FROM document_items
             WHERE document_id = $1`,

            [id]

        );

        const items = itemsResult.rows;
        const GST_RATE = 18;
        const subtotal = items.reduce(

            (sum, item) => sum + Number(item.amount),

            0

        );


        const gstAmount = subtotal * GST_RATE / 100;

        const cgst = gstAmount / 2;

        const sgst = gstAmount / 2;

        const freight = 0;

        const grandTotal = subtotal + gstAmount + freight;


        const toWords = new ToWords({
            localeCode: "en-IN"
        });

        const amountInWords =
            toWords.convert(grandTotal) + " Rupees Only";



        const companyResult = await pool.query(

            `SELECT * FROM company LIMIT 1`

        );

        const company = companyResult.rows[0];
        let itemRows = "";

        items.forEach((item, index) => {

            itemRows += `

<tr>

<td>${index + 1}</td>

<td>${item.description}</td>

<td>${item.hsn_code ?? "-"}</td>

<td>${item.quantity}</td>

<td>${item.uom ?? "Nos"}</td>

<td>${Number(item.unit_price).toFixed(2)}</td>

<td>${Number(item.amount).toFixed(2)}</td>

<td>${(Number(item.amount) * Number(item.gst_percentage ?? 18) / 100).toFixed(2)}</td>

<td>${(
                    Number(item.amount) +
                    Number(item.amount) * Number(item.gst_percentage ?? 18) / 100
                ).toFixed(2)}</td>

</tr>

`;



        });


        // ===========================
        // Launch Browser
        // ===========================

        const browser = await puppeteer.launch({

            headless: true

        });

        const page = await browser.newPage();

        // ===========================
        // HTML
        // ===========================

        const templatePath = path.join(

            __dirname,

            "..",

            "templates",

            "invoiceTemplate.html"

        );

        let template = fs.readFileSync(

            templatePath,

            "utf8"

        );

        const cssPath = path.join(
            __dirname,
            "..",
            "public",
            "css",
            "invoiceTemplate.css"
        );

        const css = fs.readFileSync(cssPath, "utf8");


        const headerImage = fs.readFileSync(
            path.join(__dirname, "..", "public", "assets", "header.jpg")
        ).toString("base64");

        const footerImage = fs.readFileSync(
            path.join(__dirname, "..", "public", "assets", "footer.jpg")
        ).toString("base64");

        const watermarkImage = fs.readFileSync(
            path.join(__dirname, "..", "public", "assets", "watermark.jpg")
        ).toString("base64");

        const signatureImage = fs.readFileSync(
            path.join(__dirname, "..", "public", "assets", "signaturenew.png")
        ).toString("base64");




        template = template.replace(
            '<link rel="stylesheet" href="/css/invoiceTemplate.css">',
            `<style>${css}</style>`
        );

        template = template

            .replace(
                '/assets/header.jpg',
                `data:image/jpeg;base64,${headerImage}`
            )

            .replace(
                '/assets/footer.jpg',
                `data:image/jpeg;base64,${footerImage}`
            )

            .replace(
                '/assets/watermark.jpg',
                `data:image/jpeg;base64,${watermarkImage}`
            )

            .replace(
                '/assets/signaturenew.png',
                `data:image/jpeg;base64,${signatureImage}`
            );


        const html = renderTemplate(

            template,

            {

                // Company

                companyName: company.company_name,

                bankName: company.bank_name,

                accountNumber: company.account_number,

                ifsc: company.ifsc,

                branch: company.branch,

                terms: company.terms,

                // Document

                invoiceNo: document.document_number,

                invoiceDate: new Date(
                    document.document_date
                ).toLocaleDateString("en-IN"),
                orderNumber: document.order_number,

                orderDate: document.order_date
                    ? new Date(document.order_date)
                        .toLocaleDateString("en-IN")
                    : "",

                modelSerialNumber: document.model_serial_number,

                site: document.site,

                // Customer

                billTo: customer.billing_address.replace(/\n/g, "<br>"),

                shipTo: (customer.shipping_address || customer.billing_address)
                    .replace(/\n/g, "<br>"),

                // Table

                itemRows: itemRows,

                subtotal: subtotal.toFixed(2),

                cgst: cgst.toFixed(2),

                sgst: sgst.toFixed(2),
                igst: document.igst ?? "0.00",

                freight: freight.toFixed(2),

                grandTotal: grandTotal.toFixed(2),

                amountInWords: amountInWords,
                customerName: customer.customer_name,

                customerGST: customer.gst_number,

                state: customer.state,

                attentionPerson: customer.attention_person,


            }

        );

        await page.setContent(html, {

            waitUntil: "networkidle0"

        });

        const pdfPath = path.join(

            __dirname,

            "..",

            "generated",

            "invoices",

            `invoice_${document.document_number}.pdf`

        );


        await page.pdf({

            path: pdfPath,

            format: "A4",

            printBackground: true

        });

        await browser.close();

        res.download(pdfPath);

    }

    catch (error) {

        console.log(error);

        res.status(500).send("PDF Generation Failed");

    }

};




module.exports = {

    generateQuotationPDF,
    generateInvoicePDF

};
