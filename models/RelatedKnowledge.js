const mongoose = require("mongoose");
const relatedKnowledgeSchema = new mongoose.Schema(
    {
        generalKnowledge: [{type: mongoose.Schema.Types.ObjectId, ref: "Knowledge"}],
        specializedKnowledge: [{type: mongoose.Schema.Types.ObjectId, ref: "Knowledge"}],
        highlySpecializedKnowledge: [{type: mongoose.Schema.Types.ObjectId, ref: "Knowledge"}],
        bonusKnowledge: [{type: mongoose.Schema.Types.ObjectId, ref: "Knowledge"}],
        skills: [{type: mongoose.Schema.Types.ObjectId, ref: "Knowledge"}]
    },
    {timestamps: true}
)

const RelatedKnowledge = mongoose.model("RelatedKnowledge", relatedKnowledgeSchema);

module.exports = RelatedKnowledge;