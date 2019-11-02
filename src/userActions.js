//Models 
const User = require('./models/users');

async function getUser(idDiscord) {
     return new Promise((resolve, reject) => {
          User.findOne({ 'idDiscord': idDiscord }, (err, userDiscord) => {
               if (err) {
                    reject(false);
               }
               resolve(userDiscord);
          });
     })
}

async function registerUser(userObject) {
     return new Promise(async (resolve, reject) => {
          let userExists = await getUser(userObject.user.id)
          if (userExists) {
               resolve("user_already_registered")
          } else {
               let newUser = new User({
                    idDiscord: userObject.user.id,
                    nickName: userObject.user.username,
                    isPug: false,
                    rolInGame: "",
                    battleTag: ""
               });

               newUser.save((err) => {
                    if (err) {
                         reject("fail_on_register_user");
                    }
                    resolve("user_registered");
               });
          }

     });
}

async function addBattleTag(idDiscord, battleTag) {
     return new Promise((resolve, reject) => {
          User.findOne({ 'idDiscord': idDiscord }, async (err, user) => {
               if (err) {
                    console.log("fail")
                    reject("fail_on_adding_battletag")
               }

               await User.update({ 'idDiscord': idDiscord }, {
                    idDiscord: user.idDiscord,
                    nickName: user.nickName,
                    isPug: user.isPug,
                    rolInGame: user.rolInGame,
                    battleTag: battleTag
               })
               
               resolve("batttletag_added")
          });
     })
}


module.exports = { registerUser, getUser, addBattleTag }