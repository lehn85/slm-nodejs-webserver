var express = require('express');
var router = express.Router();

////// db sqlite3 for testing
//var sqlite3 = require('sqlite3').verbose();
//var db = new sqlite3.Database('sqlite-db/temphumid.db');

console.info(process.env);

////// postgreSQL
var pg = require('pg');

// create a config to configure both pooling behavior
// and client options
// note: all config is optional and the environment variables
// will be read if the config is not present
var pgConfig = {
    user: process.env.PGUSER, //env var: PGUSER
    database: process.env.PGDATABASE, //env var: PGDATABASE
    password: process.env.PGPASSWORD, //env var: PGPASSWORD
    host: process.env.DATABASE_URL, // Server hosting the postgres database
    port: process.env.PGPORT, //env var: PGPORT
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

//this initializes a connection pool
//it will keep idle connections open for a 30 seconds
//and set a limit of maximum 10 idle clients
var pool = new pg.Pool(pgConfig);

pool.on('error', function (err, client) {
    // if an error is encountered by a client while it sits idle in the pool
    // the pool itself will emit an error event with both the error and
    // the client which emitted the original error
    // this is a rare occurrence but can happen if there is a network partition
    // between your application and the database, the database restarts, etc.
    // and so you might want to handle it and at least log it out
    console.error('idle client error', err.message, err.stack)
})

/////// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

////// internal route
router.get('/latest/:minute', function (req, res) {
    pool.connect(function (err, client, done) {
        var time = Date.now() - req.params.minute * 60 * 1000;
        client.query("SELECT * FROM solarpanel WHERE time>$1", [time], function (err, result) {
            if (err)
                res.send(JSON.stringify(err));
            else
                res.send(JSON.stringify(result.rows));
        });
    });
    // sqlite3
    //var time = Date.now() - req.params.minute * 60 * 1000;
    //var v = db.all("SELECT * FROM tbl2 WHERE time>?", time, function (err, list) {
    //    if (err)
    //        res.send(JSON.stringify(err));
    //    else
    //        res.send(JSON.stringify(list));
    //});
});

var api_key = process.env.API_WRITE_KEY;
router.post('/' + api_key, function (req, res) {
    var data = null;
    if (req.body && req.body.data)
        data = req.body.data;
    if (!data) {
        res.status(403)
            .send("No data received");
        return;
    }
    if (!(data instanceof Array)) {
        res.status(403)
            .send("Data is not array");
        return;
    }
    if (data.length != 9) {
        res.status(403)
            .send("Data must be 9-element length");
        return;
    }
    // to run a query we can acquire a client from the pool,
    // run a query on the client, and then return the client to the pool        
    pool.connect(function (err, client, done) {
        if (err) {
            res.status(403) //forbiden error
                .send('error connecting to db' + err);
            return;
        }

        // a log
        console.info("Connected to PostgreSQL server at " + process.env.DATABASE_URL + " on port " + process.env.PGPORT);

        // insert query
        client.query('INSERT INTO solarpanel VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)', data, function (err, result) {
            //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
            done(err);

            if (err) {
                res.status(403) //forbiden error
                    .send('error running query' + err);
            }
            else {
                console.info("Inserted " + JSON.stringify(data));
                //console.info(JSON.stringify(result));
                res.send("OK");
            }
        });
    });
});

module.exports = router;