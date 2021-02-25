const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/:id", async function(req,res){
    res.render("main",{state: "character"});
})

router.get("/:id/component", async function(req,res){
    const foundCharacter = await db.Character.findById(req.params.id).populate({path:"currentInfo",populate:{path:"stats"}});
    res.render("components/character", {character: foundCharacter});
})

module.exports = router;