const mongoose = require("mongoose");
const schema = new mongoose.Schema(
    {
        name: {type: String},
        type: {type: String},
        battle: {type: Boolean},
        active: {type: Boolean},
        info: {type: mongoose.Schema.Types.ObjectId, ref: "Trainable"},
        description: {type: String},
        effect: {type: String},
    },
    {timestamps: true}
)

const Spiritpower = mongoose.model("Spiritpower", schema);

module.exports = Spiritpower;