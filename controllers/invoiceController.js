const pool = require("../database/db");

const saveInvoice = async (req, res) => {

    try{

        const{

            invoiceNo,
            invoiceDate,

            orderNumber,
            orderDate,

            modelSerialNumber,
            site,

            customerName,
            billTo,
            shipTo,

            gstNumber,
            state,
            attentionPerson

        } = req.body;

        // =========================
        // CUSTOMER
        // =========================

        const customerResult = await pool.query(

            `INSERT INTO customers
            (
                customer_name,
                billing_address,
                shipping_address,
                gst_number,
                state,
                attention_person
            )

            VALUES($1,$2,$3,$4,$5,$6)

            RETURNING id`,

            [

                customerName,
                billTo,
                shipTo,
                gstNumber,
                state,
                attentionPerson

            ]

        );

        const customerId =
            customerResult.rows[0].id;

        // =========================
        // DOCUMENT
        // =========================

        const documentResult =
        await pool.query(

            `INSERT INTO documents
            (
                document_type,
                document_number,
                document_date,
                order_number,
                order_date,
                model_serial_number,
                site,
                customer_id
            )

            VALUES($1,$2,$3,$4,$5,$6,$7,$8)

            RETURNING id`,

            [

                "Invoice",

                invoiceNo,

                invoiceDate,

                orderNumber,

                orderDate,

                modelSerialNumber,

                site,

                customerId

            ]

        );

        const documentId =
            documentResult.rows[0].id;

        // =========================
        // ITEMS
        // =========================

        const items =
            JSON.parse(req.body.itemsData);

        for(const item of items){

            await pool.query(

                `INSERT INTO document_items
                (
                    document_id,
                    description,
                    hsn_code,
                    quantity,
                    unit_price,
                    gst_percentage,
                    amount
                )

                VALUES($1,$2,$3,$4,$5,$6,$7)`,

                [

                    documentId,

                    item.description,

                    item.hsn,

                    item.quantity,

                    item.rate,

                    item.gst,

                    item.amount

                ]

            );

        }

        res.json({

            success:true,

            message:"Invoice Saved Successfully",

            documentId

        });

    }

    catch(error){

        console.log(error);

        res.status(500).json({

            success:false,

            message:"Database Error"

        });

    }

};

module.exports = {

    saveInvoice

};