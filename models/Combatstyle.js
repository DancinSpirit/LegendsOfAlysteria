const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {type: String},
    weaponStyle: {type: mongoose.Schema.Types.ObjectId, ref: "Knowledge"},
    fightingStyles: [{type: mongoose.Schema.Types.ObjectId, ref: "Fightingstyle"}],
    weaponTypes: [{type: mongoose.Schema.Types.ObjectId, ref: "Weapontype"}],
    rerolls: [{amount: {type: Number}, reroll: {name: {type: String}}}],
    equipment: [{type: mongoose.Schema.Types.ObjectId, ref: "Equipment"}],
    passiveAbilities: [{type: mongoose.Schema.Types.ObjectId, ref: "Passiveability"}],
    specialAbilities: [{type: mongoose.Schema.Types.ObjectId, ref: "Activeability"}],
    character: {type: mongoose.Schema.Types.ObjectId, ref: "CharacterInfo"},
  },
  {timestamps: true}
)

const Model = mongoose.model("Combatstyle", schema);

module.exports = Model;