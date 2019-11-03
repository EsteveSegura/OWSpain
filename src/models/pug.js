const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let pugSchema = new Schema({
     participants : [String],
     isActive : Boolean
});

module.exports = mongoose.model('pug', pugSchema)
