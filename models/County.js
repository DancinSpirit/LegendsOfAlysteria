const mongoose = require("mongoose");

const countySchema = new mongoose.Schema(
  {
    name: {type: String},
    description: {type: String},
    ruler: {type: mongoose.Schema.Types.ObjectId, ref: "Character"},
    population: {type: Number},
    agriculturalPop: {type: Number},
    agriculturalMax: {type: Number},
    miningPop: {type: Number},
    miningPopMax: {type: Number},
    noblePop: {type: Number},
    clergyPop: {type: Number},
    priestPop: {type: Number},
    specialistPop: {type: Number},
    size: {type: Number},//in sq miles
    statPotentials: [{type: String}],
    fertility: {type: Number},
    mineralWealth: {type: Number},
    hardy: {type: Boolean} 
  },
  {timestamps: true}
)

countySchema.methods.output = function output(){
  if(fertility==2){
    return 140*this.agriculturalPop/100;
  }
}
countySchema.methods.excessOutput = function excessOutput(){
  return population - this.output();
}
countySchema.methods.miningOutput = function miningOutput(){
  let mineralWealth;
  if(this.hardy){
    mineralWealth = this.mineralWealth*1.1;
  }else{
    mineralWealth = this.mineralWealth;
  }
  if(mineralWealth == 5)
    return miningPop * 25;
}


const County = mongoose.model("County", countySchema);

module.exports = County;