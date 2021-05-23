const mongoose = require("mongoose");
const fightingStyleSchema = new mongoose.Schema(
    {
        name: {type: String},
        advantageOver: {type: mongoose.Schema.Types.ObjectId, ref: "FightingStyle"},
        weakAgainst: {type: mongoose.Schema.Types.ObjectId, ref: "FightingStyle"},
        reroll: {type: mongoose.Schema.Types.ObjectId, ref: "Reroll"},
        effect: {type: String},
    },
    {timestamps: true}
)

const FightingStyle = mongoose.model("FightingStyle", fightingStyleSchema);

module.exports = FightingStyle;