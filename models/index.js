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
    User: require("./User"),
    Character: require("./Character"),
    Characterinfo: require("./Characterinfo"),
    Event: require("./Event"),
    Story: require("./Story"),
    Player: require("./Player"),
    Game: require("./Game"),
    Duchy: require("./Duchy"),
    County: require("./County"),
    Trait: require("./Trait"),
}