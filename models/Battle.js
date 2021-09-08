const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {type: String},
    map: {type: String},
    width: {type: Number},
    height: {type: Number},
    gridBoxes: [[{background: {type: String}, token: {type: Object}, unit: {type: String}}]],
    combatants: [{type: mongoose.Schema.Types.ObjectId, ref: "Combatant"}],
    rounds: [{
        movementPhase: {},
        movementReactPhase: {},
        actionPhase: {},
        actionReactPhase: {}
    }],
    players: [{name: {type: String}, combatants: [{type: String}]}]
  },
  {timestamps: true}
)

const Model = mongoose.model("Battle", schema);

module.exports = Model;