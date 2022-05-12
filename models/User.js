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
      textSpeed: {type: Number, default: 50},
      pageSpeed: {type: Number, default: 1000},
      musicVolume: {type: Number, default: 0.25},
      soundVolume: {type: Number, default: 0.25},
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