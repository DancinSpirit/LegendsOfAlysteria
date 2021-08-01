const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    currentYear: {type: Number},
    currentSeason: {type: Number},
    currentTurn: {type: Number}
  },
  {timestamps: true}
)

const Model = mongoose.model("Game", schema);

module.exports = Model;