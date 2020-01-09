const Streamer = require('./models/streamers');

async function addStreamer(streamer){
    return new Promise(async (resolve,reject) => {
        let newStreamer = new Streamer({
            user: streamer
        });

        await newStreamer.save((err) => {
            if(err){
                 reject("fail_on_add_new_streamer");
            }

            resolve("streamer_added")
        });
    });
}

async function getStreamers(){
    return new Promise(async(resolve, reject) => {
        await Streamer.find({}, (err,streamers) =>{
            if(err){
                reject("cant_get_streamers");
            }

            resolve(streamers);
        });
    })
}

async function getStreamer(userStreamer){
    return new Promise(async(resolve, reject) => {
        await Streamer.find({'user' : userStreamer}, (err,streamer) =>{
            if(err){
                reject("cant_get_streamer");
            }

            resolve(streamer[0]);
        });
    })
}

async function setStatus(userStreamer,onlineStatus,lastStatus){
    return new Promise(async(resolve,reject) => {
        let edit = await Streamer.updateOne({'user': userStreamer},{'status': onlineStatus,'lastStatus': lastStatus})
        resolve(edit)
    })
}

async function deleteStreamer(){
    
}
module.exports = { addStreamer, getStreamer, getStreamers, setStatus }