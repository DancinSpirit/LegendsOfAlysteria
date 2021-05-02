const mongoose = require("mongoose");
const equipmentTypeSchema = new mongoose.Schema(
    {
        name: {type: String},

    },
    {timestamps: true, discriminatorKey: "_type"}
)

const EquipmentType = mongoose.model("EquipmentType", equipmentTypeSchema);

module.exports = EquipmentType;