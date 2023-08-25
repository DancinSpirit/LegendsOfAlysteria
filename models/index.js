const mongoose = require("mongoose");
require("dotenv").config()
const dbUrl = process.env.MONGODB_URI;

mongoose.connect(dbUrl, {
   useNewUrlParser: true,
   useUnifiedTopology: true
});

mongoose.connection.on("disconnected", function(){
    console.log("Mongodb disconnected");
});

mongoose.connection.on("connected", function(){
    console.log("Mongodb connected");
});

mongoose.connection.on("error", function(err){
    console.log("Mongodb error: ", err);
});

module.exports = {
    Actions: require("./Actions"),
    User: require("./User"),
    Character: require("./Character"),
    Characterinfo: require("./Characterinfo"),
    Event: require("./Event"),
    Story: require("./Story"),
    Player: require("./Player"),
    Duchy: require("./Duchy"),
    County: require("./County"),
    Trait: require("./Trait"),
    War: require("./War"),
    Battle: require("./Battle"),
    Knowledge: require("./Knowledge"),
    Knowledgetree: require("./Knowledgetree"),
    Trainable: require("./Trainable"),
    Specialty: require("./Specialty"),
    Weapontype: require("./Weapontype"),
    Passiveability: require("./Passiveability"),
    Activeability: require("./Activeability"),
    Combatant: require("./Combatant"),
    Combatstyle: require("./Combatstyle"),
    Equipment: require("./Equipment"),
    Fightingstyle: require("./Fightingstyle"),
    Spiritpower: require("./Spiritpower"),
    Duel: require("./Duel")
}