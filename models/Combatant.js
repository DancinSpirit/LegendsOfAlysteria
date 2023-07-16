const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    player: {type: "String"},
    name: {type: "String"},
    attackModifiers: [{name: {type: String}, value: {type: Number}}],
    defenseModifiers: [{name: {type: String}, value: {type: Number}}],
    parry: {type: Number},
    health: {type: Number},
    maxHealth: {type: Number},
    stamina: {type: Number},
    maxStamina: {type: Number},
    staminaWeightMod: {type: Number},
    woundedLevel: {type: Number,default:0},
    exhaustionLevel: {type: Number, default: 0},
    armor: {melee: {type: Number}, ranged: {type: Number}, durability: {type: Number}, maxDurability: {type: Number}},
    directDamage: {type: Number},
    armorPenetration: {type: Number},
    fightingStyles: [{type: String}],
    inCombatWith: [{type: String}],
    tempModifiers: []
  },
  {timestamps: true}
)

const Model = mongoose.model("Combatant", schema);

module.exports = Model;