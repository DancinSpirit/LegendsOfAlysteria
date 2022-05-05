let continueEvent = true;
let invisibleArrow = false;
let playersLoaded = false;
let onContents = false;

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

const returnEvents = async function(story, year){
    for(let x=0; x<story.years[year].seasons.length; x++){
        for(let y=0; y<story.years[year].seasons[x].regionPhases.length; y++){
            for(let z=0; z<story.years[year].seasons[x].regionPhases[y].rulerPhases.length; z++){
                for(let a=0; a<story.years[year].seasons[x].regionPhases[y].rulerPhases[z].events.length; a++){
                    if(onContents){
                        await returnEventTitle(story.years[year].seasons[x].regionPhases[y].rulerPhases[z].events[a]);
                    }
                }
            }
        }
    }
}

const returnEventTitle = function(id){
    return new Promise(async function(resolve){
        const event = await loadDatabaseObject("Event",id);
        const title = event.title;
        $(`#event-content-${id}`).text(title);
        resolve();
    })
}