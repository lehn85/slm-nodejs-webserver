/****
 * Solar panel monitor - a learning project, monitors sensors and send to server
 * Nodejs webserver module
 * Created 2017 by Ngo Phuong Le
 * https://github.com/lehn85/slm-nodejs-webserver
 * All files are provided under the MIT license.
 ****/

var express = require('express');
var app = express();

// var
app.set('port', (process.env.PORT || 5000));

///// middleware
var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

///// Route handler
var appOptions = {
    index: 'custom_index.html'
};
app.use("/", express.static("app", appOptions));
// for insert, query data
var datarouter = require('./data_router');
app.use('/data', datarouter);

///// start listening
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});