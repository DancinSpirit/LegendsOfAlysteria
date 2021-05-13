const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {type: String},
    type: {type: String},
    season: {type: mongoose.Schema.Types.ObjectId, ref: "Season"},
    phase: {type: String},
    location: {type: String},
    text: [{type: String}]
  },
  {timestamps: true}
)

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;