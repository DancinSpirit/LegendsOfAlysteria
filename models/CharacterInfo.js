const mongoose = require("mongoose");
const characterInfoSchema = new mongoose.Schema(
    {
        firstName: {type: String},
        lastName: {type: String},
        birthday: {type: Number},
        age: {type: Number},
        stressLevel: {type: Number},
        fateRerolls: {available: {type: Number}, max: {type: Number}},
        mana: {available: {type: Number}, max: {type: Number}},
        profession: {type: String},
        savings: {type: Number}, 
        salary: {type: Number}, 
        lifestyle: {type: Number},
        description: {type: String},
        stats: [{type: mongoose.Schema.Types.ObjectId, ref: "CharacterStats"}],
    },
    {timestamps: true}
)

const CharacterInfo = mongoose.model("CharacterInfo", characterInfoSchema);

module.exports = CharacterInfo;


