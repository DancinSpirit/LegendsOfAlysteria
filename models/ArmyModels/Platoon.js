const mongoose = require("mongoose");
const Organization = require("./Organization");

const platoonSchema = Organization.discriminator('Platoon', new mongoose.Schema({
    squads: [{type: mongoose.Schema.Types.ObjectId, ref: "Squad"}] 
}))

module.exports = mongoose.model("Platoon", platoonSchema.scheme);