const mongoose = require("mongoose");
const skillSchema = new mongoose.Schema(
    {
        name: {type: String},
        info: {type: mongoose.Schema.Types.ObjectId, ref: "Trainable"},
        relatedKnowledge: {type: mongoose.Schema.Types.ObjectId, ref: "RelatedKnowledge"},
    },
    {timestamps: true}
)

const Skill = mongoose.model("Skill", skillSchema);

module.exports = Skill;