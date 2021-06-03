const mongoose = require("mongoose");

const duchySchema = new mongoose.Schema(
  {
    name: {type: String},
    counties: [{type: mongoose.Schema.Types.ObjectId, ref: "County"}],
    army: {type: mongoose.Schema.Types.ObjectId, ref: "Army"}
  },
  {timestamps: true}
)

const Duchy = mongoose.model("Duchy", duchySchema);

module.exports = Duchy;