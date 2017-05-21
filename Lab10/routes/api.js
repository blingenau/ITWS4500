const express = require("express");
var router = express.Router();

//routes for tweet api
router.use("/tweet", require("../controllers/tweet.api"));

module.exports = router;