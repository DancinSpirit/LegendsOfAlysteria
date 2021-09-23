const mongoose = require("mongoose");
const specialtySchema = new mongoose.Schema(
    {
        name: {type: String},
        info: {type: mongoose.Schema.Types.ObjectId, ref: "Trainable"},
        knowledgeTree: {type: mongoose.Schema.Types.ObjectId, ref: "Knowledgetree"},
        effect: {type: String},
        specialEffect: {type: Object}
    },
    {timestamps: true}
)

const Specialty = mongoose.model("Specialty", specialtySchema);

module.exports = Specialty;