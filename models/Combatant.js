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
    activeAbilities: [{type: mongoose.Schema.Types.ObjectId, ref: "Activeability"}],
    passiveAbilities: [{type: mongoose.Schema.Types.ObjectId, ref: "Passiveability"}],
    rerolls: [{name: {type: String},amount: {type: Number}, max: {type: Number}}],
    modifiers: [{name: {type: String},value: {type: Number}}],
    sprinting: {type: Boolean, default: false},
    sprintValue: {type: Number, default: 2},
  },
  {timestamps: true}
)

const Model = mongoose.model("Combatant", schema);

module.exports = Model;