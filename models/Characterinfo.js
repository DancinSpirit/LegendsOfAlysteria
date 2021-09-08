const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    year: {type: Number},
    season: {type: Number},
    avatar: {type: String},
    firstName: {type: String},
    lastName: {type: String},
    stress: {type: Number},
    birthday: {type: Date},
    stress: {type: Number},
    fateRerolls: {available: {type: Number},max: {type: Number}},
    mana: {available: {type: Number},max: {type: Number}},
    profession: {type: String},
    savings: {type: Number},
    salary: {type: Number},
    lifestyle: {type: Number},
    description: {type: String},
    stats: [{
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

  },
  {timestamps: true}
)

schema.methods.fullName = function fullName(){
  return this.firstName + " " + this.lastName;
}

schema.methods.age = function age(){
  return this.year - this.birthYear;
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

schema.methods.athletics = function athletics(){
  let total = 0;
  for(let x=0; x<this.stats[0].length; x++){
    total += this.stats[0][x];
  }
  return total;
}
schema.methods.spirituality = function spirituality(){
  let total = 0;
  for(let x=0; x<this.stats[1].length; x++){
    total += this.stats[1][x];
  }
  return total;
}
schema.methods.sociability = function sociability(){
  let total = 0;
  for(let x=0; x<this.stats[0].length; x++){
    total += this.stats[0][x];
  }
  return total;
}
schema.methods.deception = function deception(){
  let total = 0;
  for(let x=0; x<this.stats[0].length; x++){
    total += this.stats[0][x];
  }
  return total;
}
schema.methods.management = function management(){
  let total = 0;
  for(let x=0; x<this.stats[0].length; x++){
    total += this.stats[0][x];
  }
  return total;
}
schema.methods.learning = function learning(){
  let total = 0;
  for(let x=0; x<this.stats[0].length; x++){
    total += this.stats[0][x];
  }
  return total;
}

const Model = mongoose.model("Characterinfo", schema);

module.exports = Model;