const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    currentTurn: {type: String},
    currentYear: {type: String},
    currentSeason: {type: String},
    name: {type: String},
    years: [{
      seasons: [{
        name: {type: String},
        regionPhases: [{
            name: {type: String},
            emblem: {type: String},
            players: [{name: {type: String}, character: {type: String}}],
            rulerPhases: [{
              name: {type: String},
              player: {type: String},
              events: [{type: mongoose.Schema.Types.ObjectId, ref: "Event"}]
            }],
        }]
      }]
    }]
  },
  {timestamps: true}
)

const Model = mongoose.model("Story", schema);

module.exports = Model;