const mongoose = require("mongoose");
const organizationSchema = new mongoose.Schema(
    {
        name: {type: String},
        leader: {type: mongoose.Schema.Types.ObjectId, ref: "Character"}
    },
    {timestamps: true, discriminatorKey: "_type"}
)

const Organization = mongoose.model("Organization", organizationSchema);

module.exports = Organization;