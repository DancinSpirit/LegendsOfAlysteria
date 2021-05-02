const mongoose = require("mongoose");
const passiveAbilitySchema = new mongoose.Schema(
    {
        name: {type: String},
        effect: {type: String}
    },
    {timestamps: true}
)

const PassiveAbility = mongoose.model("PassiveAbility", passiveAbilitySchema);

module.exports = PassiveAbility;