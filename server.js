const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// ================= Routes =================

const quotationRoutes = require("./routes/quotationRoutes");
const pdfRoutes = require("./routes/pdfRoutes");

// ================= Middleware =================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= Static Files =================

app.use(express.static(path.join(__dirname, "public")));

// ================= Application Routes =================

app.use("/quotation", quotationRoutes);

app.use("/pdf", pdfRoutes);

// ================= Home Page =================

app.get("/", (req, res) => {

    res.sendFile(path.join(__dirname, "views", "home.html"));

});

// preview Template
app.get("/preview", (req, res) => {

    res.sendFile(

        path.join(__dirname, "templates", "quotationTemplate.html")

    );

});




// ================= Start Server =================

app.listen(PORT, () => {

    console.log(`Server running at http://localhost:${PORT}`);

});