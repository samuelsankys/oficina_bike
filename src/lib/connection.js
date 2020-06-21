var mysql = require('mysql');
var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'botTrading',
    multipleStatements: true
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected database!");
  });
module.exports = connection