const mongoose = require("mongoose");
const schema = new mongoose.Schema(
    {
        name: {type: String},
        advantageOver: {type: mongoose.Schema.Types.ObjectId, ref: "Fightingstyle"},
        weakAgainst: {type: mongoose.Schema.Types.ObjectId, ref: "Fightingstyle"},
        reroll: {type: String},
        effect: {type: String},
    },
    {timestamps: true}
)

const Model = mongoose.model("Fightingstyle", schema);

module.exports = Model;