const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/:id", async function(req,res){
    const foundCharacter = await db.Character.findById(req.params.id).populate("currentInfo");
    res.render("components/character", {state: "character", character: foundCharacter});
})

module.exports = router;