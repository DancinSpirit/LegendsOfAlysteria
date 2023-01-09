const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    player: {type: String},
    name: {type: String},
    avatar: {type: String},
    version: {type: String},
    health: {type: Number},
    maxHealth: {type: Number},
    stamina: {type: Number},
    maxStamina: {type: Number},
    mana: {type: Number},
    maxMana: {type: Number},
    activeAbilities: [{type: mongoose.Schema.Types.ObjectId, ref: "Activeability"}],
    passiveAbilities: [{type: mongoose.Schema.Types.ObjectId, ref: "Passiveability"}],
    attackModifiers: [{name: {type: String},value: {type: Number}}],
    defenseModifiers: [{name: {type: String},value: {type: Number}}],
    tempModifiers: [{name: {type: String},value: {type: Number}}],
    sprinting: {type: Boolean, default: false},
    sprintValue: {type: Number, default: 2},
    staminaWeightMod: {type: Number},
    fightingStyles: [],
    colors: {light: {type: String}, dark: {type: String}, darker: {type: String}, highlight: {type: String}, background: {type: String}},
  },
  {timestamps: true}
)

schema.methods.decreaseStamina = function decreaseStamina(amount){
  this.stamina = this.stamina - amount*this.staminaWeightMod;
}

const Model = mongoose.model("Combatant", schema);

module.exports = Model;