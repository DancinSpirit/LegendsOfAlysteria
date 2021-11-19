const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {type: String},
    type: {type: String},
    subtype: {type: String},
    description: {type: String},
    defense: {type: Number},
    armorPenetration: {type: Number},
    directDamage: {type: Number},
    weight: {type: Number},
    meleeArmor: {type: Number},
    rangedArmor: {type: Number},
    durability: {available: {type: Number}, max: {type: Number}}
  },
  {timestamps: true}
)

const Model = mongoose.model("Equipment", schema);

module.exports = Model;