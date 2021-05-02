const express = require("express");
const router = express.Router();
const db = require("../models");

/* Character Page */
router.get("/:id", async function(req,res){
    const foundCharacter = await db.Character.findById(req.params.id).populate("currentInfo");
    res.render("main",{state: character(req.session.currentUser.gamemaster), theme: foundCharacter.currentInfo.firstName.toLowerCase()});
})

/* Load Character Base Component */
router.get("/:id/component", async function(req,res){
    const foundCharacter = await db.Character.findById(req.params.id).populate({path:"currentInfo",populate:{path:"stats traits.0 traits.1 traits.2 traits.3 traits.4 knowledgeTrees combatStyles", populate:{path:"generalKnowledge specializedKnowledge highlySpecializedKnowledge skills specialties weaponStyle fightingStyles", populate:{path:"info knowledgeTree advantageOver weakAgainst", populate:{path:"generalKnowledge specializedKnowledge highlySpecializedKnowledge skills specialties", populate:{path:"info"}}}}}});
    res.render(`components/${character(req.session.currentUser.gamemaster)}`, {character: foundCharacter});
})

/* Load Basic Sheet Component */
router.get("/:id/component/basic-sheet", async function(req,res){
    const foundCharacter = await db.Character.findById(req.params.id).populate({path:"currentInfo",populate:{path:"stats traits.0 traits.1 traits.2 traits.3 traits.4 knowledgeTrees combatStyles", populate:{path:"generalKnowledge specializedKnowledge highlySpecializedKnowledge skills specialties weaponStyle fightingStyles", populate:{path:"info knowledgeTree advantageOver weakAgainst", populate:{path:"generalKnowledge specializedKnowledge highlySpecializedKnowledge skills specialties", populate:{path:"info"}}}}}});
    res.render(`components/${character(req.session.currentUser.gamemaster)}/basic-sheet`, {character: foundCharacter});
})

/* Load Combat Sheet Component */
router.get("/:id/component/combat-sheet", async function(req,res){
    const foundCharacter = await db.Character.findById(req.params.id).populate({path:"currentInfo",populate:{path:"stats traits.0 traits.1 traits.2 traits.3 traits.4 knowledgeTrees combatStyles", populate:{path:"generalKnowledge specializedKnowledge highlySpecializedKnowledge skills specialties weaponStyle fightingStyles", populate:{path:"info knowledgeTree advantageOver weakAgainst", populate:{path:"generalKnowledge specializedKnowledge highlySpecializedKnowledge skills specialties", populate:{path:"info"}}}}}});
    res.render(`components/${character(req.session.currentUser.gamemaster)}/combat-sheet`, {character: foundCharacter});
})

/* Gamemaster Check Function */
const character = function(gamemaster){
    if(gamemaster){
        return "editCharacter"
    }else{
        return "character"
    }
}
module.exports = router;