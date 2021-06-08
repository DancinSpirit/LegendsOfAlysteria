const db = require("./models");
const bot = require("./bot");
const dice = require("./dieRoller");
const { findById } = require("./models/User");

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
         const season = await db.Season.findById("609aee0619e88c0079176f56");
         season.duchyPhase[0].rulerPhases[1].events.push(change.fullDocument._id);
         const updatedSeason = await db.Season.findByIdAndUpdate("609aee0619e88c0079176f56",{duchyPhase: season.duchyPhase});
    }
    const channel = bot.channels.cache.get('848982458224607294');
    let message = await channel.messages.fetch('848984339088670720');
    message.edit("Lines added to Database: " + await countLines());
    message = await channel.messages.fetch('848984340159528962');
    message.edit("Words added to Database: " + await countWords());
    message = await channel.messages.fetch('848984340624048148');
    message.edit("Approximate Progress: " + await approximatePercentage());
})

/* County Creation */
const createCounty = function(name, size, duchyFertility){
    const agricultureRoll = dieRoller.agricultureRoll();
    duchyFertility = duchyFertility + agricultureRoll;
    if(duchyFertility<0){
        duchyFertility = 0;
    }
    if(duchyFertility>6){
        duchyFertility = 6;
    }
    if(duchyFertility<2){
        
    }else if(duchyFertility>4){

    }else{

    }
    const popRoll = dieRoller.popRoll();
    const county = {
        name: name,
        size: size 
    }

}

const recruitArmy = async function(name, potential, size){
    army = await db.Army.create({name: name});
    army.unitOrganizations[0].push({name: "Current Organization", organizations: [{organizationalType: "Battalion"},{organizationalType: "Battalion"}]})
    briannaBatallion = await db.Battalion.create({name: "Brianna's Expert Battalion", leader: "60b6b1f680fc1637bc1181a6"})
    skilledUnits = [];
    x=1;
    while(x<151){
        let unit = recruitUnit(x, potential);
        if(unitSkill(unit)=="skilled"){
            skilledUnits.push(unit);
            x++;
        }  
    }
}

const recruitUnit = function(num, potential){
    let unit = {firstName: "Skilled Unit", lastName: num};
    let roll = dice.roll();
    let ageMod = 0;
    let lowExt = false;
    let highExt = false;
    while(roll<1){
        ageMod--;
        roll = roll+100
        lowExt = true;
    } 
    while(roll>100){
        ageMod++;
        roll=roll-100;
        highExt = true;
    }
    if(lowExt){
        roll=2;
    }
    if(highExt){
        roll=99;
    }
    if(roll<3){
        unit.age = 13;
    }
    if(roll>2&&roll<5){
        unit.age = 14;
    }
    if(roll>4&&roll<11){
        unit.age = 15;
    }
    if(roll>10&&roll<21){
        unit.age = 16;
    }
    if(roll>20&&roll<31){
        unit.age = 17;
    }
    if(roll>30&&roll<41){
        unit.age = 18;
    }
    if(roll>40&&roll<51){
        unit.age = 19;
    }
    if(roll>50&&roll<61){
        unit.age = 20;
    }
    if(roll>60&&roll<71){
        unit.age = 21;
    }
    if(roll>70&&roll<81){
        unit.age = 22;
    }
    if(roll<90&&roll>80){
        unit.age = 23;
    }
    if(roll<98&&roll>89){
        unit.age = 24;
    }
    if(roll>98){
        unit.age = 25;
    }
    unit.age=unit.age+ageMod;

    roll=dice.natRoll();
    let modifier = 0;
    let startAge = 0;
    let chanceCheck;
    if(potential=="high"){
        startAge = 3;
        seasonChance = 7;
        modifier = 5;
        dieNum = highpot(roll)
    }
    let seasonNum = 0;
    for(let x=0; x<unit.age-startingAge(startAge); x++){
        for(let y=0; y<4; y++){
            chanceCheck = Math.floor(Math.random()*12)+1;
            if(chanceCheck<seasonChance){
                seasonNum++;
            }
        }
    }
    unit = createUnit(unit, seasonNum, dieNum, modifier);
    return unit;
}
const createUnit = async function(unit, seasonNum, dieNum, modifier){
    unit = await db.CharacterInfo.create(unit);
    unit.genderRoll = dice.natRoll();
    unit.profession = "Soldier";
    unit.stats = await developStats(unit, dieNum);
    unit.combatStyles.push(developCombatStyle(unit, seasonNum, modifier));
    unit.save();
    unitCharacter = await db.Character.create({
        currentInfo: unit,
        infoFromTurn: [unit],
        type: "armyUnit"
    })
    return unitCharacter;
}

