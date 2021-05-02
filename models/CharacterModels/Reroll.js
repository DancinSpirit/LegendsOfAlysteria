const mongoose = require("mongoose");
const rerollSchema = new mongoose.Schema(
    {
        name: {type: String}
    },
    {timestamps: true}
)

const Reroll = mongoose.model("Reroll", rerollSchema);

module.exports = Reroll;