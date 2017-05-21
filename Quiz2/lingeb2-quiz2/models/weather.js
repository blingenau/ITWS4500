const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const objectId = mongoose.Schema.ObjectId;

var weatherSchema = new Schema({
    _id: {
        type: objectId,
        auto: true,
    },
    zipCode: {
        type: Number,
        unique: true,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    temp: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Weather', weatherSchema);