const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    turnInfo: [{type: mongoose.Schema.Types.ObjectId, ref: "CharacterInfo"}],
    type: {type: String}
  },
  {timestamps: true}
)

const Model = mongoose.model("Character", schema);

module.exports = Model;