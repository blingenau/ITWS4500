const express = require("express");
var router = express.Router();

//routes for tweet api
router.use("/weather", require("../controllers/weather.api"));

module.exports = router;