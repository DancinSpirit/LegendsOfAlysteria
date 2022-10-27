const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {type: String},
    map: {type: String}, //Background Map Image
    width: {type: Number},
    height: {type: Number},
    grid: [[{terrain: {type: String}, unit: {type: String}}]],
    combatants: [{type: mongoose.Schema.Types.ObjectId, ref: "Combatant"}],
    players: [{name: {type: String}, combatants: [{type: String}]}],
  },
  {timestamps: true}
)

const Model = mongoose.model("Battle", schema);

module.exports = Model;