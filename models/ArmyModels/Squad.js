const mongoose = require("mongoose");
const Organization = require("./Organization");

const squadSchema = Organization.discriminator('Squad', new mongoose.Schema({
    teams: [{type: mongoose.Schema.Types.ObjectId, ref: "Team"}] 
}))

module.exports = mongoose.model("Squad", squadSchema.scheme);