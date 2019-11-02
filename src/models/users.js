const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
     idDiscord : String,
     nickName : String,
     isPug : Boolean,
     rolInGame : String,
     battleTag : String
});

module.exports = mongoose.model('user', userSchema)
