const mongoose = require("mongoose");
const db = require("../models");

const schema = new mongoose.Schema(
  {
    year: {type: Number},
    season: {type: Number},
    avatar: {type: String},
    firstName: {type: String},
    lastName: {type: String},
    stress: {type: Number},
    birthday: {day: {type: Number},month: {type: Number},year:{type: Number}},
    stress: {type: Number},
    fateRerolls: {available: {type: Number},max: {type: Number}},
    mana: {available: {type: Number},max: {type: Number}},
    profession: {type: String},
    savings: {type: Number},
    salary: {type: Number},
    lifestyle: {type: Number},
    stats: [{
      name: {type: String},
      priorityStat: {type: Boolean},
      dice: [{type: Number}],
      trainingPoints: {type: Number},
      rerolls: {available: {type: Number},max: {type: Number}}
    }],
    traits: {
      metaTrait: [{type: mongoose.Schema.Types.ObjectId, ref: "Trait"}],
      flavorTraits: [{type: mongoose.Schema.Types.ObjectId, ref: "Trait"}],
      specialTraits: [{type: mongoose.Schema.Types.ObjectId, ref: "Trait"}],
      personalityTraits: [{type: mongoose.Schema.Types.ObjectId, ref: "Trait"}],
      aptitudeTraits: [{type: mongoose.Schema.Types.ObjectId, ref: "Trait"}],
      combatAbilities: [{type: mongoose.Schema.Types.ObjectId, ref: "Trait"}],
    },
    knowledgeTrees: [{type: mongoose.Schema.Types.ObjectId, ref: "Knowledgetree"}],
    combatStyles: [{type: mongoose.Schema.Types.ObjectId, ref: "Combatant"}],
    colors: {light: {type: String}, dark: {type: String}, darker: {type: String}, highlight: {type: String}, background: {type: String}},
    informationLevels: [{player: {type: String}, level: {type: Number}, description: {type: String}, age:{type: String}}]
  },
  {timestamps: true}
)

schema.methods.longestStat = function longestStat(){
  diceLength = 0;
  for(x=0; x<this.stats.length; x++){
    if(this.stats[x].dice.length>diceLength){
      diceLength = this.stats[x].dice.length;
    }
  }
  return diceLength;
}

schema.methods.infoConversion = function infoConversion(infoNumber){
  if(infoNumber==-1){
    return "No Access"
  }
  if(infoNumber==0){
    return "Rank E"
  }
  if(infoNumber==1){
    return "Rank D"
  }
  if(infoNumber==2){
    return "Rank C"
  }
  if(infoNumber==3){
    return "Rank B"
  }
  if(infoNumber==4){
    return "Rank A"
  }
  if(infoNumber==5){
    return "Rank S"
  }
  if(infoNumber==6){
    return "Observer"
  }
}

schema.methods.allTraits = function allTraits(){
  const allTraits = [...this.traits.metaTrait, ...this.traits.flavorTraits, ...this.traits.specialTraits, ...this.traits.personalityTraits, ...this.traits.aptitudeTraits, ...this.traits.combatAbilities]
  return allTraits;
}

schema.methods.returnDescription = function returnDescription(player){
  if(player=="Observer"||player=="Game Master"){
    let description = "";
    for(let x=0; x<this.informationLevels.length; x++){
      description += this.informationLevels[x].player + ": " + this.informationLevels[x].description
    }
    return description;
  }else{
    for(let x=0; x<this.informationLevels.length; x++){
      if(this.informationLevels[x].player==player){
        return this.informationLevels[x].description;
      }
    }
  }
}

schema.methods.informationLevel = function informationLevel(player){
  console.log(player)
  if(player=="Observer"||player=="Game Master"){
    return 6;
  }else{
    for(let x=0; x<this.informationLevels.length; x++){
      if(this.informationLevels[x].player==player){
        return this.informationLevels[x].level;
      }
    }
  }
  return -1;
}
schema.methods.monthString = function monthString(month){
  if(month==1){
    return "January";
  }
  if(month==2){
    return "February";
  }
  if(month==3){
    return "March";
  }
  if(month==4){
    return "April";
  }
  if(month==5){
    return "May";
  }
  if(month==6){
    return "June";
  }
  if(month==7){
    return "July";
  }
  if(month==8){
    return "August";
  }
  if(month==9){
    return "September";
  }
  if(month==10){
    return "October";
  }
  if(month==11){
    return "November";
  }
  if(month==12){
    return "December";
  }
}
schema.methods.returnSavings = function savings(){
  if(this.savings<0){
    return "N/A";
  }else{
    return this.savings;
  }
}
schema.methods.returnSalary = function salary(){
  if(this.salary<0){
    return "N/A";
  }else{
    return this.salary;
  }
}

