const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {type: String},
    effect: {type: String}
  },
  {timestamps: true}
)

const Model = mongoose.model("Passiveability", schema);

module.exports = Model;