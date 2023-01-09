const mongoose = require("mongoose");

const schema = new mongoose.Schema(
{
    name: {type: String},
    combatants: [{type: mongoose.Schema.Types.ObjectId, ref: "Combatant"}],
},
  {timestamps: true}
)

const Model = mongoose.model("Duel", schema);

module.exports = Model;