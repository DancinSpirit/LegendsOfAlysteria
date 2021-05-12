const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
  {
    story: {type: mongoose.Schema.Types.ObjectId, ref: "Story"},
  },
  {timestamps: true}
)

const Player = mongoose.model("Player", playerSchema);

module.exports = Player;