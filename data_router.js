var express = require('express');
var router = express.Router();

// db
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('sqlite-db/temphumid.db');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});
// define the home page route
router.get('/', function (req, res) {
    res.send('Birds home page');
});
// define the about route
router.get('/about', function (req, res) {
    res.send('About birds');
});
router.get('/latest/:minute', function (req, res) {
    var time = Date.now() - req.params.minute * 60 * 1000;
    var v = db.all("SELECT * FROM tbl2 WHERE time>?", time, function (err, list) {
        if (err)
            res.send(JSON.stringify(err));
        else
            res.send(JSON.stringify(list));
    });
});

module.exports = router;