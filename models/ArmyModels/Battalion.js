const mongoose = require("mongoose");
const Organization = require("./Organization");

const battalionSchema = Organization.discriminator('Battalion', new mongoose.Schema({
    companies: [{type: mongoose.Schema.Types.ObjectId, ref: "Company"}], 
    leader: {type: mongoose.Schema.Types.ObjectId, ref: "Character"}
}))

module.exports = mongoose.model("Battalion", battalionSchema.scheme);