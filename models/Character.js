const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {type: String},
    turnInfo: [[{type: mongoose.Schema.Types.ObjectId, ref: "CharacterInfo"}]],
  },
  {timestamps: true}
)

const Model = mongoose.model("Character", schema);

module.exports = Model;