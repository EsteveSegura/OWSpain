require('dotenv').config()
const Discord = require('discord.js');
const mongoose = require('mongoose');
const client = new Discord.Client();

//Models 
const User = require('./models/users');

//Imports
const collections = require('./collections');
const utils = require('./utils');
const userActions = require('./userActions');



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
          let registerUser = await userActions.registerUser(msg.member)
          msg.channel.send(registerUser)
     }

     if(msg.content.startsWith('!battletag')){
          let canAddBattleTag = true
          
          if(typeof msgParam == 'undefined'){
               canAddBattleTag = false;
               msg.reply('El comando no es correcto. __!battletag **GiR#9923**__')
          }
          
          if(canAddBattleTag){
               let battletagToAdd = await userActions.addBattleTag(msg.author.id, msgParam)
               console.log(battletagToAdd)
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
     }*/

     if(msg.content.startsWith('!qq')){
          let data = await utils.getMemberFromId(msg.guild, msg.mentions.users.first().id)
          console.log(data)
     }

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
     }
     
     setTimeout(() => {
          msg.delete()
     }, 30000);
});

client.on('guildMemberAdd', async (guildMember) => {
     //Add rol
     let rolToAdd = collections.getRolByName("Usuario")
     guildMember.addRole(guildMember.guild.roles.find(role => role.name === rolToAdd.rolName));
     //User
     let registerUser = await userActions.registerUser(guildMember)
     console.log(registerUser)
})




client.login(process.env.TOKEN);