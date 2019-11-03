//Models 
const Pug = require('./models/pug');


//TEMPORAL
/*
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/owspain', { useNewUrlParser: true, useUnifiedTopology: true })
     .then((db) => console.log('Conectado con exito a la base de datos'))
     .catch((err) => console.log('Fallo al conectar la base de datos'))    
*/
//TEMPORAL

async function createPug(){
     return new Promise(async (resolve,reject) => {
          let newPug = new Pug({
               participants: [],
               isActive: true
          });
     
          await newPug.save((err) => {
               if (err) {
                    reject("fail_on_create_pug");
               }
               resolve("pug_created");
          });

     });
}

async function getPug(){
     return new Promise(async(resolve,reject) => {
          Pug.find({}, (err,pug) =>{
               if(err){
                    reject('cant_get_put');
               }
               resolve(pug[0])
          });
     });
}

async function userIsInPug(idDiscord){
     return new Promise(async(resolve,reject) =>  {
          let actualPug = await getPug();
          let insidePug = false;
          actualPug.participants.forEach( (participant) => {
               if(participant == idDiscord){
                    insidePug = true;
               }
               return insidePug;
          });
          resolve(insidePug)
     });
}

async function addUserToPug(idDiscord){
     return new Promise(async(resolve,reject) => { 
          await Pug.updateOne({ 'isActive': true },{
               $push: { participants: idDiscord } 
          }).then(() =>{
               resolve('user_added')
          }).catch(() => {
               reject('cant_add_user')
          })
     });
}

async function removeUserInPug(idDiscord){
     return new Promise(async(resolve,reject) => {
          await Pug.updateOne({ 'isActive': true },{
               $pull: { participants: idDiscord } 
          }).then(() =>{
               resolve('user_removed')
          }).catch(() => {
               reject('cant_remove_user')
          })
     });
}

async function cleanPug(){
     return new Promise(async(resolve,reject) => {
          await Pug.updateOne({ 'isActive': true }, { participants: [] })
     });
}


module.exports = { createPug, getPug, userIsInPug, addUserToPug, removeUserInPug, cleanPug }