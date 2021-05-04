const mongoose = require("mongoose");
const EquipmentType = require("../EquipmentType");

const armorSchema = EquipmentType.discriminator('Armor', new mongoose.Schema({
    meleeArmor: {type: Number},
    rangedArmor: {type: Number},
    durability: {available: {type: Number}, max: {type: Number}},
    weight: {type: Number},
}))

module.exports = mongoose.model("Armor", armorSchema.scheme);