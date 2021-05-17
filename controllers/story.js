const express = require("express");
const router = express.Router();
const db = require("../models");
const s3 = require("../s3.js");

/* Story Page */
router.get("/:storyCollection/:year/:season/:phaseType/:eventType", async function(req, res){
    const story = await db.Story.findOne({type: req.params.storyCollection});
    let season = await db.Season.findOne({story: story, year: req.params.year, season: req.params.season})
    if(req.params.phaseType=="world"){
    season = await db.Season.findOne({story: story, year: req.params.year, season: req.params.season}).populate(`${req.params.phaseType}Phase`);
    let foundEvent;
    for(let event of season[`${req.params.phaseType}Phase`]){
        if(event.type==req.params.eventType){
            foundEvent = event;
        }
    }
    res.render("story", {story: story, eventId: foundEvent._id, phase:`${req.params.phaseType}Phase`}) 
    }else{
        foundEvent = await db.Event.findOne({type: req.params.eventType,season: season._id})
        console.log(req.params.eventType + " " + season._id)
        console.log(foundEvent)
    }
    res.render("story", {story: story, eventId: foundEvent._id, phase:`${req.params.phaseType}`}) 
})
/* Story Page */
router.get("/:storyCollection/:year/:season/:phaseType", async function(req, res){
    const story = await db.Story.findOne({type: req.params.storyCollection});
    if(req.params.phaseType=="world"){
    const season = await db.Season.findOne({story: story, year: req.params.year, season: req.params.season}).populate(`${req.params.phaseType}Phase`);
    res.render("story", {story: story, eventId: `[TURN TITLE]${season.turn}|${season.season}|${season.year}`, phase:`${req.params.phaseType}Phase`}) 
    }else{
    const season = await db.Season.findOne({story: story, year: req.params.year, season: req.params.season})
    let playerCharacter;
    let playerString;
    let characterString;
    for(let x=0; x<season.duchyPhase[0].rulerPhases.length; x++){
        playerCharacter = await db.Player.findById(season.duchyPhase[0].rulerPhases[x].playerCharacter).populate("user").populate("character");
        characterInfo = await db.CharacterInfo.findById(playerCharacter.character.currentInfo);
        if(playerString){
            playerString += "+" + playerCharacter.user.fullName();
            characterString += "+" + characterInfo.fullName();
        }
        else{
            playerString = playerCharacter.user.fullName();
            characterString = characterInfo.fullName();
        }
    }
    res.render("story", {story: story, eventId: `[AREA TITLE]${season.duchyPhase[0].name}|${season.year}|${season.season}|${season.duchyPhase[0].image}|${playerString}|${characterString}`, phase: req.params.phaseType})
    }
})
/* Story Page */
router.get("/:storyCollection/:year/:season/:duchyPhase/:character/title", async function(req, res){
    const story = await db.Story.findOne({type: req.params.storyCollection});
    const season = await db.Season.findOne({story: story, year: req.params.year, season: req.params.season})
    let duchyPhase;
    let playerCharacter
    for(let x=0; x<season.duchyPhase.length; x++){
        if(season.duchyPhase[x].name==req.params.duchyPhase){
            duchyPhase = season.duchyPhase[x]
        }
    }
    for(let x=0; x<duchyPhase.rulerPhases.length; x++){
        playerCharacter = await db.Player.findById(duchyPhase.rulerPhases[x].playerCharacter);
        character = await db.Character.findById(playerCharacter.character).populate("currentInfo");
        user = await db.User.findById(playerCharacter.user);
        if(character.currentInfo.firstName == req.params.character){
            res.render("story",{story: story, eventId: `[CHARACTER TITLE]${character.currentInfo.fullName()}|${user.fullName()}|${req.params.duchyPhase}|${season.year}|${season.season}`, phase: character.currentInfo.firstName})
            break;
        }
    }

})
/* Story Page */
router.get("/:storyCollection", async function(req, res){
    const story = await db.Story.findOne({type: req.params.storyCollection});
    res.render("story", {story: story, eventId: `[STORY TITLE]${req.params.storyCollection}`, phase:`title`}) 
})
/* New Event Id Obtain */
router.get("/navigate/:storyId/:eventId/:phase/:direction/getId", async function(req, res){
    const story = await db.Story.findById(req.params.storyId).populate("seasons"); 
    let event;
    let season;
    let playerCharacter;
    let playerString;
    let characterString;
    let characterInfo;
    if(req.params.eventId.startsWith("[STORY TITLE]")){
        res.send(`[TURN TITLE]${story.seasons[0].turn}|${story.seasons[0].season}|${story.seasons[0].year}`)
    }else{
        if(!req.params.eventId.startsWith("[")){
            event = await db.Event.findById(req.params.eventId);
            season = await db.Season.findById(event.season);
        }
        let newEvent = false;
        if(req.params.direction=="left"){
            if(req.params.eventId.startsWith("[TURN TITLE]")){
                res.send(`[STORY TITLE]${story.type}`);
            }else if(req.params.eventId.startsWith("[AREA TITLE]")){
                season = await db.Season.findOne({year:req.params.eventId.split("|")[1],season:req.params.eventId.split("]")[1].split("|")[2]})
                console.log(season);
                for(let x=0; x<season.duchyPhase.length; x++){
                    if(season.duchyPhase[x].name == req.params.eventId.replace("[AREA TITLE]","").split("|")[0]){
                        if(x!=0){
                            newEvent = season.duchyPhase[x-1];
                            res.send(newEvent);
                        }else{
                            newEvent = season.worldPhase[season.worldPhase.length-1];
                            res.send(newEvent);
                        }
                    }
                }
            }else if(req.params.eventId.startsWith("[CHARACTER TITLE]")){
                season = await db.Season.findOne({year:req.params.eventId.split("|")[3],season:req.params.eventId.split("|")[4]})
                for(let x=0; x<season.duchyPhase.length; x++){
                    if(season.duchyPhase[x].name == req.params.eventId.split("|")[2]){
                        for(let y=0; y<season.duchyPhase[x].rulerPhases.length; y++){
                            playerCharacter = await db.Player.findById(season.duchyPhase[x].rulerPhases[y].playerCharacter)
                            character = await db.Character.findById(playerCharacter.character).populate("currentInfo");
                            if(character.currentInfo.firstName == req.params.phase){
                                if(y!=0){
                                    //NOT IMPLEMENTED YET
                                }else{
                                    for(let z=0; z<season.duchyPhase[0].rulerPhases.length; z++){
                                        playerCharacter = await db.Player.findById(season.duchyPhase[x].rulerPhases[z].playerCharacter).populate("user").populate("character");
                                        characterInfo = await db.CharacterInfo.findById(playerCharacter.character.currentInfo);
                                        if(playerString){
                                            playerString += "+" + playerCharacter.user.fullName();
                                            characterString += "+" + characterInfo.fullName();
                                        }
                                        else{
                                            playerString = playerCharacter.user.fullName();
                                            characterString = characterInfo.fullName();
                                        }
                                    }
                                    res.send(`[AREA TITLE]${season.duchyPhase[x].name}|${season.year}|${season.season}|${season.duchyPhase[x].image}|${playerString}|${characterString}`);
                                }
                            }
                        }
                    }
                }
            }else{
                if(req.params.phase!="worldPhase"){
                    for(let x=0; x<season.duchyPhase.length; x++){
                        for(let y=0; y<season.duchyPhase[x].rulerPhases.length; y++){
                            playerCharacter = await db.Player.findById(season.duchyPhase[x].rulerPhases[y].playerCharacter).populate("character");
                            characterInfo = await db.CharacterInfo.findById(playerCharacter.character.currentInfo);
                            user = await db.User.findById(playerCharacter.user);
                            if(characterInfo.firstName == req.params.phase){
                                for(let z=0; z<season.duchyPhase[x].rulerPhases[y].events.length; z++){
                                    if(season.duchyPhase[x].rulerPhases[y].events[z] == req.params.eventId){
                                        if(z!=0){
                                            newEvent = season.duchyPhase[x].rulerPhases[y].events[z-1];
                                            res.send(newEvent);
                                        }else{
                                            if(y!=0){
                                                //LOAD EARLIER CHARACTER
                                            }else{
                                                res.send(`[CHARACTER TITLE]${characterInfo.fullName()}|${user.fullName()}|${season.duchyPhase[x].name}|${season.year}|${season.season}`)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }else
                for(let x=0; x<season[req.params.phase].length; x++){
                    if(`${season[req.params.phase][x]}`==event._id){
                        if(x!=0){
                            newEvent = season[req.params.phase][x-1];
                            res.send(newEvent);
                        }
                    }
                }
                if(!newEvent){
                    if(req.params.phase=="worldPhase"){
                        res.send(`[TURN TITLE]${season.turn}|${season.season}|${season.year}`);
                    }
                }
            }
        }
        if(req.params.direction=="right"){
            if(req.params.eventId.startsWith("[TURN TITLE]")){
                season = await db.Season.findOne({year:req.params.eventId.split("]")[1].split("|")[2],season:req.params.eventId.split("]")[1].split("|")[1]})
                newEvent = season.worldPhase[0];
                res.send(newEvent);
            }else if(req.params.eventId.startsWith("[AREA TITLE]")){
                season = await db.Season.findOne({year: req.params.eventId.split("|")[1], season: req.params.eventId.split("|")[2]})
                user = await db.User.findOne({firstName: req.params.eventId.split("|")[4].split("+")[0].split(" ")[0], lastName: req.params.eventId.split("|")[4].split("+")[0].split(" ")[1]})
                //I need to know the turn here so I can access the currect info type
                characterInfo = await db.CharacterInfo.findOne({firstName:req.params.eventId.split("|")[5].split("+")[0].split(" ")[0], lastName: req.params.eventId.split("|")[5].split("+")[0].replace(req.params.eventId.split("|")[5].split("+")[0].split(" ")[0]+" ","")})
                res.send(`[CHARACTER TITLE]${characterInfo.fullName()}|${user.fullName()}|${req.params.phase}|${season.year}|${season.season}`)
            }else if(req.params.eventId.startsWith("[CHARACTER TITLE]")){
                season = await db.Season.findOne({year:req.params.eventId.split("|")[3],season: req.params.eventId.split("|")[4]})
                for(let x=0; x<season.duchyPhase.length; x++){
                    if(season.duchyPhase[x].name == req.params.eventId.split("|")[2]){
                        for(let y=0; y<season.duchyPhase[x].rulerPhases.length; y++){
                            playerCharacter = await db.Player.findById(season.duchyPhase[x].rulerPhases[y].playerCharacter)
                            character = await db.Character.findById(playerCharacter.character).populate("currentInfo");
                            if(character.currentInfo.firstName == req.params.phase){
                                newEvent = season.duchyPhase[x].rulerPhases[y].events[0];
                                res.send(newEvent);
                            }
                        }
                    }
                }
            }else{
                if(req.params.phase!="worldPhase"){
                    for(let x=0; x<season.duchyPhase.length; x++){
                        for(let y=0; y<season.duchyPhase[x].rulerPhases.length; y++){
                            playerCharacter = await db.Player.findById(season.duchyPhase[x].rulerPhases[y].playerCharacter).populate("character");
                            characterInfo = await db.CharacterInfo.findById(playerCharacter.character.currentInfo);
                            if(characterInfo.firstName == req.params.phase){
                                for(let z=0; z<season.duchyPhase[x].rulerPhases[y].events.length; z++){
                                    if(season.duchyPhase[x].rulerPhases[y].events[z] == req.params.eventId){
                                        if(z!=season.duchyPhase[x].rulerPhases[y].events.length-1){
                                            newEvent = season.duchyPhase[x].rulerPhases[y].events[z+1];
                                            res.send(newEvent);
                                        }else{
                                            //Load Next Character if it exists
                                        }
                                    }
                                }
                            }
                        }
                    }
                }else
                for(let x=0; x<season[req.params.phase].length; x++){
                    if(`${season[req.params.phase][x]}`==event._id){
                        if(season[req.params.phase].length-1 != x){
                            newEvent = season[req.params.phase][x+1];
                            res.send(newEvent);
                        }
                    }
                }
                if(!newEvent){
                    if(req.params.phase=="worldPhase"){
                        for(let x=0; x<season.duchyPhase[0].rulerPhases.length; x++){
                            playerCharacter = await db.Player.findById(season.duchyPhase[0].rulerPhases[x].playerCharacter).populate("user").populate("character");
                            characterInfo = await db.CharacterInfo.findById(playerCharacter.character.currentInfo);
                            if(playerString){
                                playerString += "+" + playerCharacter.user.fullName();
                                characterString += "+" + characterInfo.fullName();
                            }
                            else{
                                playerString = playerCharacter.user.fullName();
                                characterString = characterInfo.fullName();
                            }
                        }
                        res.send(`[AREA TITLE]${season.duchyPhase[0].name}|${season.year}|${season.season}|${season.duchyPhase[0].image}|${playerString}|${characterString}`);
                    }
                }
            }
        }
    }
})

/* Story Content */
router.get("/getEvent/:eventId", async function(req, res){
    const event = await db.Event.findById(req.params.eventId).populate("season");
    res.send(event)
})
/* Delete Story */
router.delete("/:eventId/delete/:index/", async function(req,res){
    let event = await db.Event.findById(req.params.eventId);
    array = event.text;
    console.log(array.splice(req.params.index, 1));
    await db.Event.findByIdAndUpdate(req.params.eventId, {text: array});
    res.send("Deleted");
})
/* Add Story */
router.post("/:eventId/:form", async function(req,res){
    let sentText = req.params.form.replace(/PERCENT-SIGN/g, '%');
    sentText = sentText.replace(/"/g,'&quot;').replace(/'/g,"&apos;").replace(/%/g, '&#37;');
    await db.Event.findByIdAndUpdate(req.params.eventId,{$push: {text: sentText}})
    res.send(sentText);
})
/* Edit Story */
router.post("/:eventId/:index/:form", async function(req,res){
    let sentText = req.params.form.replace(/PERCENT-SIGN/g, '%');
    sentText = sentText.replace(/"/g,'&quot;').replace(/'/g,"&apos;").replace(/%/g, '&#37;');
    let event = await db.Event.findById(req.params.eventId);
    let array = event.text;
    array[req.params.index] = sentText;
    event = await db.Event.findByIdAndUpdate(req.params.eventId, {text: array});
    res.send(sentText);
})


module.exports = router;