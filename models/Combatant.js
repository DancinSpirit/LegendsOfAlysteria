const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
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
    modifiers: [{name: {type: String},value: {type: Number}}],
    sprinting: {type: Boolean, default: false},
    sprintValue: {type: Number, default: 2},
    staminaWeightMod: {type: Number},
  },
  {timestamps: true}
)

schema.methods.decreaseStamina = function decreaseStamina(amount){
  this.stamina = this.stamina - amount*this.staminaWeightMod;
}

const Model = mongoose.model("Combatant", schema);

module.exports = Model;