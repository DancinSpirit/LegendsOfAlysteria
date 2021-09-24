const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {type: String},
    effect: {type: String}
  },
  {timestamps: true}
)

const Model = mongoose.model("Activeability", schema);

module.exports = Model;