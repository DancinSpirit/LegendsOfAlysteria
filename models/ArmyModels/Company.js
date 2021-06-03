const mongoose = require("mongoose");
const Organization = require("./Organization");

const companySchema = Organization.discriminator('Company', new mongoose.Schema({
    platoons: [{type: mongoose.Schema.Types.ObjectId, ref: "Platoon"}] 
}))

module.exports = mongoose.model("Company", companySchema.scheme);