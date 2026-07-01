const express = require("express");
const path = require("path");

const router = express.Router();

const {
    saveInvoice
} = require("../controllers/invoiceController");

// ================= Invoice Form =================

router.get("/", (req, res) => {

    res.sendFile(

        path.join(__dirname, "..", "views", "invoiceForm.html")

    );

});

// ================= Save Invoice =================

router.post("/", saveInvoice);

module.exports = router;