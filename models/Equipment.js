const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {type: String},
    type: {type: String},
    effect: {type: String}
  },
  {timestamps: true}
)

const Model = mongoose.model("Equipment", schema);

module.exports = Model;