const mongoose = require("mongoose");
const Dice = require("../dieRoller");
const combatantSchema = new mongoose.Schema(
  {
    name: {type: String},
    avatar: {type: String},
    version: {type: String},
    health: {type: Number},
    maxHealth: {type: Number},
    stamina: {type: Number},
    maxStamina: {type: Number},
    activeAbilities: [{type: mongoose.Schema.Types.ObjectId, ref: "ActiveAbility"}],
    passiveAbilities: [{type: mongoose.Schema.Types.ObjectId, ref: "PassiveAbility"}],
    rerolls: [{type: mongoose.Schema.Types.ObjectId, ref: "Reroll"}],
    modifiers: [{name: {type: String},value: {type: Number}}],
    dice: {type: Object}
  },
  {timestamps: true}
)

combatantSchema.methods.createDice = function createDice(){
    this.dice = new Dice();
    console.log(this.dice);
}

combatantSchema.methods.attack = function attack(rollSet){
    this.dice.clear();
    this.dice.rollString = `<p>${this.name} Attacks!</p>`
    for(let x=0; x<this.modifiers.length; x++){
        if(this.modifiers[x].name == "Attack Modifiers"){
            this.dice.addModifier(this.modifiers[x]);
        }
    }
    if(rollSet){
        return this.dice.artificialRoll(rollSet);
    }else{

    }
}
combatantSchema.methods.defend = function attack(rollSet){
    this.dice.clear();
    this.dice.rollString = `<p>${this.name} Defends!</p>`
    for(let x=0; x<this.modifiers.length; x++){
        if(this.modifiers[x].name == "Defense Modifiers"){
            this.dice.addModifier(this.modifiers[x]);
        }
    }
    if(rollSet){
        return this.dice.artificialRoll(rollSet);
    }else{

    }
}
combatantSchema.methods.activateCounter = function attack(rollSet){
    this.dice.clear();
    this.dice.rollString = `<p>${this.name} Counters!</p>`
    for(let x=0; x<this.modifiers.length; x++){
        if(this.modifiers[x].name == "Counter"){
            this.dice.addModifier(this.modifiers[x]);
            this.modifiers.splice(x,1);
            x--;
        }
    }
    if(rollSet){
        return this.dice.artificialRoll(rollSet);
    }else{

    }
}

combatantSchema.methods.returnRoll = function returnRoll(){
    return this.dice.finalResult;
}

combatantSchema.methods.returnRollString = function returnRollString(){
    let rollString = this.dice.rollString;
    this.dice.rollString = "";
    return rollString;
}
const Combatant = mongoose.model("Combatant", combatantSchema); 

module.exports = Combatant;