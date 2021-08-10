const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    character: {type: mongoose.Schema.Types.ObjectId, ref: "Character"},
    story: {type: mongoose.Schema.Types.ObjectId, ref: "Story"},
    name: {type: String},
    colors: {light: {type: String}, dark: {type: String}, darker: {type: String}, highlight: {type: String}, background: {type: String}},
    background: {type: String}
  },
  {timestamps: true}
)

const Model = mongoose.model("Player", schema);

module.exports = Model;