const developStats = async function(unit, dieNum){
    let athleticismRolls = [];
    let spiritualityRolls = [];
    let sociabilityRolls = [];
    let deceptionRolls = [];
    let managementRolls = [];
    let learningRolls = [];
    unit.statProdigies = [false,false,false,false,false,false];
    for(let x=0; x<dieNum; x++){
        let statResult = Math.floor(Math.random()*6)+1;
        if(statResult==1){
            athleticismRolls = statCalc(athleticismRolls, unit, 0);
        }
        if(statResult==2){
            spiritualityRolls = statCalc(spiritualityRolls, unit, 1);
        }
        if(statResult==3){
            sociabilityRolls = statCalc(sociabilityRolls, unit, 2);
        }
        if(statResult==4){
            deceptionRolls = statCalc(deceptionRolls, unit, 3);
        }
        if(statResult==5){
            managementRolls = statCalc(managementRolls, unit, 4);
        }
        if(statResult==6){
            learningRolls = statCalc(learningRolls, unit, 5);
        }
    }
    const athleticism = await db.Stat.create({name: "Athleticism", statId: 0, dice: athleticismRolls, trainingPoints: 0, priorityStat: true, isBroken: false})
    const spirituality = await db.Stat.create({name: "Spirituality", statId: 0, dice: spiritualityRolls, trainingPoints: 0, isBroken: false})
    const sociability = await db.Stat.create({name: "Sociability", statId: 0, dice: sociabilityRolls, trainingPoints: 0, isBroken: false})
    const deception = await db.Stat.create({name: "Deception", statId: 0, dice: deceptionRolls, trainingPoints: 0, isBroken: false})
    const management = await db.Stat.create({name: "Management", statId: 0, dice: managementRolls, trainingPoints: 0, isBroken: false})
    const learning = await db.Stat.create({name: "Learning", statId: 0, dice: learningRolls, trainingPoints: 0, isBroken: false})
    let stats = [athleticism, spirituality, sociability, deception, management, learning];
    let priorityStat = Math.floor(Math.random()*5+1);
    for(let x=1; x<stats.length; x++){
        if(priorityStat==x){
            stats[x].priorityStat = true;
            stats[x].save();
        }
    }
    return stats;
}

const statCalc = function(rolls, unit, index){
    if(!rolls.length){
        if(Math.floor(Math.random()*100000)==0){
            unit.statProdigies[index] = true;
        }
    }
    let roll = Math.floor(Math.random()*6)+1;
    let traitRoll = dice.natRoll();
    if(roll==1){
        if(traitRoll==1){
            addNegativeTrait(unit, -50, index);
        }
        if(traitRoll==2){
            addNegativeTrait(unit, -25, index);
        }
        if(traitRoll<5){
            addNegativeTrait(unit, -10, index);
        }
        if(traitRoll<7){
            addNegativeTrait(unit, -5, index);
        }
        if(traitRoll<9){
            addNegativeTrait(unit, 0, index);
        }
        if(traitRoll==9){
            addNegativeTrait(unit, +5, index);
        }
    }
    if(roll==6){
        if(traitRoll==100){
            addPositiveTrait(unit, 50, index);
        }
        if(traitRoll==99){
            addPositiveTrait(unit, 25, index);
        }
        if(traitRoll>95){
            addPositiveTrait(unit, 10, index);
        }
        if(traitRoll>93){
            addPositiveTrait(unit, 5, index);
        }
        if(traitRoll>91){
            addPositiveTrait(unit, 0, index);
        }
        if(traitRoll==91){
            addPositiveTrait(unit, -5, index);
        }
    }
    rolls.push(roll);
    return rolls;
}

