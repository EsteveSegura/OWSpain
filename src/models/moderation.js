const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let moderationSchema = new Schema({
     idDiscord : String,
     typeOfSanction: String,
     dateExpiration: Date,
     oldRoles: [String]
});

module.exports = mongoose.model('moderation', moderationSchema)
