require('dotenv').config()
const Discord = require('discord.js');
const mongoose = require('mongoose');
const client = new Discord.Client();

//Models 
const User = require('./models/users');

//Imports
const utils = require('./utils');
const collections = require('./collections');
const userActions = require('./userActions');
const pugActions = require('./pugActions');

//DataBase
mongoose.connect('mongodb://localhost/owspain', { useNewUrlParser: true, useUnifiedTopology: true  })
     .then((db) => console.log('Conectado con exito a la base de datos'))
     .catch((err) => console.log('Fallo al conectar la base de datos'))


client.on('ready', () => {
     console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (msg) => {
     let msgParam = msg.content.split(' ')[1]
     //console.log(msgParam)

     if(msg.content === '!registrarme'){
          let getUserDb = await userActions.getUser(msg.author.id)
          if(!getUserDb){
               let registerUser = await userActions.registerUser(msg.member)
               msg.reply(`Bienvenido! se ha registrado tu usuario.\nTienes un mensaje privado.`)
          }else{
               msg.reply('Ya estabas registrado con anterioridad.')
          }
     }

     if(msg.content.startsWith('!battletag')){
          let canAddBattleTag = true
          
          if(typeof msgParam == 'undefined'){
               canAddBattleTag = false;
               msg.reply('El comando no es correcto. __!battletag **GiR#9923**__')
          }
          
          if(canAddBattleTag){
               let battletagToAdd = await userActions.addBattleTag(msg.author.id, msgParam)
               if(battletagToAdd == 'batttletag_added'){
                    msg.reply('El battletag se ha actualizado de forma correcta!')
               }else{
                    msg.reply('Algo ha ido mal, habla con un administrador')
               }
          }
     }

     /*
     if(msg.content.startsWith('!a')){
          let data = await utils.getMemberFromId(msg.guild, msg.author.id)
          console.log(data)
     }

     if(msg.content.startsWith('!qq')){
          let data = await utils.getMemberFromId(msg.guild, msg.mentions.users.first().id)
          console.log(data)
     }*/

     //OUT OF TEST ZONE
     //ROL ZONE
     if(msg.channel.id == collections.channelIdRequest){
          collections.roles.forEach(async (roles) => {
               if(roles.canSelfAdd && msg.content === roles.command){
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

     if(msg.channel.id == collections.channelIdPugs){
          let pugStatus = await pugActions.getPug()

          if(msg.content == "!entrar"){
               let isInPug = await pugActions.userIsInPug(msg.author.id)
               let getUserDb = await userActions.getUser(msg.author.id)

               if(pugStatus.participants.length <= 12 && !isInPug && getUserDb){
                    await pugActions.addUserToPug(msg.author.id)
                    msg.reply(`Has entrado en el pug con éxito`)
               }else{
                    msg.reply('No has podido entrar por alguno de estos motivos\n1- El pug esta lleno, usa <**!lista**>\n2- Ya estas en el pug, usa <**!listaCompleta**>\n3- No estas registrado, usa <**!registrarme**>')
               }
          }

          if(msg.content == "!salir"){
               let isInPug = await pugActions.userIsInPug(msg.author.id)
               if(isInPug){
                    await pugActions.removeUserInPug(msg.author.id)
                    msg.reply('Has salido del pug con éxito')
               }else{
                    msg.reply('No puedes salir del pug, no estas dentro')
               }
          }

          if(msg.content == "!listaCompleta"){
               let listString = await Promise.all(pugStatus.participants.map(async (participantPug) => {
                    let userObject = await userActions.getUser(participantPug)
                    return `**Discord**: ${userObject.nickName} **BattleTag**: ${userObject.battleTag}`;
                    
               }));
               msg.channel.send(listString.join("\n"))
          }

          if(msg.content == "!lista"){
               msg.reply(`hay ${pugStatus.participants.length}/12 jugadores apuntados\nPara ver la lista completa: <**!listaCompleta**>`)
          }

          if(msg.content == "!limpiar"){
               let a = await userActions.havePermisionsPugMaster(msg.member)
               if(a){
                    pugActions.cleanPug()
                    msg.reply(`El pug se ha limpiado de forma correcta.`)
               }else{
                    msg.reply(`No puedes realizar esa acción.`)
               }
          }
     }
     
});

client.on('guildMemberAdd', async (guildMember) => {
     //Add rol
     //let rolToAdd = collections.getRolByName("Usuario")
     //guildMember.addRole(guildMember.guild.roles.find(role => role.name === rolToAdd.rolName));
     //User
     let registerUser = await userActions.registerUser(guildMember)
     console.log(registerUser)
})




client.login(process.env.TOKEN);