const pool = require("../database/db");

const saveQuotation = async (req, res) => {

    try {

        const {

            quotationNo,
            quotationDate,
            customerName,
            customerAddress

        } = req.body;

        // Insert Customer
        const customerResult = await pool.query(

            `INSERT INTO customers
            (
                customer_name,
                billing_address
            )
            VALUES($1,$2)
            RETURNING id`,

            [

                customerName,
                customerAddress

            ]

        );

        const customerId = customerResult.rows[0].id;

        // Insert Document
        const documentResult = await pool.query(

            `INSERT INTO documents
            (
                document_type,
                document_number,
                document_date,
                customer_id
            )

            VALUES($1,$2,$3,$4)

            RETURNING id`,

            [

                "Quotation",

                quotationNo,

                quotationDate,

                customerId

            ]

        );

        const documentId = documentResult.rows[0].id;

        // Convert JSON string into JavaScript array
        const items = JSON.parse(req.body.itemsData);

        // Save every item
        for (const item of items) {

            await pool.query(

                `INSERT INTO document_items
                (
                    document_id,
                    description,
                    quantity,
                    unit_price,
                    amount
                )

                VALUES($1,$2,$3,$4,$5)`,

                [

                    documentId,

                    item.description,

                    item.quantity,

                    item.rate,

                    item.amount

                ]

            );

        }

        // res.json({

        //     success: true,

        //     message: "Quotation Saved Successfully!"

        // });

        res.json({

    success: true,

    message: "Quotation Saved Successfully!",

    documentId: documentId

});

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Database Error"

        });

    }

};

module.exports = {

    saveQuotation

};