const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    
  },
  {timestamps: true}
)

const Model = mongoose.model("Combatant", schema);

module.exports = Model;