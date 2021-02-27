const mongoose = require("mongoose");
const statSchema = new mongoose.Schema(
    {
        name: {type: String},
        statId: {type: Number},
        priorityStat: {type: Boolean},
        dice: [{type:Number}],
        trainingPoints: {type:Number},
        rerolls: {available: {type: Number}, max: {type: Number}},
        isBroken: {type: Boolean}
    },
    {timestamps: true}
)

statSchema.methods.diceValue = function diceValue(){
    let total = 0;
    this.dice.forEach(dieValue => {
        total = total + dieValue;
        if(this.priorityStat){
            total++;
        }
    });
    return total;
}

statSchema.methods.baseValue = function baseValue(){
    let total = this.diceValue();
    let nextStat = total + 1;
    let trainingThreshold = (nextStat*5)+(nextStat*nextStat);
    let trainingPoints = this.trainingPoints;
    while(trainingPoints>=trainingThreshold){
        trainingPoints = trainingPoints-trainingThreshold;
        total++;
        nextStat++;
        trainingThreshold = (nextStat*5)+(nextStat*nextStat);
    }
    return total;
}

statSchema.methods.totalValue = function totalValue(traits){
    let total = this.baseValue();
    traits.forEach(trait => {
        if(trait.statModifiers.length)
        total = total+trait.statModifiers[this.statId];
    });
    if(total>30){
        if(!this.isBroken){
            return 30;
        }
    }
    return total;
}

statSchema.methods.totalValueString = function totalvalueString(traits){
    let total = this.baseValue();
    traits.forEach(trait => {
        if(trait.statModifiers.length)
        total = total+trait.statModifiers[this.statId];
    });
    if(total>30){
        if(!this.isBroken){
            return `${total} [30]`;
        }
    }
    return total;  
}

const Stat = mongoose.model("Stat", statSchema);

module.exports = Stat;