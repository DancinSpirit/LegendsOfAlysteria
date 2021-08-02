const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    rulers: [{type: mongoose.Schema.Types.ObjectId, ref: "Character"}],
  },
  {timestamps: true}
)

const Model = mongoose.model("County", schema);

module.exports = Model;