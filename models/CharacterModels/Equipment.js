const mongoose = require("mongoose");
const equipmentSchema = new mongoose.Schema(
    {
        name: {type: String},
        type: {type: mongoose.Schema.Types.ObjectId, ref: "EquipmentType"},
        description: {type: String},
    },
    {timestamps: true}
)

const Equipment = mongoose.model("Equipment", equipmentSchema);

module.exports = Equipment;