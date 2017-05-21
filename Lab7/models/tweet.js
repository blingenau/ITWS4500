const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const objectId = mongoose.Schema.ObjectId;

var tweetSchema = new Schema({
    _id: {
        type: objectId,
        auto: true,
    },
    tweet: Object
});

module.exports = mongoose.model('Tweet', tweetSchema);