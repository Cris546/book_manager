const mysql = require('mysql');
const config = require('./config');

var pool = mysql.createPool({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database
})



module.exports = pool;