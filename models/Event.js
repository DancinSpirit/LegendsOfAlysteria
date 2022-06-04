const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    type: {type: String}, //Title Top
    title: {type: String}, //Main Title
    subtitle: {type: String}, //Title Bottom
    background: {type: String},
    startingMusic: {type: String},
    text: [{type: String}],
    progress: {
      finished: {type: Boolean, default: false},
      edited: {type: Boolean, default: false},
      complete: {type: Boolean, default: false},
    }
  },
  {timestamps: true}
)

const Model = mongoose.model("Event", schema);

module.exports = Model;