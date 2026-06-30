const { Pool } = require("pg");

const pool = new Pool({

    user: "postgres",

    host: "localhost",

    database: "mem_office",

    password: "Shahi2006@Ashu",

    port: 5432

});

module.exports = pool;