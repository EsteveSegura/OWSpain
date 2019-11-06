const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let warSchema = new Schema({
     participants : [String],
     isActive : Boolean
});

module.exports = mongoose.model('war', warSchema)
