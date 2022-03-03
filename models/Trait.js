const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {type: String},
    description: {type: String},
    effect: {type: String},
    type: {type: String},
    //Meta: 0, Special: 1, Aptitude: 2, Personality: 3, Knowledge: 4
    statModifiers: [{type:Number}],
  },
  {timestamps: true}
)

const Model = mongoose.model("Trait", schema);

module.exports = Model;