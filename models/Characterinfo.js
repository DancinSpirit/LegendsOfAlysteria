const mongoose = require("mongoose");
const db = require("../models");

const schema = new mongoose.Schema(
  {
    newList: [{type:String}],
    character:{type: mongoose.Schema.Types.ObjectId, ref: "Character"},
    theme: {type: String,default: "none"},
    year: {type: Number},
    season: {type: Number},
    avatar: {type: String},
    firstName: {type: String},
    lastName: {type: String},
    stress: {type: Number},
    birthday: {day: {type: Number},month: {type: Number},year:{type: Number}},
    fateRerolls: {available: {type: Number},max: {type: Number}},
    mana: {available: {type: Number},max: {type: Number}},
    profession: {type: String},
    savings: {type: Number,default:-1},
    salary: {type: Number,default:-1},
    lifestyle: {type: Number,default:2},
    race: {type: String},
    stats: [{
      name: {type: String},
      priorityStat: {type: Boolean},
      dice: [{type: Number}],
      trainingPoints: {type: Number},
      trainedPoints: {type: Number},
      rerolls: {available: {type: Number,default:0},max: {type: Number,default:0}},
      limitBreak: {type:Boolean,default:false}
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
    //combatStyles need to be ordered strongest first
    combatStyles: [{type: mongoose.Schema.Types.ObjectId, ref: "Combatstyle"}],
    additionalCombatModifiers: [{name:{type: String},mod:{type: Number}}],
    spiritPowers: [{type: mongoose.Schema.Types.ObjectId, ref: "Spiritpower"}],
    colors: {light: {type: String}, dark: {type: String}, darker: {type: String}, highlight: {type: String}, background: {type: String}},
    informationLevels: [{player: {type: String,default:"Default Player"}, level: {type: Number,default:0}, description: {type: String,default:"Description"}, age:{type: String}, stress:{type:String},race:{type:String},obscuredTraits:[{trait:{type: mongoose.Schema.Types.ObjectId, ref: "Trait"},name:{type:String},description:{type:String}}],hiddenTraits:[{type: mongoose.Schema.Types.ObjectId, ref: "Trait"}]}],
    combatSheet : {type: Boolean, default: false},
    spiritSheet: {type: Boolean, default: false},
    heroSheet: {type: Boolean, default: false}
  },
  {timestamps: true}
)

schema.methods.combatSpiritPowers = function combatSpiritPowers(){
  let spiritList = []
  for(let x=0; x<this.spiritPowers.length; x++){
    if(this.spiritPowers[x].battle){
      spiritList.push(this.spiritPowers[x])
    }
  }
  console.log(spiritList);
  return spiritList;
}

schema.methods.combatSpecialties = function combatSpecialties(){
  let specialtyList = []
  for(let x=0; x<this.knowledgeTrees.length; x++){
    for(let y=0; y<this.knowledgeTrees[x].specialties.length; y++){
      if(this.knowledgeTrees[x].specialties[y].type.includes("Battle")){
        specialtyList.push(this.knowledgeTrees[x].specialties[y])
      }
    }
  }
  console.log(specialtyList)
  return specialtyList;
}

schema.methods.fullEstimatedAttack = function fullEstimatedAttack(){
  let mods = 0;
  for(let x=0; x<this.spiritPowers.length; x++){
    if(this.spiritPowers[x].combatMod(this.fullStat(1))>0){
      mods += this.spiritPowers[x].combatMod(this.fullStat(1));
    }
  }
  for(let x=0; x<this.additionalCombatModifiers.length; x++){
    mods += this.additionalCombatModifiers[x].mod;
  }
  return this.combatStyles[0].attack() + mods + this.combatStyles[0].weightModifier() + this.fullStat(0);
}
schema.methods.fullEstimatedDefense = function fullEstimatedDefense(){
  let mods = 0;
  for(let x=0; x<this.spiritPowers.length; x++){
    if(this.spiritPowers[x].combatMod(this.fullStat(1))>0){
      mods += this.spiritPowers[x].combatMod(this.fullStat(1));
    }
  }
  for(let x=0; x<this.additionalCombatModifiers.length; x++){
    mods += this.additionalCombatModifiers[x].mod;
  }
  return this.combatStyles[0].defense() + mods + this.combatStyles[0].weightModifier() + this.fullStat(0);
}

schema.methods.traitName = function traitName(player,trait){
  for(let x=0; x<this.informationLevels.length; x++){
    if(this.informationLevels[x].player==player){
      for(let y=0; y<this.informationLevels[x].obscuredTraits.length; y++){
        if(JSON.stringify(this.informationLevels[x].obscuredTraits[y].trait)==JSON.stringify(trait._id)){
          return this.informationLevels[x].obscuredTraits[y].name;
        }
      }
    }
  }
  return trait.name;
}
schema.methods.traitDescription = function traitDescription(player,trait){
  for(let x=0; x<this.informationLevels.length; x++){
    if(this.informationLevels[x].player==player){
      for(let y=0; y<this.informationLevels[x].obscuredTraits.length; y++){
        if(JSON.stringify(this.informationLevels[x].obscuredTraits[y].trait)==JSON.stringify(trait._id)){
          return this.informationLevels[x].obscuredTraits[y].description;
        }
      }
    }
  }
  return trait.description;
}
schema.methods.traitEffect = function traitEffect(player,trait){
  for(let x=0; x<this.informationLevels.length; x++){
    if(this.informationLevels[x].player==player){
      for(let y=0; y<this.informationLevels[x].obscuredTraits.length; y++){
        if(JSON.stringify(this.informationLevels[x].obscuredTraits[y].trait)==JSON.stringify(trait._id)){
          return "???"
        }
      }
    }
  }
  return trait.effect;
}
schema.methods.isTraitHidden = function isTraitHidden(player, trait){
  for(let x=0; x<this.informationLevels.length; x++){
    if(this.informationLevels[x].player==player){
      for(let y=0; y<this.informationLevels[x].hiddenTraits.length; y++){
        if(JSON.stringify(this.informationLevels[x].hiddenTraits[y])==JSON.stringify(trait._id)){
          return true;
        }
      }
    }
  }
  return false;
}

schema.methods.combatValue = function combatValue(){
  let value = this.baseStat(0);
  let weaponStyleList = [];
  let newWeaponStyle = true;
  for(let x=0; x<this.combatStyles.length; x++){
    for(let y=0; y<weaponStyleList.length; y++){
      if(weaponStyleList[y].name==this.combatStyles[x].weaponStyle.name){
        newWeaponStyle = false;
      }
    }
    if(newWeaponStyle){
      weaponStyleList.push(this.combatStyles[x].weaponStyle);
      value += (this.combatStyles[x].weaponStyle.totalSkillModifier()/(x+1))
    }
    newWeaponStyle = true;
  }
  return value;
}

schema.methods.baseRaceHealth = function baseRaceHealth(){
  if(this.race=="Human"){
    return 50;
  }
}

schema.methods.combatRankModifier = function combatRankModifier(){
  let rank = this.combatRank();
  if(rank=="Useless"){
    return "50%";
  }
  if(rank=="Almost Useless"){
    return "80%";
  }
  if(rank=="Beginner"){
    return "90%";
  }
  if(rank=="Rookie"){
    return "100%";
  }
  if(rank=="Experienced"){
    return "110%";
  }
  if(rank=="Skilled"){
    return "120%";
  }
  if(rank=="Expert"){
    return "130%";
  }
  if(rank=="Elite"){
    return "150%";
  }
  if(rank=="Masterful"){
    return "200%";
  }
  if(rank=="Legendary"){
    return "300%";
  }
  if(rank=="Mythical"){
    return "500%"
  }
}

schema.methods.combatRank = function combatRank(){
  let value = this.combatValue();
  if(value<-9){
    return "Useless"
  }
  if(value<1){
    return "Almost Useless"
  }
  if(value<10){
    return "Beginner"
  }
  if(value<20){
    return "Rookie"
  }
  if(value<40){
    return "Experienced"
  }
  if(value<70){
    return "Skilled"
  }
  if(value<100){
    return "Expert"
  }
  if(value<150){
    return "Elite"
  }
  if(value<200){
    return "Masterful"
  }
  if(value<300){
    return "Legendary"
  }
  else{
    return "Mythical"
  }
}

schema.methods.knownRace = function knownRace(playerName){
  for(let x=0; x<this.informationLevels.length; x++){
    if(this.informationLevels[x].player==playerName){
      if(this.informationLevels[x].race){
        return this.informationLevels[x].race;
      }
    }
  }
  return this.race;
}

schema.methods.baseMana = function baseMana(){
  return this.baseStat(1);
}

schema.methods.manaMods = function manaMods(){
  return 0;
}

schema.methods.baseHealth = function baseHealth(){
  let health = this.baseRaceHealth();
  let rank = this.combatRank();
  if(rank=="Useless"){
    health = health/2;
  }
  if(rank=="Almost Useless"){
    health = health*.8;
  }
  if(rank=="Beginner"){
    health = health*.9;
  }
  if(rank=="Rookie"){
    health = health;
  }
  if(rank=="Experienced"){
    health=health*1.1;
  }
  if(rank=="Skilled"){
    health=health*1.2;
  }
  if(rank=="Expert"){
    health=health*1.3;
  }
  if(rank=="Elite"){
    health=health*1.5;
  }
  if(rank=="Masterful"){
    health=health*2;
  }
  if(rank=="Legendary"){
    health=health*3;
  }
  if(rank=="Mythical"){
    health=health*5;
  }
  return parseInt(health);
}

schema.methods.health = function health(){
  let health = this.baseHealth();
  let hardy = false;
  for(let x=0; x<this.traits.specialTraits.length; x++){
    if(this.traits.specialTraits[x].name=="Hardy"){
      hardy = true;
    }
  }
  if(hardy){
    health=Math.round(health*1.1);
  }
  return parseInt(health);
}

schema.methods.healthMods = function healthMods(){
  let hardy = false;
  for(let x=0; x<this.traits.specialTraits.length; x++){
    if(this.traits.specialTraits[x].name=="Hardy"){
      hardy = true;
    }
  }
  if(hardy){
    return Math.round(this.baseHealth()*.1);
  }
  return 0;
}

schema.methods.baseStamina = function baseStamina(){
  return this.combatValue();
}

schema.methods.stamina = function stamina(){
  let staminaValue = this.baseStamina();
  let fightingSpirit = false;
  for(let x=0; x<this.spiritPowers.length; x++){
    if(this.spiritPowers[x].name=="Fighting Spirit"){
      fightingSpirit = this.spiritPowers[x];
    }
  }
  if(fightingSpirit){
    staminaValue = parseInt(staminaValue*fightingSpirit.FSstaminaMod());
  }
  return staminaValue;
}
schema.methods.staminaMods = function staminaMods(){
  let staminaValue = this.baseStamina();
  let fightingSpirit = false;
  for(let x=0; x<this.spiritPowers.length; x++){
    if(this.spiritPowers[x].name=="Fighting Spirit"){
      fightingSpirit = this.spiritPowers[x];
    }
  }
  if(fightingSpirit){
    staminaValue = parseInt(staminaValue*fightingSpirit.FSstaminaMod());
  }
  return staminaValue-this.baseStamina();
}

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
    return "Game Master"
  }
}

