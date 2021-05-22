const express = require("express");
const router = express.Router();
const db = require("../models");
const s3 = require("../s3.js");

/* Trait Get */
router.get("/trait/:id", async function(req,res){
    const trait = await db.Trait.findById(req.params.id);
    res.send(trait);
})





/* Characters Index */
router.get("/", async function(req, res){
    res.render("main",{state: "characters"})
})

/* Create Character */
router.post("/", async function(req, res){
    const traitArray = [[],[],[],[],[]]
    const newCharacterInfo = await db.CharacterInfo.create({firstName: "New", lastName: "Character", traits: traitArray, avatar: "https://pwco.com.sg/wp-content/uploads/2020/05/Generic-Profile-Placeholder-v3-400x400.png"});
    const newCharacter = await db.Character.create({currentInfo: newCharacterInfo});
    res.send(newCharacter._id);
})

/* Edit Character Info*/
router.put("/:id", async function(req, res){
    const character = await db.Character.findById(req.params.id);

    /* Convert to Array Notation */
    if(Object.keys(req.query)[0].includes("|")){
        const key = Object.keys(req.query)[0].replace(/\|/g,"[")
        const value = Object.values(req.query)[0];
        req.query = {};
        req.query[key] = value;
    }
    /* Trait Edit */
    if(Object.keys(req.query)[0].includes("traits")){
        const foundCharacterInfo = await db.CharacterInfo.findById(character.currentInfo._id);
        const key = Object.keys(req.query)[0].split(".")[1];
        const query = {}
        query[key] = Object.values(req.query)[0];
        const updatedTrait = await db.Trait.findByIdAndUpdate(eval(`foundCharacterInfo.${Object.keys(req.query)[0].split(".")[0]}`),query)
    }
    else if(req.query.birthday){
        /* Program Birthday Handler at Later Date */
    }
    else{
    const updatedCharacterInfo = await db.CharacterInfo.findByIdAndUpdate(character.currentInfo._id,req.query);
    }
    res.send(req.query)
})

/* Edit Charracter Image */
router.post("/image/:id", async function(req,res){
    const file = req.files.file;
    let filename = `${Date.now()}-${file.name}`;
    let url = `https://aozora.s3.us-east-2.amazonaws.com/${filename}`
    const params = {
      Bucket: "aozora",
      Key: filename,
      Body: Buffer.from(file.data, 'binary')
    }
    s3.upload(params, function(err, data){
      if(err){
        throw err;
      }
      console.log(`File uploaded successfully. ${data.Location}`);
    })
    const foundCharacter = await db.Character.findById(req.params.id);
    const updatedCharacterInfo = await db.CharacterInfo.findByIdAndUpdate(foundCharacter.currentInfo._id, {avatar: url});
    res.redirect('back');
  })

router.post("/:id/trait/:type", async function(req,res){
    const character = await db.Character.findById(req.params.id);
    const trait = await db.Trait.create({type: req.params.type});
    const info = await db.CharacterInfo.findById(character.currentInfo._id);
    info.traits[req.params.type].push(trait);
    info.markModified('traits');
    info.save();
    res.send(`${info.traits[req.params.type].length-1}`);
})

router.delete("/:id/trait/:traitId", async function(req,res){
    const character = await db.Character.findById(req.params.id);
    const info = await db.CharacterInfo.findById(character.currentInfo._id); 
    const indexOne = req.params.traitId.split("|")[1].split("]")[0]
    const indexTwo = req.params.traitId.split("|")[2].split("]")[0];
    console.log(indexTwo);
    const trait = await db.Trait.findByIdAndDelete(info.traits[parseInt(indexOne)][parseInt(indexTwo)]);
    info.traits[parseInt(indexOne)].splice(parseInt(indexTwo),1);
    info.markModified('traits');
    info.save();
    res.send(`${indexOne}|${indexTwo}`)
    
})

/* Load Characters Component */
router.get("/component", async function(req,res){
    const allCharacters = await db.Character.find({}).populate("currentInfo");
    res.render(`components/characters`, {characters: allCharacters});
})

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
router.get("/:id/component/view", async function(req,res){
    const foundCharacter = await db.Character.findById(req.params.id).populate({path:"currentInfo",populate:{path:"stats traits.0 traits.1 traits.2 traits.3 traits.4 knowledgeTrees combatStyles", populate:{path:"generalKnowledge specializedKnowledge highlySpecializedKnowledge skills specialties weaponStyle fightingStyles", populate:{path:"info knowledgeTree advantageOver weakAgainst", populate:{path:"generalKnowledge specializedKnowledge highlySpecializedKnowledge skills specialties", populate:{path:"info"}}}}}});
    res.render(`components/${character(false)}`, {character: foundCharacter});
})

/* Load Character Style Component */
router.get("/:id/style", async function(req,res){
    const foundCharacter = await db.Character.findById(req.params.id).populate("currentInfo");
    res.send(foundCharacter.currentInfo.firstName.toLowerCase());
})

/* Load Basic Sheet Component */
router.get("/:id/component/basic-sheet", async function(req,res){
    const foundCharacter = await db.Character.findById(req.params.id).populate({path:"currentInfo",populate:{path:"stats traits.0 traits.1 traits.2 traits.3 traits.4 knowledgeTrees combatStyles", populate:{path:"generalKnowledge specializedKnowledge highlySpecializedKnowledge skills specialties weaponStyle fightingStyles", populate:{path:"info knowledgeTree advantageOver weakAgainst", populate:{path:"generalKnowledge specializedKnowledge highlySpecializedKnowledge skills specialties", populate:{path:"info"}}}}}});
    res.render(`components/${character(req.session.currentUser.gamemaster)}/basic-sheet`, {character: foundCharacter});
})
router.get("/:id/component/basic-sheet/view", async function(req,res){
    const foundCharacter = await db.Character.findById(req.params.id).populate({path:"currentInfo",populate:{path:"stats traits.0 traits.1 traits.2 traits.3 traits.4 knowledgeTrees combatStyles", populate:{path:"generalKnowledge specializedKnowledge highlySpecializedKnowledge skills specialties weaponStyle fightingStyles", populate:{path:"info knowledgeTree advantageOver weakAgainst", populate:{path:"generalKnowledge specializedKnowledge highlySpecializedKnowledge skills specialties", populate:{path:"info"}}}}}});
    res.render(`components/${character(false)}/basic-sheet`, {character: foundCharacter});
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