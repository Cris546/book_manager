//Set up to MySQL database connection

const mysql = require('mysql');
//Config is the hidden details to sign in into database
const config = require('./config');

//Use a MySQL pool to create connections
//Reason:
    //Can quickly establish connections to database and easier error handling
    //No need to constantly refresh connection to determine if re-connection is needed
var pool = mysql.createPool({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database
})



module.exports = pool;