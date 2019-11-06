//Models 
const Moderation = require('./models/moderation');

async function mute(idDiscord,type,dateExpiration,oldRoles){
     return new Promise(async (resolve,reject) => {
          Moderation.findOne({idDiscord:idDiscord }, async(err,moderation) =>{
               if(moderation){
                    resolve("already_muted")
               }else{
                    let newMute = new Moderation({
                         idDiscord : idDiscord,
                         typeOfSanction: type,
                         dateExpiration: dateExpiration,
                         oldRoles: oldRoles
                    });
               
                    await newMute.save((err) => {
                         if (err) {
                              reject("fail_on_mute");
                         }
                         resolve("muted");
                    });
               }
          });
     });
}

async function removeMute(idDiscord){
     return new Promise(async (resolve,reject) => {
          Moderation.findOne({idDiscord:idDiscord}, (err,moderation) => {
               if(moderation){
                    Moderation.deleteOne({idDiscord:idDiscord}, (err) =>{
                         if(err){
                              reject("err")
                         }
                         resolve({'message' : "deleted", 'oldRoles' : moderation.oldRoles})
                    });
               }else{
                    resolve('is_not_muted')
               }
          })
     });
}


module.exports = { mute, removeMute }