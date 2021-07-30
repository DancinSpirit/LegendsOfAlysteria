const db = require("./models");
const bot = require("./resources/bot");

const countLines = async function(){
    const events = await db.Event.find({});
    let lineCount = 0;
    for(let x=0; x<events.length; x++){
        for(let y=0; y<events[x].text.length; y++){
            lineCount++;
        }
    }
    return lineCount;
}
const countWords = async function(){
    const events = await db.Event.find({});
    let wordCount = 0;
    let lineWords = [];
    for(let x=0; x<events.length; x++){
        for(let y=0; y<events[x].text.length; y++){
            lineWords = events[x].text[y].split(" ");
            for(let z=0; z<lineWords.length; z++){
                wordCount++;
            }
        }
    }
    return wordCount;
}
const approximatePercentage = async function(){
    return (await countWords()/154311)*100 + "%";
}

const recoveryWords = async function(){
    const story = await db.Story.findById('60fc38755a0fefba9f554f3e')
    const events = [];
    for(let x=0; x<story.years.length; x++){
        for(let y=0; y<story.years[x].seasons.length; y++){
            if(story.years[x].seasons[y].regionPhases)
            for(let z=0; z<story.years[x].seasons[y].regionPhases.length; z++){
                for(let a=0; a<story.years[x].seasons[y].regionPhases[z].rulerPhases.length; a++){
                    for(let b=0; b<story.years[x].seasons[y].regionPhases[z].rulerPhases[a].events.length; b++){
                        events.push(story.years[x].seasons[y].regionPhases[z].rulerPhases[a].events[b])
                    }
                }
            }
        }
    }
    for(let x=0; x<events.length; x++){
        events[x] = await db.Event.findById(events[x]);
    }
    let wordCount = 0;
    let lineWords = [];
    for(let x=0; x<events.length; x++){
        for(let y=0; y<events[x].text.length; y++){
            lineWords = events[x].text[y].split(" ");
            for(let z=0; z<lineWords.length; z++){
                wordCount++;
            }
        }
    }
    return wordCount;
}

const recoveryPercentage = async function(){
    return (((await recoveryWords()/154311))/(await countWords()/154311))*100 + "%";
}

const recoveryApproximate = async function(){
    return (await recoveryWords()/154311)*100 + "%";
}

const returnCounts = async function(){
    console.log("Lines: " + await countLines());
    console.log("Words: " + await countWords());
    console.log("Original Progress: " + await approximatePercentage());
    console.log("Redo Progress: "+ await recoveryApproximate())
    console.log("Recovery Progress: " + await recoveryPercentage());
}
    
returnCounts();
    
bot.on("ready", async function(){
    const channel = bot.channels.cache.get('848982458224607294');
    let message = await channel.messages.fetch('848984339088670720');
    message.edit("Original Progress: " + await approximatePercentage());
    message = await channel.messages.fetch('848984340159528962');
    message.edit("Redo Progress: " + await recoveryApproximate());
    message = await channel.messages.fetch('848984340624048148');
    message.edit("Recovery Progress: " + await recoveryPercentage());

});
    
const eventEventEmitter = db.Event.watch()

eventEventEmitter.on('change', async function(change) {
    const channel = bot.channels.cache.get('848982458224607294');
    let message = await channel.messages.fetch('848984339088670720');
    message.edit("Lines added to Database: " + await countLines());
    message = await channel.messages.fetch('848984340159528962');
    message.edit("Words added to Database: " + await countWords());
    message = await channel.messages.fetch('848984340624048148');
    message.edit("Approximate Progress: " + await approximatePercentage());
})