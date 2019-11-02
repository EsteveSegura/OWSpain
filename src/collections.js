const channelIdRequest = "639991724705316875";
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
          "canSelfAdd":true,
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




module.exports = { roles, getRolByName, channelIdRequest }