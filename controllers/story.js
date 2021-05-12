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
    res.render("story", {story: story, eventId: foundEvent._id}) 
})
/* Story Content */
router.get("/:eventId", async function(req, res){
    console.log(req.params.eventId);
    const event = await db.Event.findById(req.params.eventId);
    res.send(event)
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

/* Delete Story */
router.post("/:eventId/delete/:index/", async function(req,res){
    let event = await db.Event.findById(req.params.eventId);
    array = event.text;
    array.splice(req.params.index, 1);
    await db.Event.findByIdAndUpdate(req.params.eventId, {story: array});
    res.send("Deleted");
})

module.exports = router;