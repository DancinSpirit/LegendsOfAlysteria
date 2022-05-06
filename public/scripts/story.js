let continueEvent = true;
let invisibleArrow = false;
let playersLoaded = false;
let eventArray = []

const loadPlayerColors = async function(){
    if(!playersLoaded){
        let players = await loadAllDatabaseObjects("Player");
        for(let x=0; x<players.length; x++){
            let playerColors = document.createElement("style");
            playerColors.innerText = `.${players[x].name.replaceAll(" ","-").replace(",","")}{background-color:${players[x].colors.background}}`
            document.head.appendChild(playerColors);
        }
        playersLoaded = true;
    }
}

const returnEvents = async function(year){
    let events = eventArray[year];
    for(let x=0; x<events.length; x++){
        events[x] = await events[x];
        $(events[x].id).text(events[x].title)
    }
}

const loadEvents = async function(story){
    return new Promise(async function(resolve){
        for(let year=0; year<story.years.length; year++){
            eventArray.push([]);
            for(let x=0; x<story.years[year].seasons.length; x++){
                for(let y=0; y<story.years[year].seasons[x].regionPhases.length; y++){
                    for(let z=0; z<story.years[year].seasons[x].regionPhases[y].rulerPhases.length; z++){
                        for(let a=0; a<story.years[year].seasons[x].regionPhases[y].rulerPhases[z].events.length; a++){
                                eventArray[year].push(returnEventTitle(story.years[year].seasons[x].regionPhases[y].rulerPhases[z].events[a]));
                                if(a==story.years[year].seasons[x].regionPhases[y].rulerPhases[z].events.length-1)
                                    resolve();
                        }
                    }
                }
            }
        }
    })
}

const loadStory = async function(){
    $("#sub-story").css("display","block");
    await loadEvents(story);
}

const returnEventTitle = function(id){
    return new Promise(async function(resolve){
        let event = await loadDatabaseObject("Event",id);
        let title = event.title;
        event = {title:event.title,id:`#event-content-${id}`}
        resolve(event);
    })
}