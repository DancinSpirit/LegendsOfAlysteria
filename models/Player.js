const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    character: {type: mongoose.Schema.Types.ObjectId, ref: "Character"},
    stories: [{type: mongoose.Schema.Types.ObjectId, ref: "Story"}],
    name: {type: String}
  },
  {timestamps: true}
)

const Model = mongoose.model("Player", schema);

module.exports = Model;