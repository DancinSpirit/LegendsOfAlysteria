const mongoose = require("mongoose");
const schema = new mongoose.Schema(
    {
        generalKnowledge: [{type: mongoose.Schema.Types.ObjectId, ref: "Knowledge"}],
        specializedKnowledge: [{type: mongoose.Schema.Types.ObjectId, ref: "Knowledge"}],
        highlySpecializedKnowledge: [{type: mongoose.Schema.Types.ObjectId, ref: "Knowledge"}],
        bonusKnowledge: [{type: mongoose.Schema.Types.ObjectId, ref: "Knowledge"}],
        skills: [{type: mongoose.Schema.Types.ObjectId, ref: "Knowledge"}],
        specialties: [{type: mongoose.Schema.Types.ObjectId, ref: "Specialty"}]
    },
    {timestamps: true}
)

const KnowledgeTree = mongoose.model("Knowledgetree", schema);

module.exports = KnowledgeTree;