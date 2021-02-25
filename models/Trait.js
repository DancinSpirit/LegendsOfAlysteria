const mongoose = require("mongoose");
const traitSchema = new mongoose.Schema(
    {
        name: {type: String},
        type: {type: String},
        description: {type: String},
        effect: {type: String},
        statModifiers: [{type: Number}]
    },
    {timestamps: true}
)

const Trait = mongoose.model("Trait", traitSchema);

module.exports = Trait;