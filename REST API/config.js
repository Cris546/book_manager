var mysql = require('mysql');

const config = {
    db: {
        host: "localhost",
        database: "test1",
        user: "db_user",
        password: "password123"
    },
    listPerPage: 10,
};

module.exports = config;