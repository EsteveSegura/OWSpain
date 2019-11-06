//Models 
const User = require('./models/users');

//collections
const collections = require('./collections');

async function getUser(idDiscord) {
     return new Promise((resolve, reject) => {
          User.findOne({ 'idDiscord': idDiscord }, (err, userDiscord) => {
               if (err) {
                    reject(false);
               }
               if(userDiscord){
                    resolve(userDiscord);
               }else{
                    resolve(false)
               }
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

async function havePermisionsPugMaster(guild,member){
     return new Promise(async (resolve,reject) => {
          pugMasterRol = collections.getRolIdByName(guild,collections.pugMasterRol).id
          member._roles.forEach((roles) => {
               if(roles == pugMasterRol){
                    resolve(true)
               }  
          });
          resolve(false)
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


async function addRolInGame(idDiscord,rolInGame) {
     return new Promise((resolve, reject) => {
          User.findOne({ 'idDiscord': idDiscord }, async (err, user) => {
               if (err) {
                    console.log("fail")
                    reject("fail_on_adding_rol")
               }
               console.log(user)

               await User.update({ 'idDiscord': idDiscord }, {
                    idDiscord: user.idDiscord,
                    nickName: user.nickName,
                    isPug: user.isPug,       
                    rolInGame: rolInGame.substr(1),
                    battleTag: user.battleTag
               })
               
               resolve("rol_added")
          });
     })
}

module.exports = { registerUser, getUser, addBattleTag, addRolInGame, havePermisionsPugMaster }