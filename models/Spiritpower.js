const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        name: {type: String},
        type: {type: String},
        battle: {type: Boolean},
        active: {type: Boolean}, //No Idea what this is supposed to mean
        info: {type: mongoose.Schema.Types.ObjectId, ref: "Trainable"},
        statModifiers: [{type:Number}],
        description: {type: String},
        effect: {type: String},
        combatAptitude: {type: Number},//Very Poor: 0, Poor: 1, Decent: 2, Good: 3, Very Good: 4
    },
    {timestamps: true}
)

schema.methods.combatAptitudeMod = function combatAptitudeMod(){
  if(this.combatAptitude==0){
    return 4;
  }
  if(this.combatAptitude==1){
    return 3;
  }
  if(this.combatAptitude==2){
    return 2;
  }
  if(this.combatAptitude==3){
    return 1;
  }
  if(this.combatAptitude==4){
    return -1.5;
  }
}

schema.methods.combatMod =  function combatMod(spirituality){
  if(this.info.rankString() == "F"){
    let mod = (spirituality-30);
    if(spirituality>0){
      return Math.round(mod/this.combatAptitudeMod())
    }else{
      return Math.round(mod*this.combatAptitudeMod())
    }
  }
  if(this.info.rankString() == "E"){
    let mod = (spirituality-15);
    if(spirituality>0){
      return Math.round(mod/this.combatAptitudeMod())
    }else{
      return Math.round(mod*this.combatAptitudeMod())
    }
  }
  if(this.info.rankString() == "D"){
    let mod = (spirituality);
    if(spirituality>0){
      return Math.round(mod/this.combatAptitudeMod())
    }else{
      return Math.round(mod*this.combatAptitudeMod())
    }
  }
  if(this.info.rankString() == "C"){
    let mod = (spirituality+5);
    if(spirituality>0){
      return Math.round(mod/this.combatAptitudeMod())
    }else{
      return Math.round(mod*this.combatAptitudeMod())
    }
  }
  if(this.info.rankString() == "B"){
    let mod = (spirituality+15);
    if(spirituality>0){
      return Math.round(mod/this.combatAptitudeMod())
    }else{
      return Math.round(mod*this.combatAptitudeMod())
    }
  }
  if(this.info.rankString() == "A"){
    let mod = (spirituality+30);
    if(spirituality>0){
      return Math.round(mod/this.combatAptitudeMod())
    }else{
      return Math.round(mod*this.combatAptitudeMod())
    }
  }
  if(this.info.rankString() == "S"){
    let mod = (spirituality+50);
    if(spirituality>0){
      return Math.round(mod/this.combatAptitudeMod())
    }else{
      return Math.round(mod*this.combatAptitudeMod())
    }
  }
}


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