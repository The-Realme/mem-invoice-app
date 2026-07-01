// const express = require("express");

// const router = express.Router();

// const { generateQuotationPDF } = require("../controllers/pdfController");

// router.get("/quotation/:id", generateQuotationPDF);

// module.exports = router;

const express = require("express");

const router = express.Router();

const {

    generateQuotationPDF,

    generateInvoicePDF

} = require("../controllers/pdfController");

router.get("/quotation/:id", generateQuotationPDF);

router.get("/invoice/:id", generateInvoicePDF);

module.exports = router;