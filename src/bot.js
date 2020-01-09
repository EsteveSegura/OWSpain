require('dotenv').config()
const moment = require('moment-timezone');
const Discord = require('discord.js');
const mongoose = require('mongoose');
const client = new Discord.Client();

//Imports
const moderationActions = require('./moderationActions');
const streamerActions = require('./streamerActions');
const collections = require('./collections');
const userActions = require('./userActions');
const pugActions = require('./pugActions');
const warActions = require('./warActions');
const utils = require('./utils');


//DataBase
mongoose.connect('mongodb://localhost/owspain', { useNewUrlParser: true, useUnifiedTopology: true })
     .then((db) => console.log('Conectado con exito a la base de datos'))
     .catch((err) => console.log('Fallo al conectar la base de datos'))


client.on('ready', () => {

     console.log(`Logged in as ${client.user.tag}!`);
     client.user.setActivity('!ayuda')
});

client.on('message', async (msg) => {
     let msgContent = msg.content.toLocaleLowerCase()
     let msgParam = msg.content.split(' ')[1]
     let msgParam2 = msg.content.split(' ')[2]

     if (msgContent === '!registrarme') {
          let getUserDb = await userActions.getUser(msg.author.id)
          if (!getUserDb) {
               let registerUser = await userActions.registerUser(msg.member)
               msg.reply(`Bienvenido! se ha registrado tu usuario.`)
          } else {
               msg.reply('Ya estabas registrado con anterioridad.')
          }
     }

     if (msgContent.startsWith('!battletag')) {
          let canAddBattleTag = true

          if (typeof msgParam == 'undefined') {
               canAddBattleTag = false;
               msg.reply('El comando no es correcto. __!battletag **GiR#9923**__')
          }

          if (canAddBattleTag) {
               let battletagToAdd = await userActions.addBattleTag(msg.author.id, msgParam)
               if (battletagToAdd == 'batttletag_added') {
                    msg.reply('El battletag se ha actualizado de forma correcta!')
               } else {
                    msg.reply('Algo ha ido mal, habla con un administrador')
               }
          }
     }

     //ROL ZONE
     let requestChannel = await collections.getChannelByName(msg.guild, collections.channelIdRequest)
     if (msg.channel.id == requestChannel.id) {
          collections.roles.forEach(async (roles) => {
               if (roles.canSelfAdd && msgContent === roles.command) {
                    msg.member.addRole(msg.member.guild.roles.find(role => role.name === roles.rolName))
                         .then(() => {
                              msg.reply(`Se te ha añadido el rol **${roles.rolName}**`)
                         })
                         .catch(() => {
                              msg.reply(`Parece que hay un problema al añadir el rol **${roles.rolName}** habla con un administrador para solucionar el problema.`)
                         })
               }
          });
          setTimeout(() => {
               msg.delete()
          }, 30000);
     }

     //PUG ZONE
     let pugChannel = await collections.getChannelByName(msg.guild, collections.channelIdPugs)
     if (msg.channel.id == pugChannel.id) {
          let pugStatus = await pugActions.getPug()

          if (msgContent == "!entrar") {
               let isInPug = await pugActions.userIsInPug(msg.author.id)
               let getUserDb = await userActions.getUser(msg.author.id)

               if (pugStatus.participants.length <= 24 && !isInPug && getUserDb) {
                    await pugActions.addUserToPug(msg.author.id)
                    msg.reply(`Has entrado en el pug con éxito`)
               } else {
                    msg.reply('No has podido entrar por alguno de estos motivos\n1- El pug esta lleno, usa <**!lista**>\n2- Ya estas en el pug, usa <**!listaCompleta**>\n3- No estas registrado, usa <**!registrarme**>')
               }
          }

          if (msgContent == "!salir") {
               let isInPug = await pugActions.userIsInPug(msg.author.id)
               if (isInPug) {
                    await pugActions.removeUserInPug(msg.author.id)
                    msg.reply('Has salido del pug con éxito')
               } else {
                    msg.reply('No puedes salir del pug, no estas dentro')
               }
          }

          if (msgContent == "!listacompleta") {
               if (pugStatus.participants.length != 0) {
                    let listString = await Promise.all(pugStatus.participants.map(async (participantPug, index) => {
                         let userObject = await userActions.getUser(participantPug)
                         return `**${index + 1}** - **Discord**: ${userObject.nickName} - **BattleTag**: ${userObject.battleTag} - **Rol**: ${userObject.rolInGame}`;
                    }));
                    msg.channel.send(listString.join("\n"))
               } else {
                    msg.reply('El pug esta vacio')
               }
          }

          if (msgContent == "!lista") {
               msg.reply(`hay ${pugStatus.participants.length}/24 jugadores apuntados para 2 pugs\nPara ver la lista completa: <**!listaCompleta**>`)
          }

          if (msgContent == "!limpiar") {
               let isPugMaster = await userActions.havePermisionsPugMaster(msg.guild, msg.member)
               if (isPugMaster) {
                    pugActions.cleanPug()
                    msg.reply(`El pug se ha limpiado de forma correcta.`)
               } else {
                    msg.reply(`No puedes realizar esa acción.`)
               }
          }

          if (msgContent.startsWith("!sacar")) {
               let userData = await userActions.getUser(msg.mentions.users.first().id)
               let isPugMaster = await userActions.havePermisionsPugMaster(msg.guild, msg.member)
               if (typeof msgParam != "undefined") {
                    if (userData && isPugMaster) {
                         let userIsInPug = pugActions.userIsInPug(userData.idDiscord)
                         if (userIsInPug) {
                              pugActions.removeUserInPug(userData.idDiscord)
                              msg.reply(`Se ha eliminado a <@${userData.idDiscord}>`) //Mejorar esto
                         } else {
                              msg.reply(`Ese usuario no esta en el pug`)
                         }
                    } else {
                         msg.reply(`No se puede realizar esa acción`)
                    }
               } else {
                    msg.reply(`Tienes que etiquetar a alguien`)
               }
          }

          //Por hacer
          if (msgContent == "!dps" || msgContent == "!tank" || msgContent == "!heal" || msgContent == "!flex") {
               let getUserDb = await userActions.getUser(msg.author.id)
               let acutalRol = msgContent.substr(1)
               if (getUserDb) {
                    userActions.addRolInGame(msg.author.id, msgContent)
                    msg.reply(`Se ha añadido el rol ${acutalRol}`)
               } else {
                    msg.reply(`No se ha podido añadir el rol ${acutalRol}\n¿Estas registrado? usa **!registrarme**`)
               }
          }
     }

     //USER
     if (msgContent == "!yo") {
          let selfUerData = await userActions.getUser(msg.author.id)
          if (selfUerData) {
               const dataCard = new Discord.RichEmbed()
                    .setColor('#272c32')
                    .setTitle(`Información sobre usuario ${msg.author.username}`)
                    .setThumbnail(msg.author.avatarURL)
                    .addField('Nick', `${selfUerData.nickName}` || "__No hay datos__", true)
                    .addField('Rol', `${selfUerData.rolInGame}` || "__No hay datos__", true)
                    .addField('BattleTag', `${selfUerData.battleTag}` || "__No hay datos__", true)
                    .setTimestamp()
                    .setFooter('Información obtenida', 'https://i.imgur.com/wUaAvkK.png');

               msg.channel.send(dataCard);
          } else {
               msg.reply(`Parece que no estas registrado. Usa **!registrarme**`)
          }
     }

     if (msgContent.startsWith("!info")) {
          let userData = await userActions.getUser(msg.mentions.users.first().id)
          if (typeof msgParam != "undefined") {
               if (userData) {
                    const dataCard = new Discord.RichEmbed()
                         .setColor('#272c32')
                         .setTitle(`Información sobre usuario ${userData.nickName}`)
                         .setThumbnail(msg.mentions.users.first().avatarURL)
                         .addField('Nick', `${userData.nickName}` || "__No hay datos__", true)
                         .addField('Rol', `${userData.rolInGame}` || "__No hay datos__", true)
                         .addField('BattleTag', `${userData.battleTag}` || "__No hay datos__", true)
                         .setTimestamp()
                         .setFooter('Información obtenida', 'https://i.imgur.com/wUaAvkK.png');

                    msg.channel.send(dataCard);
               } else {
                    msg.reply(`Parece que no se ha encontrado info de **${msg.mentions.users.first().username}**`)
               }
          } else {
               msg.reply(`Tienes que etiquetar a alguien`)
          }
     }

     //TWITCH

     if (msgContent.startsWith("!addstreamer")) {
          if(msg.member.hasPermission('KICK_MEMBERS', false, false)){
               if (typeof msgParam != "undefined") {
                    streamerActions.addStreamer(msgParam)
                    msg.reply(`El streamer ${msgParam}, se añadio correctamente.`)
               } else {
                    msg.reply(`Tienes que especificar un usuario de twitch`)
               }
          }else{
               msg.reply('¿Eres administrador o moderador?')
          }
     }


     //TEMPORAL
     /*
     let warChannel = await collections.getChannelByName(msg.guild, collections.channelIdWar)
     if (msg.channel.id == warChannel.id) {
          if (msgContent == "!createwar") {
               let createWar = await warActions.createWar()
               if (createWar == "war_created") {
                    msg.reply("OK.")
               }
          }

          if (msgContent.startsWith("!war")) {
               createWar = await warActions.addToList(msgParam)
               if (typeof msgParam != "undefined") {
                    if (createWar == "user_added") {
                         msg.reply(`Se ha añadido ${msgParam} a la lista`)
                    } else {
                         msg.reply(`Ha ocurrido algo inesperado, habla con GiR`);
                    }
               } else {
                    msg.reply(`El comando no se ha ejecutado de forma correcta.`)
               }
          }

          setTimeout(() => {
               msg.delete()
          }, 30000);
     }*/
     //TEMPORAL

     //ADMIN START
     if (msgContent.startsWith("!mute")) {
          if (msg.member.hasPermission('KICK_MEMBERS', false, false)) {
               if (typeof msgParam != "undefined" && typeof msgParam2 != "undefined" && /^([0-9])+(h|d|m)$/g.test(msgParam2)) {
                    let userToMute = await utils.getMemberFromId(msg.guild, msg.mentions.users.first().id)
                    let modAction = await moderationActions.mute(userToMute.id, 'Mute', utils.addTimeToDate(Date.now(), msgParam2).toISOString(), userToMute._roles)
                    if (modAction == "muted") {
                         mutedRolId = await collections.getRolIdByName(msg.guild, collections.mutedRol)
                         userToMute.addRole(mutedRolId.id)
                         msg.reply(`Has muteado a ${userToMute.user.username}`)
                    } else {
                         msg.reply(`¿El usuario ya tiene un muteo?`)
                    }
               } else {
                    msg.reply(`revisa el comando, no esta bien`)
               }
          } else {
               msg.reply('¿Eres administrador o moderador?')
          }
     }

     if (msgContent.startsWith("!unmute")) {
          if (msg.member.hasPermission('KICK_MEMBERS', false, false)) {
               if (typeof msgParam != "undefined") {
                    let userToUnMute = await utils.getMemberFromId(msg.guild, msg.mentions.users.first().id)
                    let unMute = await moderationActions.removeMute(userToUnMute.id)
                    if (unMute.message == "deleted") {
                         mutedRolId = await collections.getRolIdByName(msg.guild, collections.mutedRol)
                         await userToUnMute.removeRole(mutedRolId.id)
                         msg.reply(`Se ha quitado el mute sobre ${userToUnMute.user.username}`)
                    } else {
                         msg.reply(`No se ha podido quitar el mute sobre ${userToUnMute.user.username}`)
                    }
               } else {
                    msg.reply(`revisa el comando, no esta bien`)
               }
          } else {
               msg.reply('¿Eres administrador o moderador?')
          }
     }

     //ADMIN END

     if (msgContent == "!help" || msgContent == "!ayuda") {
          msg.channel.send("**Lista de comandos: Usuario **\n```!registrarme: Guarda tu cuenta en el sistema. Necesario para jugar pugs\n!battletag <tag>: Guarda o actualiza tu battletag. Necesario para jugar pugs. Ej: !battletag GiR#2323\n!tank !dps !heal !flex: Asignate tu rol favorito. Ej: !tank\n!yo: Muestra tu información\n!info <usuario>: Muestra la información de un usuario. Ej: !info @GiR\n``` **Lista de comandos: Pugs** ```!entrar: Te unes al pug en curso\n!salir: Sales del pug, solo si estas dentro\n!lista: Muestra el numero de participantes\n!listaCompleta: Muestra la información de los participantes\n!limpiar: Elimina todos los participantes del pug\n!sacar <usuario>: Eliminas a un usuario del pug. Ej: !sacar @GiR```")
     }

});

