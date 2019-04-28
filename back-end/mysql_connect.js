const mysql = require("mysql");

var connection = mysql.createPool({
    connectionLimit: 100,
    host:'localhost',
    user:'root',
    password:'**********',
    database:'goatAirbnb',
    port: 3306,
    debug: true,
    multipleStatements: true
});

module.exports.connection = connection;
