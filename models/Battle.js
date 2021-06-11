const mongoose = require("mongoose");
const battleSchema = new mongoose.Schema(
  {
    character1: {type: mongoose.Schema.Types.ObjectId, ref: "Combatant"},
    character2: {type: mongoose.Schema.Types.ObjectId, ref: "Combatant"}
  },
  {timestamps: true}
)
const Battle = mongoose.model("Battle", battleSchema); 


battleSchema.methods.attack = function attack(character,rollSet){
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
battleSchema.methods.defend = function attack(character,rollSet){
    this.dice.clear();
    this.dice.rollString = `<p>${this.name} Defends!</p>`
    for(let x=0; x<this.modifiers.length; x++){
        if(this.modifiers[x].name == "Defense Modifiers"){
            this.dice.addModifier(this.modifiers[x]);
        }
    }
    if(rollSet){
        return this.dice.artificialRoll(character,rollSet);
    }else{

    }
}
battleSchema.methods.activateCounter = function attack(character,rollSet){
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

battleSchema.methods.returnRoll = function returnRoll(character){
    return this.dice.finalResult;
}

battleSchema.methods.returnRollString = function returnRollString(character){
    let rollString = this.dice.rollString;
    this.dice.rollString = "";
    return rollString;
}

module.exports = Battle;