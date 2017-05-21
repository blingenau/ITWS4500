var _ = require("lodash");
var express = require("express");
var fs = require("fs");
var json2csv = require("json2csv");
var twitter = require("twitter");
var app = express();

// Master list of tweets
var tweets = [];

var client = new twitter({
    consumer_key: "3rXAEtdPMtfkF8hD9GP5fcuEX",
    consumer_secret: "JlrCGvG6FI2k4jihfm4JYJ7gkUoi9V2RK7yNGHZNkvIvZmBzEt",
    access_token_key: "836802255382790144-RZle3fwjjmr9FePkd33ku9aC0qdc3ah",
    access_token_secret: "bnr3k9M2TnkSMcwipmrTulsUr248Tqj9TEkLxfNbnPOj2"
});

const server = app.listen(3000, function () {
    var port = server.address().port;

    console.log("Lab 6 listening at http://localhost:%s", port);
});

const io = require("socket.io")(server); // socket.io is used to stream info back to the client code

// This is where the server gets the signal to export the data
io.on("connection", function (socket) {
    socket.on("export", function (exportType) {
        if (exportType == "JSON") {
            if (fs.existsSync("ITWS4500-S17-lingeb2-lab6-tweets.json")) {
                io.emit("fileExists");
            }
            fs.writeFile("ITWS4500-S17-lingeb2-lab6-tweets.json", JSON.stringify(tweets), (err) => {
                if (err) throw err;
            });
        } else {
            if (fs.existsSync("ITWS4500-S17-lingeb2-lab6-tweets.csv")) {
                io.emit("fileExists");
            }
            var fields = [
                {label: "created_at", value: "created_at", default: null}, {label: "id", value: "id", default: null},
                {label: "text", value: "text", default: null}, {label: "user_id", value: "user.id", default: null},
                {label: "user_name", value: "user.name", default: null}, {label: "user_screen_name", value: "user.screen_name", default: null},
                {label: "user_location", value: "user.location", default: null}, {label: "user_followers_count", value: "user.followers_count", default: null},
                {label: "user_friends_count", value: "user.friends_count", default: null}, {label: "user_created_at", value: "user.created_at", default: null},
                {label: "user_time_zone", value: "user.time_zone", default: null}, {label: "user_profile_background_color", value: "user.profile_background_color", default: null},
                {label: "user_profile_image_url", value: "user.profile_image_url", default: null}, {label: "geo", value: "geo", default: null},
                {label: "coordinates", value: "coordinates", default: null}, {label: "place", value: "place", default: null}
            ];
            try {
                var csvData = json2csv({data: tweets, fields: fields});
                fs.writeFile("ITWS4500-S17-lingeb2-lab6-tweets.csv", csvData);
            } catch (err) {
                console.error(err);
            }
        }
    });
});

app.use(express.static("./"));

// This route serves our webpage
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

// This route handles a query for a specific keyword
app.get("/query", function (req, res, next) {
    var count = 0;
    var maxCount = parseInt(req.query.count);
    var query = req.query.query;
    var stream = client.stream("statuses/filter", { // establishes the stream connection
        track: query
    });
    tweets = [];

    stream.on("data", function (tweet) { // handles incoming data
        io.emit("tweet", tweet.text);
        tweets.push(tweet);
        count += 1;
        if (count >= maxCount) {
            // When the number of queries is reached, end stream
            stream.destroy();
        }
    });

    stream.on("error", function (error) {
        throw error;
    });
    res.send(200);
});

// This route handles an empty query, which defaults to tweets from the RPI campus
app.get("/location", function (req, res, next) {
    var count = 0;
    var maxCount = parseInt(req.query.count);
    var query = req.query.query;
    var stream = client.stream("statuses/filter", { // establishes the stream connection
        locations: query
    });

    stream.on("data", function (tweet) { // handles incoming data
        io.emit("tweet", tweet.text);
        tweets.push(tweet);
        count += 1;
        if (count >= maxCount) {
            // When the number of queries is reached, output to file
            fs.writeFile("tweets.json", JSON.stringify(tweets), (err) => {
                if (err) throw err;
            });
            stream.destroy();
        }
    });

    stream.on("error", function (error) {
        throw error;
    });
    res.send(200);
});