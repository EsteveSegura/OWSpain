async function getMemberFromId(guild,idDiscord){
     return new Promise(async (resolve,reject) => {
          console.log(idDiscord)
          resolve(await guild.members.find("id", idDiscord))
     });  
}

module.exports = { getMemberFromId }