const addNegativeTrait = async function(unit, modifier, index){
    dice.clear();
    dice.addModifier("Trait Roll", modifier);
    let roll = dice.roll();
    let significance = 0;
    while(roll>99){
        significance +=5;
        roll-100;
        if(roll<100){
            roll==99;
        }
    }
    while(roll<1){
        significance += -50;
        roll+100;
        if(roll>0){
            roll==2;
        }
    }
    if(roll==2){
        significance = -45;
    }
    else if(roll==3){
        significance = -40
    }
    else if(roll==4){
        significance = -35
    }
    else if(roll==5){
        significance = -30;
    }
    else if(roll<10){
        significance = -25;
    }
    else if(roll<30){
        significance = -20;
    }
    else if(roll<50){
        significance = -15;
    }
    else if(roll<80){
        significance = -10;
    }
    else if(roll<90){
        significance = -5;
    }
    else if(roll<95){
        significance = -3;
    }
    else if(roll<99){
        significance = 0;
    }
    else if(roll==99){
        significance = +1;
    }
    const newTrait = await db.Trait.create({name: "Special Negative Trait", statModifiers: [0,0,0,0,0,0]});
    newTrait.statModifiers[index] = significance;
    newTrait.save();
    unit.traits.push(newTrait);
    unit.save();
}

const addPositiveTrait = async function(unit, modifier, index){
    dice.clear();
    dice.addModifier("Trait Roll", modifier);
    let roll = dice.roll();
    let significance = 0;
    while(roll>99){
        significance +=50;
        roll-100;
        if(roll<100){
            roll==99;
        }
    }
    while(roll<1){
        significance += -5;
        roll+100;
        if(roll>0){
            roll==2;
        }
    }
    if(roll==2){
        significance = -1;
    }
    else if(roll==3){
        significance = 0;
    }
    else if(roll==4){
        significance = 3;
    }
    else if(roll==5){
        significance = 5;
    }
    else if(roll<10){
        significance = 10;
    }
    else if(roll<30){
        significance = 15;
    }
    else if(roll<50){
        significance = 20;
    }
    else if(roll<80){
        significance = 25;
    }
    else if(roll<90){
        significance = 30;
    }
    else if(roll<95){
        significance = 35;
    }
    else if(roll<99){
        significance = +40;
    }
    else if(roll==99){
        significance = +45;
    }
    const newTrait = await db.Trait.create({name: "Special Positive Trait", statModifiers: Array(6)});
    newTrait.statModifiers[index] = significance;
    newTrait.save();
    unit.traits.push(newTrait);
    unit.save();
}

