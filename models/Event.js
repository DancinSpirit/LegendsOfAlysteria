const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    type: {type: String}, //Title Top
    title: {type: String}, //Main Title
    subtitle: {type: String}, //Title Bottom
    background: {type: String},
    text: [{type: String}]
  },
  {timestamps: true}
)

const Model = mongoose.model("Event", schema);

module.exports = Model;