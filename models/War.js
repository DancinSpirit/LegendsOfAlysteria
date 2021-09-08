const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    map: {type: String},
    width: {type: Number},
    height: {type: Number}
  },
  {timestamps: true}
)

const Model = mongoose.model("War", schema);

module.exports = Model;