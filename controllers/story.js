const express = require("express");
const router = express.Router();
const db = require("../models");
const s3 = require("../s3.js");

/* Story Page */
router.get("/:storyCollection/:year/:season/:phaseType/:eventType", async function(req, res){
    const story = await db.Story.findOne({type: req.params.storyCollection});
    const season = await db.Season.findOne({story: story, year: req.params.year, season: req.params.season}).populate(`${req.params.phaseType}Phase`);
    let foundEvent;
    for(let event of season[`${req.params.phaseType}Phase`]){
        if(event.type==req.params.eventType){
            foundEvent = event;
        }
    }
    res.render("story", {story: story, eventId: foundEvent._id, phase:`${req.params.phaseType}Phase`}) 
})
/* Story Page */
router.get("/:storyCollection/:year/:season/:phaseType", async function(req, res){
    const story = await db.Story.findOne({type: req.params.storyCollection});
    if(req.params.phaseType=="world"){
    const season = await db.Season.findOne({story: story, year: req.params.year, season: req.params.season}).populate(`${req.params.phaseType}Phase`);
    res.render("story", {story: story, eventId: `[TURN TITLE]${season.turn}|${season.season}|${season.year}`, phase:`${req.params.phaseType}Phase`}) 
    }else{
    const season = await db.Season.findOne({story: story, year: req.params.year, season: req.params.season})
    res.render("story", {story: story, eventId: `[AREA TITLE]${season.duchyPhase[0].name}|${season.year}|${season.season}`, phase: req.params.phaseType})
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
    console.log(req.params.eventId)
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
                season = await db.Season.findOne({year:req.params.eventId.split("]")[1].split("|")[1],season:req.params.eventId.split("]")[1].split("|")[2]})
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
            }else{
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
            }else{
                console.log(season);
                console.log("PHASE:"+ req.params.phase)
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
                        res.send(`[AREA TITLE]${season.duchyPhase[0].name}|${season.year}|${season.season}`);
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