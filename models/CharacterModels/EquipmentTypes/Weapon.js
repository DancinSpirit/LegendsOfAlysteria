const mongoose = require("mongoose");
const EquipmentType = require("../EquipmentType");

const weaponSchema = EquipmentType.discriminator('Weapon', new mongoose.Schema({
    defense: {type: Number},
    armorPenetration: {type: Number},
    directDamage: {type: Number},
    weight: {type: Number},
}))

module.exports = mongoose.model("Weapon", weaponSchema.scheme);