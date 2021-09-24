const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {type: String},
    attack: {type: Number},
    defense: {type: Number},
    armorPenetration: {type: Number},
    directDamage: {type: Number},
    passiveAbility: {type: mongoose.Schema.Types.ObjectId, ref: "PassiveAbility"},
    specialAbility: {type: mongoose.Schema.Types.ObjectId, ref: "ActiveAbility"},
  },
  {timestamps: true}
)

const Model = mongoose.model("Weapontype", schema);

module.exports = Model;