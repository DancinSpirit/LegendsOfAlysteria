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
    Character: require("./Character"),
    CharacterInfo: require("./CharacterInfo"),
    Stat: require("./Stat"),
    Trait: require("./Trait"),
    Knowledge: require("./Knowledge"),
    KnowledgeTree: require("./KnowledgeTree"),
    Stat: require("./Stat"),
    Trainable: require("./Trainable"),
    Specialty: require("./Specialty")
}