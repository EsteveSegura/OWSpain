const guildId = '639925043383762966'

const channelIdRequest = "auto-rol";
const channelIdPugs = "pugs";
const channelIdWar = "ow-spain-war";
const channelIdStreams = "streams"

const mutedRol = "muted";
const pugMasterRol = "PugMaster";
const roles = [
     {
          "name":"pc",
          "rolName":"PC",
          "canSelfAdd":true,
          "command": "!pc",
          "description":"Players en PC"
     },
     {
          "name":"ps4",
          "rolName":"PS4",
          "canSelfAdd":true,
          "command": "!ps4",
          "description":"Players en PS4"
     },
     {
          "name":"xbox",
          "rolName":"XBOX",
          "canSelfAdd":true,
          "command": "!xbox",
          "description":"Players en XBOX"
     },
     {
          "name":"switch",
          "rolName":"Switch",
          "canSelfAdd":true,
          "command": "!switch",
          "description":"Players en Switch"
     },
     {
          "name":"es",
          "rolName":"ES",
          "canSelfAdd":true,
          "command": "!es",
          "description":"Jugadores de España"
     },
     {
          "name":"latam",
          "rolName":"LATAM",
          "canSelfAdd":true,
          "command": "!latam",
          "description":"Jugadores de LATAM"
     },
]

async function getGuildById(client,id){
     return await client.guilds.find('id', id)
}

async function getChannelByName(guild,name){
     let channel = await guild.channels.find('name',name)
     return channel
}

async function getRolIdByName(guild,name){
     console.log(name)
     let rol = await guild.roles.find('name',name)
     return rol
}

function getRolByName(name){
     return roles.filter((allRoles) => {
          if(allRoles.name == name){
               return allRoles
          }
     })[0];
}

module.exports = { roles, getRolByName, getRolIdByName, getChannelByName, channelIdRequest, channelIdPugs, channelIdWar, pugMasterRol, mutedRol, channelIdStreams, getGuildById, guildId }

