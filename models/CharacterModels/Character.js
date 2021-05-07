const mongoose = require("mongoose");
const characterSchema = new mongoose.Schema(
    {
        currentInfo: {type: mongoose.Schema.Types.ObjectId, ref: "CharacterInfo"},
        infoFromTurn: [{type: mongoose.Schema.Types.ObjectId, ref: "CharacterInfo"}],
    },
    {timestamps: true}
)

const Character = mongoose.model("Character", characterSchema);

module.exports = Character;