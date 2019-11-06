async function getMemberFromId(guild, idDiscord) {
     return new Promise(async (resolve, reject) => {
          resolve(await guild.members.find("id", idDiscord))
     });
}

function addTimeToDate(date, timeToAdd) {
     let getMagnitude = timeToAdd.slice(-1)
     let getTimeToAdd = parseInt(timeToAdd.substring(0, timeToAdd.length - 1));
     let actualDate = new Date(date)
     let finalDate = 1
     //console.log(getMagnitude)
     //console.log(getTimeToAdd)
     //console.log(actualDate)
     switch (getMagnitude) {
          case "d":
               finalDate = new Date(actualDate.getTime() + getTimeToAdd * 86400000);
               break;
          case "h":
               finalDate = new Date(actualDate.getTime() + getTimeToAdd * 3600000);
               break;
          case "m":
               finalDate = new Date(actualDate.getTime() + getTimeToAdd * 60000);
               break;
     }
     return finalDate
}


module.exports = { getMemberFromId, addTimeToDate }