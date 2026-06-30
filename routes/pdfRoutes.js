const express = require("express");

const router = express.Router();

const { generateQuotationPDF } = require("../controllers/pdfController");

router.get("/quotation/:id", generateQuotationPDF);

module.exports = router;