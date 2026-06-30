console.log("HELLO");
console.log("Program Started");

const pool = require("./database/db");

console.log("Database File Imported");

async function testDatabase() {

    console.log("Inside Function");

    try {

        console.log("Trying Connection...");

        const result = await pool.query("SELECT NOW();");

        console.log("Database Connected!");

        console.log(result.rows);

    }
    catch(err){

        console.log("ERROR:");

        console.log(err);

    }
    finally{

        console.log("Closing Connection");

        await pool.end();

    }

}

testDatabase();

console.log("Program Finished");