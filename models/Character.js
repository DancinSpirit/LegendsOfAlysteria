const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {type: String},
    turnInfo: [[{type: mongoose.Schema.Types.ObjectId, ref: "CharacterInfo"}]],
    type: {type: String},
    colors: {light: {type: String}, dark: {type: String}, darker: {type: String}, highlight: {type: String}, background: {type: String}},
  },
  {timestamps: true}
)

const Model = mongoose.model("Character", schema);

module.exports = Model;