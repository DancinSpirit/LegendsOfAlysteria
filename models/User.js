const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    firstName: {type: String},
    lastName: {type: String},
    gamemaster: {type: Boolean},
    playerCharacters: [{type: mongoose.Schema.Types.ObjectId, ref: "Player"}],
    settings: {
      textSpeed: {type: Number},
      pageSpeed: {type: Number},
      musicVolume: {type: Number},
      soundVolume: {type: Number},
      pageScroll: {type: Boolean, default: true}
    }
  },
  {timestamps: true}
)

schema.methods.fullName = function fullname(){
  return this.firstName + " " + this.lastName;
}

const Model = mongoose.model("User", schema);

module.exports = Model;