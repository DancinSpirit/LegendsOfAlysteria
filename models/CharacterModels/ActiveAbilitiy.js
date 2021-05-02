const mongoose = require("mongoose");
const activeAbilitySchema = new mongoose.Schema(
    {
        name: {type: String},
        effect: {type: String}
    },
    {timestamps: true}
)

const ActiveAbility = mongoose.model("ActiveAbility", activeAbilitySchema);

module.exports = ActiveAbility;