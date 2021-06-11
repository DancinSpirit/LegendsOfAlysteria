const express = require("express");
const router = express.Router();
const db = require("../models");

/* Characters Index */
router.get("/:id", async function(req, res){
    const character = await db.Combatant.findById(req.params.id).populate("activeAbilities passiveAbilities rerolls");
    res.send(character);
})

/* Return Roll */
router.get("/:id/returnRoll", async function(req,res){
    const character = await db.Combatant.findById(req.params.id);
    const roll = character.returnRoll();
    console.log("ROLL: " + roll)
    res.send(`${roll}`);
})

/* Return Roll String */
router.get("/:id/:function/:params", async function(req,res){
    const character = await db.Combatant.findById(req.params.id);
    const setRolls = toNumbers(req.params.params.split("+"));
    console.log(setRolls);
    eval(`character.${req.params.function}([${setRolls}])`)
    res.send(`${character.returnRollString()}`);
})

const toNumbers = arr => arr.map(Number);

module.exports = router;