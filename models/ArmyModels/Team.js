const mongoose = require("mongoose");
const Organization = require("./Organization");

const teamSchema = Organization.discriminator('Team', new mongoose.Schema({
    units: [{type: mongoose.Schema.Types.ObjectId, ref: "Character"}] 
}))

module.exports = mongoose.model("Team", teamSchema.scheme);