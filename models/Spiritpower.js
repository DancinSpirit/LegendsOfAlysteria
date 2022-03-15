const mongoose = require("mongoose");
const schema = new mongoose.Schema(
    {
        name: {type: String},
        type: {type: String},
        battle: {type: Boolean},
        active: {type: Boolean},
        info: {type: mongoose.Schema.Types.ObjectId, ref: "Trainable"},
        description: {type: String},
        effect: {type: String},
    },
    {timestamps: true}
)

//Fighting Spirit Stamina Mod
schema.methods.FSstaminaMod = function FSstaminaMod(){
  if(this.info.rankString() == "E"){
    return 1.01;
  }
  if(this.info.rankString() == "D"){
    return 1.03
  }   
  if(this.info.rankString() == "C"){
    return 1.05
  }
  if(this.info.rankString() == "B"){
    return 1.1
  }
  if(this.info.rankString() == "A"){
    return 1.2
  }
  if(this.info.rankString() == "S"){
    return 1.3
  }
  if(this.info.rankString() == "SS"){
    return 1.5
  }
  if(this.info.rankString() == "SSS"){
    return 2
  }
}

const Spiritpower = mongoose.model("Spiritpower", schema);

module.exports = Spiritpower;