const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    counties: [{type: mongoose.Schema.Types.ObjectId, ref: "County"}],
  },
  {timestamps: true}
)

const Model = mongoose.model("Duchy", schema);

module.exports = Model;