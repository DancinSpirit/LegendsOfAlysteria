const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {type: String},
    rulers: [{type: mongoose.Schema.Types.ObjectId, ref: "Character"}],
    informationLevels: [{player: {type: String}, level: {type: Number}, description: {type: String}, officialStance:{type: String}, diplomaticRelations: {type:String}}],
    counties: [{type: mongoose.Schema.Types.ObjectId, ref: "County"}],
  },
  {timestamps: true}
)

const Model = mongoose.model("Duchy", schema);

module.exports = Model;