var _ = require("lodash");
var express = require("express");
var fs = require("fs");
var json2csv = require("json2csv");
var twitter = require("twitter");
var app = express();
const apiRoutes = require("./routes/api"); // api routes
const bodyParser = require('body-parser');
const connection = require("./config/db"); // mongodb connection
const tweet = require("./models/tweet");
const xml = require("js2xmlparser"); // json->xml package

var client = new twitter({
    consumer_key: "3rXAEtdPMtfkF8hD9GP5fcuEX",
    consumer_secret: "JlrCGvG6FI2k4jihfm4JYJ7gkUoi9V2RK7yNGHZNkvIvZmBzEt",
    access_token_key: "836802255382790144-RZle3fwjjmr9FePkd33ku9aC0qdc3ah",
    access_token_secret: "bnr3k9M2TnkSMcwipmrTulsUr248Tqj9TEkLxfNbnPOj2"
});

// Parse requests as JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use("/api", apiRoutes);

const server = app.listen(3000, function () {
    var port = server.address().port;

    console.log("Lab 7 listening at http://localhost:%s", port);
});

const io = require("socket.io")(server); // socket.io is used to stream info back to the client code

// This is where the server gets the signal to export the data
io.on("connection", function (socket) {
    socket.on("export", function (exportType) {
        var tweets = [];
        tweet.find({}, "tweet -_id", function (err, tweets) {
            if (err) throw err;

            tweets = tweets.map((x) => x.tweet);

            if (exportType === "JSON") {
                if (fs.existsSync("ITWS4500-S17-lingeb2-lab7-tweets.json")) {
                    io.emit("fileExists");
                }
                fs.writeFile("ITWS4500-S17-lingeb2-lab7-tweets.json", JSON.stringify(tweets), (err) => {
                    if (err) throw err;
                });
            } else if (exportType === "CSV") {
                if (fs.existsSync("ITWS4500-S17-lingeb2-lab7-tweets.csv")) {
                    io.emit("fileExists");
                }
                var fields = [{
                        label: "created_at",
                        value: "created_at",
                        default: null
                    }, {
                        label: "id",
                        value: "id",
                        default: null
                    },
                    {
                        label: "text",
                        value: "text",
                        default: null
                    }, {
                        label: "user_id",
                        value: "user.id",
                        default: null
                    },
                    {
                        label: "user_name",
                        value: "user.name",
                        default: null
                    }, {
                        label: "user_screen_name",
                        value: "user.screen_name",
                        default: null
                    },
                    {
                        label: "user_location",
                        value: "user.location",
                        default: null
                    }, {
                        label: "user_followers_count",
                        value: "user.followers_count",
                        default: null
                    },
                    {
                        label: "user_friends_count",
                        value: "user.friends_count",
                        default: null
                    }, {
                        label: "user_created_at",
                        value: "user.created_at",
                        default: null
                    },
                    {
                        label: "user_time_zone",
                        value: "user.time_zone",
                        default: null
                    }, {
                        label: "user_profile_background_color",
                        value: "user.profile_background_color",
                        default: null
                    },
                    {
                        label: "user_profile_image_url",
                        value: "user.profile_image_url",
                        default: null
                    }, {
                        label: "geo",
                        value: "geo",
                        default: null
                    },
                    {
                        label: "coordinates",
                        value: "coordinates",
                        default: null
                    }, {
                        label: "place",
                        value: "place",
                        default: null
                    }
                ];
                try {
                    var csvData = json2csv({
                        data: tweets,
                        fields: fields
                    });
                    fs.writeFile("ITWS4500-S17-lingeb2-lab7-tweets.csv", csvData);
                } catch (err) {
                    console.error(err);
                }
            } else {
                if (fs.existsSync("ITWS4500-S17-lingeb2-lab7-tweets.xml")) {
                    io.emit("fileExists");
                }
                fs.writeFile("ITWS4500-S17-lingeb2-lab7-tweets.xml", xml.parse("tweet", tweets));
            }
        });
    });
});

app.use(express.static("./"));

// This route serves our webpage
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

// This route handles a query for a specific keyword
app.get("/query", function (req, res, next) {
    var maxCount = parseInt(req.query.count);
    var query = req.query.query;
    tweet.remove({}, function (err) {
        if (err) throw err;

        var stream = client.get("search/tweets", { // establishes the stream connection
            q: query,
            count: maxCount
        }, function (error, tweets, response) {
            if (error) throw error;
            for (var i = 0; i < tweets.statuses.length; i++) {
                var newTweet = new tweet({
                    tweet: tweets.statuses[i]
                });
                newTweet.save(function (err) {
                    if (err) throw err;
                    console.log("Saved tweet");
                });
            }
            //console.log(tweets.statuses);
        });
        res.send(200);
    });
});

// This route handles an empty query, which defaults to tweets from the RPI campus
app.get("/location", function (req, res, next) {
    var maxCount = parseInt(req.query.count);
    var query = req.query.query;
    tweet.remove({}, function (err) {
        if (err) throw err;

        var longitude = (-73.68 + -73.67) / 2;
        var latitude = (42.72 + 42.73) / 2;
        var radius = (42.73-latitude) * 69;

        var stream = client.get("search/tweets", { // establishes the stream connection
            count: maxCount,
            geocode: `${latitude} ${longitude} ${radius}`
        }, function (error, tweets, response) {
            if (error) throw error;
            for (var i = 0; i < tweets.statuses.length; i++) {
                var newTweet = new tweet({
                    tweet: tweets.statuses[i]
                });
                newTweet.save(function (err) {
                    if (err) throw err;
                    console.log("Saved tweet");
                });
            }
            //console.log(tweets.statuses);
        });
        res.send(200);
    });
});