const { Pool } = require("pg");

// const pool = new Pool({

//     user: "postgres",

//     host: "localhost",

//     database: "mem_office",

//     password: "Shahi2006@Ashu",

//     port: 5432

// });

// module.exports = pool;

require("dotenv").config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});