schema.methods.fullName = function fullName(){
  return this.firstName + " " + this.lastName;
}
schema.methods.birthDate = function birthDate(){
  return (this.monthString(this.birthday.month) + " " + this.birthday.day);
}

schema.methods.age = function age(player){
  let returnAge = false;
  for(let x=0; x<this.informationLevels.length; x++){
    if(this.informationLevels[x].player==player){
      if(this.informationLevels[x].age)
      return this.informationLevels[x].age
    }
  }
  console.log(this.year);
  console.log(this.birthday.year);
  let age = this.year - this.birthday.year;
  if(this.birthday.month/4>=this.season+1){
    age++;
  }
  return age;
}

schema.methods.stressLevel = function stressLevel(){
  if(this.stress== -1){
    return "Blissful"
  }
  if(this.stress==0){
    return "None"
  }
  if(this.stress==1){
    return "Very Low"
  }
  if(this.stress==2){
    return "Low"
  }
  if(this.stress==3){
    return "Medium"
  }
  if(this.stress==4){
    return "High"
  }
  if(this.stress==5){
    return "Very High"
  }
  else{
    return "Overwhelmed"
  }
}

schema.methods.lifeStyle = function lifeStyle(){
  if(this.lifestyle==-1){
    return "Actively Struggling"
  }
  if(this.lifestyle==0){
    return "Decent"
  }
  if(this.lifestyle==1){
    return "Good"
  }
  if(this.lifestyle==2){
    return "Luxury"
  }
  if(this.lifestyle==3){
    return "Emperor"
  }
}

schema.methods.stressMod = function stressMod(){
  return 5-(this.stress*5)
}

schema.methods.baseAthletics = function baseAthletics(){
  let total = 0;
  for(let x=0; x<this.stats[0].dice.length; x++){
    total += this.stats[0].dice[x];
  }
  return total;
}
schema.methods.baseSpirituality = function baseSpirituality(){
  let total = 0;
  for(let x=0; x<this.stats[1].dice.length; x++){
    total += this.stats[1].dice[x];
  }
  return total;
}
schema.methods.baseSociability = function baseSociability(){
  let total = 0;
  for(let x=0; x<this.stats[2].dice.length; x++){
    total += this.stats[2].dice[x];
  }
  return total;
}
schema.methods.baseDeception = function baseDeception(){
  let total = 0;
  for(let x=0; x<this.stats[3].dice.length; x++){
    total += this.stats[3].dice[x];
  }
  return total;
}
schema.methods.baseManagement = function baseManagement(){
  let total = 0;
  for(let x=0; x<this.stats[4].dice.length; x++){
    total += this.stats[4].dice[x];
  }
  return total;
}
schema.methods.baseIngenuity = function baseIngenuity(){
  let total = 0;
  for(let x=0; x<this.stats[5].dice.length; x++){
    total += this.stats[5].dice[x];
  }
  return total;
}

schema.methods.baseStat = function baseStat(index){
  let total = 0;
  for(let x=0; x<this.stats[index].dice.length; x++){
    total += this.stats[index].dice[x];
  }
  if(this.stats[index].priorityStat){
    total += this.stats[index].dice.length;
  }
  return total;
}

schema.methods.fullStat = function fullStat(index){
  let total = this.baseStat(index);
  let allTraits = this.allTraits();
  for(let x=0; x<allTraits.length; x++){
    if(allTraits[x].statModifiers[index]>0||allTraits[x].statModifiers[index]<0){
      total += allTraits[x].statModifiers[index]
    }
  }
  return total;
}

const Model = mongoose.model("Characterinfo", schema);

module.exports = Model;