const channelIdRequest = "640563715422420997";
const channelIdPugs = "639930249311944735";
const channelIdWar = "641603509434843137";
const pugMasterRol = "640548265988980779";
const roles = [
     {
          "name":"usuario",
          "rolName":"Usuario",
          "canSelfAdd" : false,
          "description":"Usuario normal y corriente"
     },
     {
          "name":"administrador",
          "rolName":"Administrador",
          "canSelfAdd" : false,
          "description":"Administrador absoluto"
     },
     {
          "name":"policía",
          "rolName":"Policía",
          "canSelfAdd" : false,
          "description":"Mod con permisos limitados"
     },
     {
          "name":"titanmedia",
          "rolName":"TitanMedia",
          "canSelfAdd" : false,
          "description":"Integrantes de titan media"
     },
     {
          "name":"streamer",
          "rolName":"Streamer",
          "canSelfAdd":false,
          "command": "!streamer",
          "description":"Cualquier streamer de overwatch"
     },
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
          "name":"pugs",
          "rolName":"pugs",
          "canSelfAdd":true,
          "command": "!pugs",
          "description":"los integrantes dispuestos a jugar pugs"
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

function getRolByName(name){
     return roles.filter((allRoles) => {
          if(allRoles.name == name){
               return allRoles
          }
     })[0];
}

module.exports = { roles, getRolByName, channelIdRequest, channelIdPugs, channelIdWar, pugMasterRol }

