const mongoose = require("mongoose");
const statSchema = new mongoose.Schema(
    {
        name: {type: String},
        statId: {type: Number},
        priorityStat: {type: Boolean},
        dice: [{type:Number}],
        trainingPoints: {type:Number},
        rerolls: {available: {type: Number}, max: {type: Number}}
    },
    {timestamps: true}
)

statSchema.methods.diceValue = async function diceValue(){
    let total = 0;
    dice.forEach(dieValue => {
        total = total + dieValue;
        if(this.priorityStat){
            total++;
        }
    });
    return total;
}

statSchema.methods.baseValue = async function baseValue(){
    let total = this.diceValue;
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

statSchema.methods.totalValue = async function totalValue(traits){
    let total = this.baseValue;
    traits.forEach(trait => {
        total = total+trait.statModifiers[statId];
    });
    return total;
}

const Stat = mongoose.model("Stat", statSchema);

module.exports = Stat;