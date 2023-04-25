/** Database setup */

// const { Client } = require("pg");
// let DB_URI;

// if (process.env.NODE_ENV === "test") {
//     DB_URI = "postgresql:///cstation_test";
// } else {
//     DB_URI = process.env.DATABASE_URL;
// }

// let db = new Client({
//     connectionString: DB_URI
// });

// db.connect();




const { Client } = require('pg');

const db = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

db.connect();

db.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
        console.log(JSON.stringify(row));
    }
    db.end();
});


module.exports = db;