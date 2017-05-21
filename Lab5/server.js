var _ = require("lodash");
var express = require("express");
var fs = require("fs");
var twitter = require("twitter");
var app = express();

var client = new twitter({
    consumer_key: "3rXAEtdPMtfkF8hD9GP5fcuEX",
    consumer_secret: "JlrCGvG6FI2k4jihfm4JYJ7gkUoi9V2RK7yNGHZNkvIvZmBzEt",
    access_token_key: "836802255382790144-RZle3fwjjmr9FePkd33ku9aC0qdc3ah",
    access_token_secret: "bnr3k9M2TnkSMcwipmrTulsUr248Tqj9TEkLxfNbnPOj2"
});

const server = app.listen(3000, function () {
    var port = server.address().port;

    console.log("Lab 5 listening at http://localhost:%s", port);
});

const io = require("socket.io")(server); // socket.io is used to stream info back to the client code

// This route serves our webpage
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

// This route handles a query for a specific keyword
app.get("/query", function (req, res, next) {
    var tweets = [];
    var count = 0;
    var maxCount = parseInt(req.query.count);
    var query = req.query.query;
    var stream = client.stream("statuses/filter", { // establishes the stream connection
        track: query
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
