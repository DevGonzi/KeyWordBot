let mysql = require('mysql');
let util = require('util');
const log = require('../handler/logging.js');

let pool = mysql.createPool({
    connectionLimit: 100,
    host: '85.214.153.77',
    user: 'keywordbot',
    password: 'Juz2lZXTEat6xOFPMLNM',
    database: 'keywordbot',
    charset: 'utf8mb4',
});

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            log.error('Database connection was closed.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            log.error('Database has too many connections.');
        }
        if (err.code === 'ECONNREFUSED') {
            log.error('Database connection was refused.');
        }
    }
    if (connection) connection.release();
    return;
});

pool.query = util.promisify(pool.query);

module.exports = pool;
