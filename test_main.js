var express = require('express');
var app = express();

var options = {
    index: 'custom_index.html'
};

//Route handler
app.use("/", express.static("app", options));

app.listen(3000, function() {
    console.log('Start listen on port 3000');
});

// var mysql = require('mysql');

// var connection = mysql.createConnection({
//     host: '10.1.10.105',
//     user: 'temphumid_user',
//     password: 'ddddd',
//     database: 'temphumid'
// });

// connection.connect();

// connection.query('SELECT * FROM tbl2', function(error, results, fields) {
//     if (error) throw error;
//     console.log('The solution is: ', results);
// });

// connection.end();