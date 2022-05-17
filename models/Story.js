const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    eventNames: [],
    currentTurn: {type: String},
    currentYear: {type: String},
    currentSeason: {type: String},
    name: {type: String},
    progress: {
      finished: {type: Boolean, default: false},
      edited: {type: Boolean, default: false},
      complete: {type: Boolean, default: false}
    },
    years: [{
      progress: {
        finished: {type: Boolean, default: false},
        edited: {type: Boolean, default: false},
        complete: {type: Boolean, default: false}
      },
      seasons: [{
        name: {type: String},
        progress: {
          finished: {type: Boolean, default: false},
          edited: {type: Boolean, default: false},
          complete: {type: Boolean, default: false}
        },
        regionPhases: [{
          name: {type: String},
          progress: {
            finished: {type: Boolean, default: false},
            edited: {type: Boolean, default: false},
            complete: {type: Boolean, default: false}
          },
          emblem: {type: String},
          players: [{name: {type: String}, character: {type: String}}],
          rulerPhases: [{
            name: {type: String},
            progress: {
              finished: {type: Boolean, default: false},
              edited: {type: Boolean, default: false},
              complete: {type: Boolean, default: false}
            },
            player: {type: String},
            events: [{type: mongoose.Schema.Types.ObjectId, ref: "Event"}],
            eventProgress: [{
              event: {type: mongoose.Schema.Types.ObjectId, ref: "Event"},
              finished: {type: Boolean, default: false},
              edited: {type: Boolean, default: false},
              complete: {type: Boolean, default: false}
            }]
          }] 
        }]
      }]
    }]
  },
  {timestamps: true}
)

const Model = mongoose.model("Story", schema);

module.exports = Model;