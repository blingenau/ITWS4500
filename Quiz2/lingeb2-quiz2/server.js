var _ = require("lodash");
var express = require("express");
var fs = require("fs");
var app = express();
const apiRoutes = require("./routes/api"); // api routes
const bodyParser = require('body-parser');
const connection = require("./config/db"); // mongodb connection
const weather = require("./models/weather");
const request = require("request");
const apiKey = "a9683212f22c945ba9881c9b5e232a04";

// Parse requests as JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use("/api", apiRoutes);

const server = app.listen(8000, function () {
    var port = server.address().port;

    console.log("Quiz 2 listening at http://localhost:%s", port);
});

const io = require("socket.io")(server); // socket.io is used to stream info back to the client code

// This is where the server gets the signal to export the data
io.on("connection", function (socket) {
    socket.on("export", function () {
        weather.find({}, function (err, weathers) {
            if (err) throw err;

            io.emit("fileWritten"); // Sends a notification to the user that the data has been written
            fs.writeFile("Q2Q1c-lingeb2.json", JSON.stringify(weathers), (err) => {
                if (err) throw err;
            });
        })
    })
});

app.use(express.static("./"));

// This route serves our webpage
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

// This route handles a query for a zip code's weather data
app.get("/query", function (req, res, next) {
    var zip = req.query.query;

    request.get(`http://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=${apiKey}&units=imperial`, function (error, res, body) {
        if (error) throw error;

        body = JSON.parse(body);

        weather.update({
            zipCode: zip
        }, {
            zipCode: zip,
            location: body.name,
            temp: body.main.temp
        }, {
            upsert: true
        }, function (err) {
            if (err) throw err;
        });
    });
});