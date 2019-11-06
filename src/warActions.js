//Models 
const War = require('./models/war');

async function createWar(){
     return new Promise(async (resolve,reject) => {
          let newWar = new War({
               participants: [],
               isActive: true
          });
     
          await newWar.save((err) => {
               if (err) {
                    reject("fail_on_create_war");
               }
               resolve("war_created");
          });

     });
}

async function addToList(userToAdd){
     return new Promise(async(resolve,reject) => {
          await War.updateOne({ 'isActive': true },{
               $push: { participants: userToAdd } 
          }).then(() =>{
               resolve('user_added')
          }).catch(() => {
               reject('cant_add_user')
          })
     })
}



module.exports = { createWar , addToList }
