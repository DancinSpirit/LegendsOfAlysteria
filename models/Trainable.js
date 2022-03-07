const mongoose = require("mongoose");
const trainableSchema = new mongoose.Schema(
    {
        trainingPoints: {type: Number},
        type: {type: String},
        prodigy: {type: Boolean}
    },
    {timestamps: true}
)

trainableSchema.methods.rank = function rank(){
    let rankValue = 0;
    if(this.trainingPoints>14){
        rankValue++;
    }
    if(this.trainingPoints>29){
        rankValue++;
    }
    if(this.trainingPoints>59){
        rankValue++;
    }
    if(this.trainingPoints>149){
        rankValue++;
    }
    if(this.trainingPoints>359){
        rankValue++;
    }
    if(this.trainingPoints>869){
        rankValue++;
    }
    if(this.trainingPoints>2099){
        rankValue++;
    }
    if(this.trainingPoints>5069){
        rankValue++;
    } 
    return rankValue;
}
trainableSchema.methods.rankUp = function rankUp(rankValue){
if(rankValue=="E"){
    rankValue = "D";
}
else if(rankValue=="D"){
    rankValue = "C";
}
else if(rankValue=="C"){
    rankValue = "B";
}
else if(rankValue=="B"){
    rankValue = "A";
}
else if(rankValue=="A"){
    rankValue = "S";
}
else if(rankValue=="S"){
    rankValue = "SS";
}
else if(rankValue=="SS"){
    rankValue = "SSS";
}
return rankValue;
}
trainableSchema.methods.rankString = function rankString(rankUp){
    let rankValue = "N/A";
    if(this.trainingPoints>14){
        rankValue = "E";
    }
    if(this.trainingPoints>29){
        rankValue = "D";
    }
    if(this.trainingPoints>59){
        rankValue = "C";
    }
    if(this.trainingPoints>149){
        rankValue = "B";
    }
    if(this.trainingPoints>359){
        rankValue = "A";
    }
    if(this.trainingPoints>869){
        rankValue = "S";
    }
    if(this.trainingPoints>2099){
        rankValue = "SS";
    }
    if(this.trainingPoints>5069){
        rankValue = "SSS";
    } 
    if(rankUp){
        let originalValue = rankValue;
        for(let x=0; x<rankUp; x++){
            rankValue = this.rankUp(rankValue);
        }
        rankValue = originalValue + " (" + rankValue + ")";
    }
    return rankValue;
}

trainableSchema.methods.modifier = function modifier(rankUp){
    var typeMod = 1;
    var rankMod = -5;
    if(!rankUp){
        rankUp=0;
    }
    if(this.type>0){
        typeMod=2*this.type;
    }
    if(this.rank()+rankUp===1){ //E
        rankMod = -2.5;
    }
    if(this.rank()+rankUp===2){ //D
        rankMod = 0;
    }
    if(this.rank()+rankUp===3){ //C
        rankMod = 2.5;
    }
    if(this.rank()+rankUp===4){ //B
        rankMod = 6.25;
    }
    if(this.rank()+rankUp===5){ //A
        rankMod = 10;
    }
    if(this.rank()+rankUp===6){ //S
        rankMod = 15;
    }
    if(this.rank()+rankUp===7){ //SS
        rankMod = 17.5;
    }
    if(this.rank()+rankUp===8){ //SSS
        rankMod = 20;
    }
    return Math.floor(rankMod*typeMod);
}

trainableSchema.methods.modString = function modString(rankUp){
    var typeMod = 1;
    var rankMod = -5;
    if(rankUp){
        const newMod = this.modifier(rankUp);
        if(this.rank()===1){ //E
            rankMod = -2.5;
        }
        if(this.rank()===2){ //D
            rankMod = 0;
        }
        if(this.rank()===3){ //C
            rankMod = 2.5;
        }
        if(this.rank()===4){ //B
            rankMod = 6.25;
        }
        if(this.rank()===5){ //A
            rankMod = 10;
        }
        if(this.rank()===6){ //S
            rankMod = 15;
        }
        if(this.rank()===7){ //SS
            rankMod = 17.5;
        }
        if(this.rank()===8){ //SSS
            rankMod = 20;
        }
        const originalMod = Math.floor(rankMod*typeMod);
        return originalMod + " (" + newMod + ")";
    }else{
        return this.modifier(rankUp);
    }
}

/* Skill Only Methods */

trainableSchema.methods.expertModifier = function expertModifier(){
    if((this.trainingPoints-360)>0)
    return Math.floor((this.trainingPoints - 360)/50);
    else
    return 0;
}

trainableSchema.methods.eliteModifier = function eliteModifier(){
    if((this.trainingPoints-870)>0)
    return Math.floor((this.trainingPoints - 870)/100);
    else
    return 0;
}
trainableSchema.methods.masteryModifier = function masteryModifier(){
    if((this.trainingPoints-2100)>0)
    return Math.floor((this.trainingPoints - 2100)/200);
    else
    return 0;
}
trainableSchema.methods.legendaryModifier = function legendaryModifier(){
    if((this.trainingPoints-5070)>0)
    return Math.floor((this.trainingPoints - 5070)/300);
    else
    return 0;
}

trainableSchema.methods.skillModifier = function skillModifier(){
    return this.modifier() + this.expertModifier() + this.eliteModifier() + this.masteryModifier() + this.legendaryModifier();
}


const Trainable = mongoose.model("Trainable", trainableSchema);

module.exports = Trainable;