client.on('guildMemberAdd', async (guildMember) => {
     let registerUser = await userActions.registerUser(guildMember)

     if (guildMember.username == "strapon") {
          guildMember.guild.ban(guildMember)
     }
});


//CHECKING MINUTE BY MINUTE
(async () => {
     setInterval(async () => {
          let getDates = await moderationActions.getMutesByTime()
          let justNow = moment().format("l LT")
          if (getDates != 0) {
               let dbLastDate = moment.tz(getDates[0].dateExpiration, "Europe/Berlin").format("l LT")
               if (dbLastDate == justNow) {
                    let userToUnMute = await utils.getMemberFromId(client.guilds.get("639925043383762966"), getDates[0].idDiscord)
                    let removeMuteData = await moderationActions.removeMute(getDates[0].idDiscord)
                    let mutedRolId = await collections.getRolIdByName(client.guilds.get("639925043383762966"), collections.mutedRol)
                    await userToUnMute.removeRole(mutedRolId.id)
               }
          }
     }, 60000);


     //Comprobando cada
     setInterval(async () => {
          let guildOw = await collections.getGuildById(client, collections.guildId)
          let streamsChannel = guildOw.channels.find('name', 'streams')

          let allStreamers = await streamerActions.getStreamers();
          let checkIfOnline = await Promise.all(allStreamers.map(async (streamer) => {
               let callApiTwitch = await utils.getStream(streamer.user);
               return callApiTwitch
          }))

          console.log(checkIfOnline)
          for (let i = 0; i < checkIfOnline.length; i++) {
               let checkDb = await streamerActions.getStreamer(checkIfOnline[i].user)
               if (!checkIfOnline[i].userInfo) {
                    streamerActions.setStatus(checkIfOnline[i].user, false,false)
               } else {
                    if (checkDb.lastStatus == false && checkIfOnline[i].userInfo) {
                         streamerActions.setStatus(checkIfOnline[i].user, true, true)
                         streamsChannel.send(`Hey, ${checkIfOnline[i].user} esta en directo en este momento en http://twitch.tv/${checkIfOnline[i].user} !`)
                    }
               }
          }

     }, 60000 * 3 );
})();


client.login(process.env.TOKEN);