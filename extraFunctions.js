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
    return (await countWords()/(154311+11934))*100 + "%";
}

const returnCounts = async function(){
    console.log("Lines: " + await countLines());
    console.log("Words: " + await countWords());
    console.log("Approximate Progress: " + await approximatePercentage());
}
    
returnCounts();
    
bot.on("ready", async function(){
    const channel = bot.channels.cache.get('848982458224607294');
    let message = await channel.messages.fetch('848984339088670720');
    message.edit("Lines added to Database: " + await countLines());
    message = await channel.messages.fetch('848984340159528962');
    message.edit("Words added to Database: " + await countWords());
    message = await channel.messages.fetch('848984340624048148');
    message.edit("Approximate Progress: " + await approximatePercentage());

});
    
const eventEventEmitter = db.Event.watch()

eventEventEmitter.on('change', async function(change) {
    if(change.operationType == "insert"){
        const story = await db.Story.findById("60fc38755a0fefba9f554f3e");
        story.years[0].seasons[3].regionPhases[1].rulerPhases[9].events.push(change.fullDocument._id);
        const updatedStory = await db.Story.findByIdAndUpdate("60fc38755a0fefba9f554f3e",{years: story.years});
   }
    const channel = bot.channels.cache.get('848982458224607294');
    let message = await channel.messages.fetch('848984339088670720');
    message.edit("Lines added to Database: " + await countLines());
    message = await channel.messages.fetch('848984340159528962');
    message.edit("Words added to Database: " + await countWords());
    message = await channel.messages.fetch('848984340624048148');
    message.edit("Approximate Progress: " + await approximatePercentage());
})

const createBattle = async function(id, height, width){
    const battle = await db.Battle.findById(id);
    battle.gridBoxes = [];
    for(let x=0; x<height; x++){
        battle.gridBoxes.push([]);
        for(let y=0; y<width; y++){
            battle.gridBoxes[x].push({background: "Empty", token:"Empty", unit:"Empty"})
            if(x==5&&y==15){
                battle.gridBoxes[x].push({background: "Empty", token:"Zack", unit:"60c0007280c69c4eb3c31d8c"})    
            }
        }
    }
    const updatedBattle = await db.Battle.findByIdAndUpdate(id,{gridBoxes: battle.gridBoxes});
}

const loadEvents = async function(startingStory, resultingStory, years, seasons, regions, rulers){
    const story1 = await db.Story.findById(startingStory);
    const story2 = await db.Story.findById(resultingStory);
    for(let x=0; x<story1.years[years].seasons[seasons].regionPhases[regions].rulerPhases[rulers].events.length; x++){
        story2.years[years].seasons[seasons].regionPhases[regions].rulerPhases[rulers].events.push(story1.years[years].seasons[seasons].regionPhases[regions].rulerPhases[rulers].events[x]);
    }
    story2.save();
}
const loadRegion = async function(startingStory, resultingStory, years, seasons, regions){
    const story1 = await db.Story.findById(startingStory);
    const story2 = await db.Story.findById(resultingStory);
    story2.years[years].seasons[seasons].regionPhases[regions].rulerPhases = story1.years[years].seasons[seasons].regionPhases[regions].rulerPhases;
    story2.save();
}
const transferCharacterInfo = async function(startingCharacter, resultingCharacter, field){
    const character1 = await db.Characterinfo.findById(startingCharacter);
    const character2 = await eval(`db.Characterinfo.findByIdAndUpdate(resultingCharacter, {${field}: character1.${field}})`);
    
}

const transferNewInfo = async function(){
    const story = await db.Story.findById("613914ffd4d10a12926304cd");
    story.years[0].seasons[0].regionPhases.push(story.years[0].seasons[3].regionPhases[0]);
    story.years[0].seasons[0].regionPhases.push(story.years[0].seasons[3].regionPhases[1]);
    story.years[0].seasons[3].regionPhases.splice(1,1);
    story.save();
}


