// const express = require("express");

// const router = express.Router();

// const path = require("path");

// router.get("/", (req,res)=>{

//     res.sendFile(path.join(__dirname,"..","views","quotationForm.html"));

// });

// module.exports = router;

const express = require("express");
const path = require("path");

const router = express.Router();

const { saveQuotation } = require("../controllers/quotationController");

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "quotationForm.html"));
});

router.post("/", saveQuotation);

module.exports = router;