schema.methods.allTraits = function allTraits(){
  const allTraits = [...this.traits.metaTrait, ...this.traits.flavorTraits, ...this.traits.specialTraits, ...this.traits.personalityTraits, ...this.traits.aptitudeTraits, ...this.traits.combatAbilities, ...this.spiritPowers]
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
  console.log(player);
  if(player=="Observer"){
    return 5;
  }
  if(player=="Game Master"){
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
  console.log(this.year)
  console.log(this.birthday.year);
  let age = this.year - this.birthday.year;
  console.log(age);
  if(this.birthday.month/4<=this.season+1){
    age++;
  }
  console.log(age);
  return age;
}

schema.methods.stressLevel = function stressLevel(player){
  for(let x=0; x<this.informationLevels.length; x++){
    if(this.informationLevels[x].player==player){
      if(this.informationLevels[x].stress)
      return this.informationLevels[x].stress
    }
  }
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
  if(this.stats[0].trainedPoints){
    total += this.stats[0].trainedPoints
  }
  return total;
}
schema.methods.baseSpirituality = function baseSpirituality(){
  let total = 0;
  for(let x=0; x<this.stats[1].dice.length; x++){
    total += this.stats[1].dice[x];
  }
  if(this.stats[1].trainedPoints){
    total += this.stats[1].trainedPoints
  }
  return total;
}
schema.methods.baseSociability = function baseSociability(){
  let total = 0;
  for(let x=0; x<this.stats[2].dice.length; x++){
    total += this.stats[2].dice[x];
  }
  if(this.stats[2].trainedPoints){
    total += this.stats[2].trainedPoints
  }
  return total;
}
schema.methods.baseDeception = function baseDeception(){
  let total = 0;
  for(let x=0; x<this.stats[3].dice.length; x++){
    total += this.stats[3].dice[x];
  }
  if(this.stats[3].trainedPoints){
    total += this.stats[3].trainedPoints
  }
  return total;
}
schema.methods.baseManagement = function baseManagement(){
  let total = 0;
  for(let x=0; x<this.stats[4].dice.length; x++){
    total += this.stats[4].dice[x];
  }
  if(this.stats[4].trainedPoints){
    total += this.stats[4].trainedPoints
  }
  return total;
}
schema.methods.baseIngenuity = function baseIngenuity(){
  let total = 0;
  for(let x=0; x<this.stats[5].dice.length; x++){
    total += this.stats[5].dice[x];
  }
  if(this.stats[5].trainedPoints){
    total += this.stats[5].trainedPoints
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
  if(this.stats[index].trainedPoints){
    total += this.stats[index].trainedPoints
  }
  return total;
}
schema.methods.preTrainedStat = function preTrainedStat(index){
  let total = 0;
  for(let x=0; x<this.stats[index].dice.length; x++){
    total += this.stats[index].dice[x];
  }
  if(this.stats[index].priorityStat){
    total += this.stats[index].dice.length;
  }
  return total;
}

schema.methods.statMod = function statMod(index){
  let fullStat = this.fullStat(index);
  if(fullStat>this.limitNum(index)){
    fullStat = this.limitNum(index)
  }
  if(fullStat>5){
    return fullStat-5;
  }else if(fullStat==0){
    return -25;
  }else{
    return (fullStat-5)*5;
  }
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

schema.methods.limitNum = function limitNum(index){
  let limitNum = 30;
  if(this.race=="Fox-Person"){
    if(index==3||index==1){
      limitNum = 40;
    }
  }
  return limitNum;
}

schema.methods.limitStat = function limitStat(index){
  let fullStat = this.fullStat(index);
  let limitNum = this.limitNum(index);
  if(fullStat>limitNum){
    if(this.stats[index].limitBreak){
      return fullStat;
    }else{
      return limitNum;
    }
  }else{
    return fullStat;
  }
}

const Model = mongoose.model("Characterinfo", schema);

module.exports = Model;