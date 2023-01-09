const db = require("./models");
const bot = require("./bot.js");
const {MessageEmbed} = require("discord.js");

const movePhasesOver = async function(){
    let larrauStory = await db.Story.findById("62702eeb83361d9bcaad4801");
    let zacharyStory = await db.Story.findById("61390a85d4d10a12926304cb");
    let completeStory = await db.Story.findById("613914ffd4d10a12926304cd");
    let malcStory = await db.Story.findById("62fb27edf93e5a51ea7b29d0");
    let observerStory = await db.Story.findById("62373ba6896942d7c9927fce");
    let keithPhase = completeStory.years[0].seasons[2];
    observerStory.years[0].seasons[2] = keithPhase
    observerStory.save();
}

const loadIntoEvent = async function(){
    let combatEvent = await db.Event.findById("63bba7ee0298bab02eb32ef9");
    let originEvent = await db.Event.findById("60b9398e004695169dff05ab");
    for(let x=0; x<49; x++){
        combatEvent.text[x] = originEvent.text[x]
    }
    combatEvent.save();
}
loadIntoEvent();
//movePhasesOver();

const returnEventTitle = function(a,id){
    return new Promise(async function(resolve){
        let event = await db.Event.findById(id);
        let title = event.title;
        event = {title:event.title,id:`#event-content-${id}`,index:a}
        resolve(event);
    })
}

const loadEvents = async function(story, year){
    return new Promise(async function(resolve){
        let eventArray = [];
            for(let x=0; x<story.years[year].seasons.length; x++){
                for(let y=0; y<story.years[year].seasons[x].regionPhases.length; y++){
                    for(let z=0; z<story.years[year].seasons[x].regionPhases[y].rulerPhases.length; z++){
                        for(let a=0; a<story.years[year].seasons[x].regionPhases[y].rulerPhases[z].events.length; a++){
                            let eventTitle = await returnEventTitle(a,story.years[year].seasons[x].regionPhases[y].rulerPhases[z].events[a]);
                                eventArray.push(eventTitle);
                                if(story.years[year].seasons[x].regionPhases[y].rulerPhases[z].events[a]._id==story.years[year].seasons[story.years[year].seasons.length-1].regionPhases[story.years[year].seasons[story.years[year].seasons.length-1].regionPhases.length-1].rulerPhases[story.years[year].seasons[story.years[year].seasons.length-1].regionPhases[story.years[year].seasons[story.years[year].seasons.length-1].regionPhases.length-1].rulerPhases.length-1].events[story.years[year].seasons[story.years[year].seasons.length-1].regionPhases[story.years[year].seasons[story.years[year].seasons.length-1].regionPhases.length-1].rulerPhases[story.years[year].seasons[story.years[year].seasons.length-1].regionPhases[story.years[year].seasons[story.years[year].seasons.length-1].regionPhases.length-1].rulerPhases.length-1].events.length-1]._id)
                                    resolve(eventArray);
                        }
                    }
                }
            }
    })
}

const updateStoryEventNames = async function(){
    const stories = await db.Story.find();
    for(let x=0; x<stories.length; x++){
        for(let year=0; year<stories[x].years.length; year++){
            stories[x].eventNames[year] = await loadEvents(stories[x],year);
        }
        stories[x].save();
    }
    console.log("Completed")
}

updateStoryEventNames();

const populateEventProgress = async function(id){
    const story = await db.Story.findById(id);
    for(let year=0; year<story.years.length; year++){
        for(let season=0; season<story.years[year].seasons.length; season++){
            for(let regionPhase=0; regionPhase<story.years[year].seasons[season].regionPhases.length; regionPhase++){
                for(let rulerPhase=0; rulerPhase<story.years[year].seasons[season].regionPhases[regionPhase].rulerPhases.length; rulerPhase++){
                    for(let eventIndex=0; eventIndex<story.years[year].seasons[season].regionPhases[regionPhase].rulerPhases[rulerPhase].events.length; eventIndex++){
                        let event = await db.Event.findById(story.years[year].seasons[season].regionPhases[regionPhase].rulerPhases[rulerPhase].events[eventIndex]);                        
                        if(season==0){
                            event.progress.finished = true;
                            event.progress.edited = true;
                            event.progress.complete = true;
                        }else if((season==1)&&(eventIndex<7)){
                            event.progress.finished = true;
                            event.progress.edited = false;
                            event.progress.complete = false;
                        }else{
                            event.progress.finished = false;
                            event.progress.edited = false;
                            event.progress.complete = false;
                        }
                        event.markModified("progress")
                        event.save();
                    }
                }
            }
        }
    }
}