const startingAge= function(startingAge){
    let roll = dice.natRoll();
    if(roll==100){
        return startingAge;
    }
    if(roll==99){
        return startingAge+1;
    }
    if(roll<99&&roll>94){
        return startingAge+2;
    }
    if(roll<95&&roll>89){
        return startingAge+3;
    }
    if(roll<90&&roll>79){
        return startingAge+4;
    }
    if(roll<80&&roll>69){
        return startingAge+5;
    }
    if(roll<70&&roll>59){
        return startingAge+6;
    }
    if(roll<60&&roll>49){
        return startingAge+7;
    }
    if(roll<50&&roll>39){
        return startingAge+8;
    }
    if(roll<40&&roll>29){
        return startingAge+9;
    }
    if(roll<30&&roll>19){
        return startingAge+10;
    }
    if(roll<20&&roll>10){
        return startingAge+11;
    }
    if(roll<11&&roll>5){
        return startingAge+12;
    }
    if(roll<6&&roll>1){
        return startingAge=13;
    }
    if(roll==1){
        return startingAge+14;
    }
    return 0;
}
const medpot = function(roll){
    let dieNum = 0
    if(roll ==1){
        dieNum = 4;
    }
    if(roll>1&&roll<10){
        dieNum = 5;
    }
    if(roll>9&&roll<20){
        dieNum = 6;
    }
    if(roll>19&&roll<40){
        dieNum = 7;
    }
    if(roll>39&&roll<60){
        dieNum = 8;
    }
    if(roll>59&&roll<80){
        dieNum = 9;
    }
    if(roll>79&&roll<90){
        dieNum = 10;
    }
    if(roll>89&&roll<100){
        dienum = 11;
    }
    if(roll == 100){
        dieNum = 12;
    }
}
const highpot = function(roll){
    let dieNum = 0;
    if(roll == 1){
        dieNum = 8;
    }
    if(roll>1&&roll<21){
        dieNum = 9;
    }
    if(roll>20&&roll<80){
        dieNum = 10;
    }
    if(roll>79&&roll<100){
        dieNum = 11;
    }
    if(roll == 100){
        dieNum = 12;
    }
    return dieNum;
}

const developCombatStyle = async function(unit, seasonNum, modifier){
    let prodigyCheck = false;
    if(Math.floor(Math.random()*10000)==0){
        prodigyCheck = true;
    }
    const generalCombatInfo = await db.Trainable.create({trainingPoints:0,type:0,prodigy:prodigyCheck})
    prodigyCheck = false;
    if(Math.floor(Math.random()*1000)==0){
        prodigyCheck = true;
    }
    const secondaryCombatInfo = await db.Trainable.create({trainingPoints:0,type:1,prodigy:prodigyCheck})
    prodigyCheck = false;
    if(Math.floor(Math.random()*100)==0){
        prodigyCheck = true;
    }
    const weaponStyleInfo = await db.Trainable.create({trainingPoints:0,type:2,prodigy:prodigyCheck})
    const generalCombatKnowledge = await db.Knowledge.create({name:"General Combat", type: 0, info: generalCombatInfo});
    prodigyCheck = false;
    if(Math.floor(Math.random()*100)==0){
        prodigyCheck = true;
    }
    const weaponStyleSkill = await db.Trainable.create({trainingPoints:0,type:4,prodigy:prodigyCheck})
    const generalCombatKnowledge = await db.Knowledge.create({name:"General Combat", type: 0, info: generalCombatInfo});
    const specializedCombatKnowledge = await db.Knowledge.create({name:"Specialized Combat", type: 0, info: secondaryCombatInfo});
    const weaponStyleKnowledge = await db.Knowledge.create({name:"Highly Specialized Combat", type: 0, info: weaponStyleInfo});
    const weaponStyleSkillKnowledge = await db.Knowledge.create({name:"Weapon Style", type: 0, info: weaponStyleSkill});
    const weaponTree = await db.KnowledgeTree.create({generalKnowledge:[generalCombatKnowledge],specializedKnowledge:[specializedCombatKnowledge],highlySpecializedKnowledge:[weaponStyleKnowledge],skills:[weaponStyleSkillKnowledge]});
    generalCombatKnowledge.knowledgeTree = weaponTree;
    generalCombatKnowledge.save();
    specializedCombatKnowledge.knowledgeTree = weaponTree;
    specializedCombatKnowledge.save();
    weaponStyleKnowledge.knowledgeTree = weaponTree;
    weaponStyleKnowledge.save();
    weaponStyleSkillKnowledge.knowledgeTree = weaponTree;
    weaponStyleSkillKnowledge.save();
    const combatStyle = await db.CombatStyle.create({name: "Combat Style", character: unit, weaponStyle: weaponStyleSkillKnowledge})

}

const getUnit = async function(){
    const recruitedUnit = await recruitUnit(-1,"high");
    console.log(recruitedUnit);
}
