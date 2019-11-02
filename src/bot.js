require('dotenv').config()
const Discord = require('discord.js');
const client = new Discord.Client();

//Imports
const collections = require('./collections');
const utils = require('./utils');


client.on('ready', () => {
     console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (msg) => {
     if(msg.content.startsWith == '!d'){
          let rolToAdd = collections.getRolByName("Usuario")
          msg.member.addRole(msg.member.guild.roles.find(role => role.name === rolToAdd.rolName));     
     }

     /*
     if(msg.content.startsWith('!a')){
          let data = await utils.getMemberFromId(msg.guild, msg.author.id)
          console.log(data)
     }*/

     if(msg.content.startsWith('!q')){
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

client.on('guildMemberAdd', (guildMember) => {
     let rolToAdd = collections.getRolByName("Usuario")
     guildMember.addRole(guildMember.guild.roles.find(role => role.name === rolToAdd.rolName));
})


client.login(process.env.TOKEN);