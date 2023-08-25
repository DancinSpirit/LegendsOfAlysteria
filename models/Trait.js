const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {type: String},
    description: {type: String},
    effect: {type: String},
    type: {type: String},
    //Meta: 0, Special: 1, Aptitude: 2, Personality: 3, Flavor: 4 <NEED TO CHANGE TO WORDS
    statModifiers: [{type:Number}],
    amount: {type:Number},
    unusable: {dueTo:{type: String}},
    replaced: {by:{type:String},dueTo:{type:String},effect:{type: String}}
  },
  {timestamps: true}
)

const Model = mongoose.model("Trait", schema);

module.exports = Model;