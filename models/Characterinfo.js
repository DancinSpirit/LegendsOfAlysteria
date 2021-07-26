const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    year: {type: Number},
    season: {type: Number},
    avatar: {type: String},
    firstName: {type: String},
    lastName: {type: String},
    stressLevel: {type: Number},
    birthday: {type: Date},
    birthYear: {type: Date},
  },
  {timestamps: true}
)

schema.methods.fullName = function fullName(){
  return this.firstName + " " + this.lastName;
}

schema.methods.age = function age(){
  return this.year - this.birthYear;
}

const Model = mongoose.model("Characterinfo", schema);

module.exports = Model;