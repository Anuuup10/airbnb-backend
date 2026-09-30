const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Anup@MySQL10',
    database: 'airbnb',
});

module.exports = pool.promise();