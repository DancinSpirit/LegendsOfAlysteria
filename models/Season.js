const mongoose = require("mongoose");

const seasonSchema = new mongoose.Schema(
  {
    turn: {type: Number},
    year: {type: Number},
    season: {type: String},
    story: {type: mongoose.Schema.Types.ObjectId, ref: "Story"},
    worldPhase: [{type: mongoose.Schema.Types.ObjectId, ref: "Event"}],
    kingdomPhase: [{type: mongoose.Schema.Types.ObjectId, ref: "Event"}],
    rulerPhases: [[{type: mongoose.Schema.Types.ObjectId, ref: "Event"}]],

  },
  {timestamps: true}
)

const Season = mongoose.model("Season", seasonSchema);

module.exports = Season;