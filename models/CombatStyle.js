const mongoose = require("mongoose");
const combatStyleSchema = new mongoose.Schema(
    {
        name: {type: String},
        weaponStyle: {type: mongoose.Schema.Types.ObjectId, ref: "Knowledge"},
        fightingStyles: [{type: mongoose.Schema.Types.ObjectId, ref: "FightingStyle"}],
        weaponTypes: [{type: mongoose.Schema.Types.ObjectId, ref: "WeaponType"}],
        rerolls: [{amount: {type: Number}, reroll: {type: mongoose.Schema.Types.ObjectId, ref: "Reroll"}}],
        equipment: [{type: mongoose.Schema.Types.ObjectId, ref: "Equipment"}],
        passiveAbilities: [{type: mongoose.Schema.Types.ObjectId, ref: "PassiveAbility"}],
        specialAbilities: [{type: mongoose.Schema.Types.ObjectId, ref: "ActiveAbility"}],
        character: {type: mongoose.Schema.Types.ObjectId, ref: "CharacterInfo"},
    },
    {timestamps: true}
)

const CombatStyle = mongoose.model("CombatStyle", combatStyleSchema);

module.exports = CombatStyle;