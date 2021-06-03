const mongoose = require("mongoose");
const Organization = require("./Organization");

const brigadeSchema = Organization.discriminator('Brigade', new mongoose.Schema({
    battalions: [{type: mongoose.Schema.Types.ObjectId, ref: "Battalion"}] 
}))

module.exports = mongoose.model("Brigade", brigadeSchema.scheme);