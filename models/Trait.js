const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {type: String},
    description: {type: String},
    effect: {type: String},
    type: {type: String}
  },
  {timestamps: true}
)

const Model = mongoose.model("Trait", schema);

module.exports = Model;