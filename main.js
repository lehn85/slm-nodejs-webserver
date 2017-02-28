var express = require('express');
var datarouter = require('./data_router');
var app = express();

var options = {
    index: 'custom_index.html'
};

app.set('port', (process.env.PORT || 5000));

//Route handler
app.use("/", express.static("app", options));
app.use('/data', datarouter);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
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