const completeString = function(complete){
    if(complete){
        return "Completed!"
    }else{
        return "Incomplete"
    }
}

const eventString = function(completeObject){
    if(completeObject.complete){
        return "Completed!"
    }
    if(completeObject.edited){
        return "Edited!"
    }
    if(completeObject.finished){
        return "Written!"
    }
    return "In Progress!"
}

const seasonString = function(season){
    if(season==0){
        return "Winter"
    }
    if(season==1){
        return "Spring"
    }
    if(season==2){
        return "Summer"
    }
    if(season==3){
        return "Fall"
    }
}


let messageEmbed;
const createEmbed = function(title,description){
    messageEmbed =  new MessageEmbed()
        .setColor("#A020F0")
        .setTitle(title)
        .setDescription(description)
}

const addFieldToEmbed = function(fieldTitle,fieldValue){
    messageEmbed.addField(fieldTitle, fieldValue, true)
}
const addImageToEmbed = function(image){
    messageEmbed.setThumbnail(image)
}
const addColorToEmbed = function(color){
    messageEmbed.setColor(color);
}

let botString = "";
const printLine = function(content){
    botString += content + "\n";
}

const returnProgress = async function(id){
    const story = await db.Story.findById(id)
    printLine("--------------------------------------------------")
    printLine("Legends Of Alysteria: " + story.name)
    printLine("--------------------------------------------------")
    createEmbed("Legends Of Alysteria",story.name);
    let completedYears = 0;
    let finishedYears = 0;
    let editedYears = 0;
    for(let year=0; year<story.years.length; year++){
        for(let season=0; season<story.years[year].seasons.length; season++){
            if(story.years[year].progress.complete){
                completedYears++;
            }
            if(story.years[year].progress.finished){
                finishedYears++;
            }
            if(story.years[year].progress.edited){
                editedYears++;
            }
        }
    }
    printLine("Written: " + finishedYears + "/??? Years")
    addFieldToEmbed("Years Written:",finishedYears + "/???")
    printLine("Edited: " + editedYears + "/??? Years")
    addFieldToEmbed("Years Edited:",editedYears + "/???")
    printLine("Complete: " + completedYears + "/??? Years")
    addFieldToEmbed("Years Completed:",completedYears + "/???")
    printLine("Year Progress:")
    sendMessage(bot.channels.cache.get('977054955011719208'));
    for(let year=0; year<story.years.length; year++){ 
        printLine("      --------------------------------------------------")
        printLine("      Year " + year + ": " + completeString(story.years[year].progress.complete));
        printLine("      --------------------------------------------------")
        createEmbed("Year " + year, completeString(story.years[year].progress.complete))
        let completedSeasons = 0;
        let finishedSeasons = 0;
        let editedSeasons = 0;
        for(let season=0; season<story.years[year].seasons.length; season++){
            if(story.years[year].seasons[season].progress.complete){
                completedSeasons++;
            }
            if(story.years[year].seasons[season].progress.finished){
                finishedSeasons++;
            }
            if(story.years[year].seasons[season].progress.edited){
                editedSeasons++;
            }
        }
        printLine("      Written: " + finishedSeasons + "/4 Seasons")
        addFieldToEmbed("Seasons Written:",finishedSeasons + "/4")
        printLine("      Edited: " + editedSeasons + "/4 Seasons")
        addFieldToEmbed("Seasons Edited:",editedSeasons + "/4")
        printLine("      Complete: " + completedSeasons + "/4 Seasons")
        addFieldToEmbed("Seasons Completed:",completedSeasons + "/4")
        printLine("      Season Progress:")
        sendMessage(bot.channels.cache.get('977054955011719208'));
        for(let season=0; season<story.years[year].seasons.length; season++){
            printLine("            --------------------------------------------------")
            printLine("            Year " + year + ", " + seasonString(season) + ": " + completeString(story.years[year].seasons[season].progress.complete));  
            printLine("            --------------------------------------------------")  
            createEmbed("Year " + year + ", " + seasonString(season), completeString(story.years[year].seasons[season].progress.complete))
            let completedRegionPhases = 0;
            let finishedRegionPhases = 0;
            let editedRegionPhases = 0;
            for(let regionPhase=0; regionPhase<story.years[year].seasons[season].regionPhases.length; regionPhase++){
                if(story.years[year].seasons[season].regionPhases[regionPhase].progress.complete){
                    completedRegionPhases++;
                }
                if(story.years[year].seasons[season].regionPhases[regionPhase].progress.finished){
                    finishedRegionPhases++;
                }
                if(story.years[year].seasons[season].regionPhases[regionPhase].progress.edited){
                    editedRegionPhases++;
                }
            }
            printLine("            Written: " + finishedRegionPhases + "/" + story.years[year].seasons[season].regionPhases.length + " Region Phases")
            addFieldToEmbed("Region Phases Written:",finishedRegionPhases + "/" + story.years[year].seasons[season].regionPhases.length)
            printLine("            Edited: " + editedRegionPhases + "/" + story.years[year].seasons[season].regionPhases.length +" Region Phases")
            addFieldToEmbed("Region Phases Edited:",editedRegionPhases + "/" + story.years[year].seasons[season].regionPhases.length)
            printLine("            Complete: " + completedRegionPhases + "/" + story.years[year].seasons[season].regionPhases.length +" Region Phases")
            addFieldToEmbed("Region Phases Completed:",completedRegionPhases + "/" + story.years[year].seasons[season].regionPhases.length)
            printLine("            Region Phase Progress:")
            sendMessage(bot.channels.cache.get('977054955011719208'));
            for(let regionPhase=0; regionPhase<story.years[year].seasons[season].regionPhases.length; regionPhase++){
                printLine("                  --------------------------------------------------")
                printLine("                  " + story.years[year].seasons[season].regionPhases[regionPhase].name + ": " + completeString(story.years[year].seasons[season].regionPhases[regionPhase].progress.complete));
                printLine("                  --------------------------------------------------")
                createEmbed(story.years[year].seasons[season].regionPhases[regionPhase].name,completeString(story.years[year].seasons[season].regionPhases[regionPhase].progress.complete));
                addImageToEmbed(story.years[year].seasons[season].regionPhases[regionPhase].emblem)
                let completedRulerPhases = 0;
                let finishedRulerPhases = 0;
                let editedRulerPhases = 0;
                for(let rulerPhase=0; rulerPhase<story.years[year].seasons[season].regionPhases[regionPhase].rulerPhases.length; rulerPhase++){
                    if(story.years[year].seasons[season].regionPhases[regionPhase].rulerPhases[rulerPhase].progress.complete){
                        completedRulerPhases++;
                    }
                    if(story.years[year].seasons[season].regionPhases[regionPhase].rulerPhases[rulerPhase].progress.finished){
                        finishedRulerPhases++;
                    }
                    if(story.years[year].seasons[season].regionPhases[regionPhase].rulerPhases[rulerPhase].progress.edited){
                        editedRulerPhases++;
                    }
                }
                printLine("                  Written: " + finishedRulerPhases + "/" + story.years[year].seasons[season].regionPhases[regionPhase].rulerPhases.length + " Ruler Phases")
                addFieldToEmbed("Ruler Phases Written:",finishedRulerPhases + "/" + story.years[year].seasons[season].regionPhases[regionPhase].rulerPhases.length)
                printLine("                  Edited: " + editedRulerPhases + "/" + story.years[year].seasons[season].regionPhases[regionPhase].rulerPhases.length +" Ruler Phases")
                addFieldToEmbed("Ruler Phases Edited:",editedRulerPhases + "/" + story.years[year].seasons[season].regionPhases[regionPhase].rulerPhases.length)
                printLine("                  Complete: " + completedRulerPhases + "/" + story.years[year].seasons[season].regionPhases[regionPhase].rulerPhases.length +" Ruler Phases")
                addFieldToEmbed("Ruler Phases Completed:",completedRulerPhases + "/" + story.years[year].seasons[season].regionPhases[regionPhase].rulerPhases.length)
                printLine("                  Ruler Phase Progress:")
                sendMessage(bot.channels.cache.get('977054955011719208'));
                for(let rulerPhase=0; rulerPhase<story.years[year].seasons[season].regionPhases[regionPhase].rulerPhases.length; rulerPhase++){
                    printLine("                        --------------------------------------------------")
                    printLine("                        " + story.years[year].seasons[season].regionPhases[regionPhase].rulerPhases[rulerPhase].name + ": " + completeString(story.years[year].seasons[season].regionPhases[regionPhase].rulerPhases[rulerPhase].progress.complete));
                    printLine("                        --------------------------------------------------")
                    createEmbed(story.years[year].seasons[season].regionPhases[regionPhase].rulerPhases[rulerPhase].name,completeString(story.years[year].seasons[season].regionPhases[regionPhase].rulerPhases[rulerPhase].progress.complete))
                    let player = await db.Player.findOne({name: story.years[year].seasons[season].regionPhases[regionPhase].rulerPhases[rulerPhase].name})
                    addColorToEmbed(player.colors.background)
                    let completedEvents = 0;
                    let finishedEvents = 0;
                    let editedEvents = 0;
                    for(let eventIndex=0; eventIndex<story.years[year].seasons[season].regionPhases[regionPhase].rulerPhases[rulerPhase].events.length; eventIndex++){
                        let event = await db.Event.findById(story.years[year].seasons[season].regionPhases[regionPhase].rulerPhases[rulerPhase].events[eventIndex])
                        if(event.progress.complete){
                            completedEvents++;
                        }
                        if(event.progress.finished){
                            finishedEvents++;
                        }
                        if(event.progress.edited){
                            editedEvents++;
                        }
                    }
                    printLine("                        Written: " + finishedEvents + "/" + story.years[year].seasons[season].regionPhases[regionPhase].rulerPhases[rulerPhase].events.length + " Events")
                    addFieldToEmbed("Events Written:",finishedEvents + "/" + story.years[year].seasons[season].regionPhases[regionPhase].rulerPhases[rulerPhase].events.length)
                    printLine("                        Edited: " + editedEvents + "/" + story.years[year].seasons[season].regionPhases[regionPhase].rulerPhases[rulerPhase].events.length +" Events")
                    addFieldToEmbed("Events Edited:",editedEvents + "/" + story.years[year].seasons[season].regionPhases[regionPhase].rulerPhases[rulerPhase].events.length)
                    printLine("                        Complete: " + completedEvents + "/" + story.years[year].seasons[season].regionPhases[regionPhase].rulerPhases[rulerPhase].events.length +" Events")
                    addFieldToEmbed("Events Completed:",completedEvents + "/" + story.years[year].seasons[season].regionPhases[regionPhase].rulerPhases[rulerPhase].events.length)
                    printLine("                        Event Progress:")
                    sendMessage(bot.channels.cache.get('977054955011719208'));
                    messageEmbed = new MessageEmbed();
                    addColorToEmbed(player.colors.background)
                    for(let eventIndex=0; eventIndex<story.years[year].seasons[season].regionPhases[regionPhase].rulerPhases[rulerPhase].events.length; eventIndex++){
                        let event = await db.Event.findById(story.years[year].seasons[season].regionPhases[regionPhase].rulerPhases[rulerPhase].events[eventIndex])
                        printLine("                              " + event.title + ": " + eventString(event.progress))
                        addFieldToEmbed(event.title,eventString(event.progress))
                    }
                    if(messageEmbed.fields.length){
                        sendMessage(bot.channels.cache.get('977054955011719208'));
                    }
                }
            }
        }
    }
}

const sendMessage = function(channel){
    console.log(botString);
    botString = "";
    channel.send({ embeds: [messageEmbed] });
}

bot.on("ready", async function(){
    console.log(`Logged In As ${bot.user.tag}!`)
    //let channel = bot.channels.cache.get('977054955011719208')
    //channel.bulkDelete(99);
    //returnProgress("613914ffd4d10a12926304cd") 
});


