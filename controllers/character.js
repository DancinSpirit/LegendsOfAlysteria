const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/:id", async function(req,res){
    const foundCharacter = await db.Character.findById(req.params.id).populate("currentInfo");
    res.render("main",{state: "character", theme: foundCharacter.currentInfo.firstName.toLowerCase()});
})

router.get("/:id/component", async function(req,res){
    const foundCharacter = await db.Character.findById(req.params.id).populate({path:"currentInfo",populate:{path:"stats traits.0 traits.1 traits.2 traits.3 traits.4 knowledgeTrees combatStyles", populate:{path:"generalKnowledge specializedKnowledge highlySpecializedKnowledge skills specialties weaponStyle fightingStyles", populate:{path:"info knowledgeTree advantageOver weakAgainst", populate:{path:"generalKnowledge specializedKnowledge highlySpecializedKnowledge skills specialties", populate:{path:"info"}}}}}});
    res.render("components/character", {character: foundCharacter});
})

router.get("/:id/component/basic-sheet", async function(req,res){
    const foundCharacter = await db.Character.findById(req.params.id).populate({path:"currentInfo",populate:{path:"stats traits.0 traits.1 traits.2 traits.3 traits.4 knowledgeTrees combatStyles", populate:{path:"generalKnowledge specializedKnowledge highlySpecializedKnowledge skills specialties weaponStyle fightingStyles", populate:{path:"info knowledgeTree advantageOver weakAgainst", populate:{path:"generalKnowledge specializedKnowledge highlySpecializedKnowledge skills specialties", populate:{path:"info"}}}}}});
    res.render("components/character/basic-sheet", {character: foundCharacter});
})

router.get("/:id/component/combat-sheet", async function(req,res){
    const foundCharacter = await db.Character.findById(req.params.id).populate({path:"currentInfo",populate:{path:"stats traits.0 traits.1 traits.2 traits.3 traits.4 knowledgeTrees combatStyles", populate:{path:"generalKnowledge specializedKnowledge highlySpecializedKnowledge skills specialties weaponStyle fightingStyles", populate:{path:"info knowledgeTree advantageOver weakAgainst", populate:{path:"generalKnowledge specializedKnowledge highlySpecializedKnowledge skills specialties", populate:{path:"info"}}}}}});
    res.render("components/character/combat-sheet", {character: foundCharacter});
})

module.exports = router;