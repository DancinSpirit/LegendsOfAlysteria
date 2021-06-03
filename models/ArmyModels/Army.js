const mongoose = require("mongoose");

const armySchema = new mongoose.Schema(
  {
    name: {type: String},
    description: {type: String},
    reccomendedOrganization: {type: String},
    unitOrganizations: [{name: {type: String}, organizationalType: {type: String}, organizations: []}]
  },
  {timestamps: true}
)

const Army = mongoose.model("Army", armySchema);

module.exports = Army;