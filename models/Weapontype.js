const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {type: String},
    attack: {type: Number},
    defense: {type: Number},
    armorPenetration: {type: Number},
    directDamage: {type: Number},
    passiveAbilities: [{type: mongoose.Schema.Types.ObjectId, ref: "Passiveability"}],
    specialAbility: {type: mongoose.Schema.Types.ObjectId, ref: "Activeability"},
  },
  {timestamps: true}
)

const Model = mongoose.model("Weapontype", schema);

module.exports = Model;