const db = require("./models");

const returnEventTitle = function(a,id){
    return new Promise(async function(resolve){
        let event = await db.Event.findById(id);
        let title = event.title;
        event = {title:event.title,id:`#event-content-${id}`,index:a}
        resolve(event);
    })
}

const loadEvents = async function(story){
    return new Promise(async function(resolve){
        let eventArray = [];
        for(let year=0; year<story.years.length; year++){
            eventArray.push([]);
            for(let x=0; x<story.years[year].seasons.length; x++){
                for(let y=0; y<story.years[year].seasons[x].regionPhases.length; y++){
                    for(let z=0; z<story.years[year].seasons[x].regionPhases[y].rulerPhases.length; z++){
                        for(let a=0; a<story.years[year].seasons[x].regionPhases[y].rulerPhases[z].events.length; a++){
                                eventArray[year].push(await returnEventTitle(a,story.years[year].seasons[x].regionPhases[y].rulerPhases[z].events[a]));
                                if(story.years[year].seasons[x].regionPhases[y].rulerPhases[z].events[a]._id==story.years[year].seasons[story.years[year].seasons.length-1].regionPhases[story.years[year].seasons[story.years[year].seasons.length-1].regionPhases.length-1].rulerPhases[story.years[year].seasons[story.years[year].seasons.length-1].regionPhases[story.years[year].seasons[story.years[year].seasons.length-1].regionPhases.length-1].rulerPhases.length-1].events[story.years[year].seasons[story.years[year].seasons.length-1].regionPhases[story.years[year].seasons[story.years[year].seasons.length-1].regionPhases.length-1].rulerPhases[story.years[year].seasons[story.years[year].seasons.length-1].regionPhases[story.years[year].seasons[story.years[year].seasons.length-1].regionPhases.length-1].rulerPhases.length-1].events.length-1]._id)
                                    resolve(eventArray);
                        }
                    }
                }
            }
        }
    })
}

const updateStoryEventNames = async function(){
    const stories = await db.Story.find();
    for(let x=0; x<stories.length; x++){
        stories[x].eventNames = await loadEvents(stories[x]);
        stories[x].save();
    }
}

updateStoryEventNames();

