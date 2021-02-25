const mongoose = require("mongoose");
const knowledgeSchema = new mongoose.Schema(
    {
        name: {type: String},
        info: {type: mongoose.Schema.Types.ObjectId, ref: "Trainable"},
        relatedKnowledge: {type: mongoose.Schema.Types.ObjectId, ref: "RelatedKnowledge"},
    },
    {timestamps: true}
)

const Knowledge = mongoose.model("Knowledge", knowledgeSchema);

module.exports = Knowledge;