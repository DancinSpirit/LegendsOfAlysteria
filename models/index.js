const mongoose = require("mongoose");
require("dotenv").config()
const dbUrl = process.env.MONGODB_URI;

mongoose.connect(dbUrl, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useFindAndModify: false,
   useCreateIndex: true
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
    /* Character Models */
    Character: require("./CharacterModels/Character"),
    CharacterInfo: require("./CharacterModels/CharacterInfo"),
    Stat: require("./CharacterModels/Stat"),
    Trait: require("./CharacterModels/Trait"),
    Knowledge: require("./CharacterModels/Knowledge"),
    KnowledgeTree: require("./CharacterModels/KnowledgeTree"),
    Stat: require("./CharacterModels/Stat"),
    Trainable: require("./CharacterModels/Trainable"),
    Specialty: require("./CharacterModels/Specialty"),
    CombatStyle: require("./CharacterModels/CombatStyle"),
    FightingStyle: require("./CharacterModels/FightingStyle"),
    Reroll: require("./CharacterModels/Reroll"),
    WeaponType: require("./CharacterModels/WeaponType"),
    Equipment: require("./CharacterModels/Equipment"),
    EquipmentType: require("./CharacterModels/EquipmentType"),
    Armor: require("./CharacterModels/EquipmentTypes/Armor"),
    Weapon: require("./CharacterModels/EquipmentTypes/Weapon"),
    /* User Model */
    User: require("./User")
};