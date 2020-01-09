const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let streamerSchema = new Schema({
    user: String,
    status: {"type":Boolean, "default" : false},
    lastStatus: {"type":Boolean, "default" : false}
});

module.exports = mongoose.model('streamer', streamerSchema)
