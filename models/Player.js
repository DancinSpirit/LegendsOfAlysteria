const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
  {
    character: {type: mongoose.Schema.Types.ObjectId, ref: "Character"},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    story: {type: mongoose.Schema.Types.ObjectId, ref: "Story"},
  },
  {timestamps: true}
)

const Player = mongoose.model("Player", playerSchema);

module.exports = Player;