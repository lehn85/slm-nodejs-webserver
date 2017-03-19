/****
 * Solar panel monitor - a learning project, monitors sensors and send to server
 * Nodejs webserver module
 * Created 2017 by Ngo Phuong Le
 * https://github.com/lehn85/slm-nodejs-webserver
 * All files are provided under the MIT license.
 ****/

var express = require('express');
var router = express.Router();

//console.info(process.env);

///// extract pg database_url
var url = require('url');
var dburl = url.parse(process.env.DATABASE_URL);

////// postgreSQL
var pg = require('pg');

// create a config to configure both pooling behavior
// and client options
// note: all config is optional and the environment variables
// will be read if the config is not present
var pgConfig = {
    user: dburl.auth.substr(0, dburl.auth.indexOf(":")),
    password: dburl.auth.substr(dburl.auth.indexOf(":") + 1),
    database: dburl.path.substr(1), //env var: PGDATABASE    
    host: dburl.hostname, // Server hosting the postgres database
    port: dburl.port, //env var: PGPORT
    max: 5, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};
console.info("pgConfig=" + JSON.stringify(pgConfig));

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

// last data extract from db
var lastData = null;
pool.connect()
    .then(client => {
        // a log
        console.info("Try getting last data");

        client.query("SELECT * FROM	solarpanel ORDER BY	time DESC LIMIT 1")
            .then(result => {
                client.release();
                var data = result.rows && result.rows.length > 0 ? result.rows[0] : null;
                if (data) {
                    lastData = data;
                    lastData.time = Number.parseInt(data.time);//postgreSQL return bigint as string
                    console.info("LastData = " + JSON.stringify(lastData));
                }
                else console.info("No data");
            })
            .catch(err => {
                client.release();
                console.error("error getting last data");
            });
    });

// route /last
router.get('/last', function (req, res) {
    res.send(JSON.stringify(lastData));
});

// route /latest/:minute
router.get('/latest/:minute', function (req, res) {
    pool.connect()
        .then(client => {
            // a log
            console.info("Connected to PostgreSQL server at " + pgConfig.host + " on port " + pgConfig.port);

            var time = Date.now() - req.params.minute * 60 * 1000;
            client.query("SELECT * FROM solarpanel WHERE time>$1", [time])
                .then(result => {
                    client.release();
                    res.send(JSON.stringify(result.rows));
                })
                .catch(err => {
                    client.release();
                    res.status(403);
                    res.send(JSON.stringify(err));
                });
        })
        .catch(err => {
            res.status(403) //forbiden error
                .send('error connecting to db' + err);
        });
});

var api_key = process.env.API_WRITE_KEY;
if (!api_key) {
    console.warn("API_WRITE_KEY not found, use default (insert). Use POST to /data/insert JSON: {data:[]}");
    api_key = "insert";
}
else console.info("API_WRITE_KEY=" + api_key);

// insert record to database
router.post('/' + api_key, function (req, res) {
    var data = null;
    if (req.body)
        data = req.body;
    if (!data) {
        res.status(403)
            .send("No data received");
        return;
    }

    // save last data    
    lastData = data;

    // to run a query we can acquire a client from the pool,
    // run a query on the client, and then return the client to the pool        
    pool.connect()
        .then(client => {
            // a log
            console.info("Connected to PostgreSQL server at " + pgConfig.host + " on port " + pgConfig.port);

            // insert query
            client.query(
                'INSERT INTO solarpanel(time,temp,humid,volt1,miliwatt1,volt2,miliwatt2,voltm,miliwattm,watt_per_m2) ' +
                'VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
                [Date.now(),
                    data.temp, data.humid,
                    data.volt1, data.miliwatt1,
                    data.volt2, data.miliwatt2,
                    data.voltm, data.miliwattm,
                    data.watt_per_m2])
                .then(result => {
                    client.release();
                    console.info("Inserted " + JSON.stringify(data));
                    res.send("OK");

                })
                .catch(err => {
                    client.release();
                    res.status(403) //forbiden error
                        .send('error running query' + err);
                });
        })
        .catch(err => {
            res.status(403) //forbiden error
                .send('error connecting to db' + err);
        });
});

module.exports = router;