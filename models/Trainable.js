const mongoose = require("mongoose");
const trainableSchema = new mongoose.Schema(
    {
        trainingPoints: {type: Number},
        type: {type: Number}
    },
    {timestamps: true}
)

trainableSchema.methods.rank = async function rank(){
    let rankValue = 0;
    if(this.trainingPoints>14){
        rankValue++;
    }
    if(this.trainingPoints>29){
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

trainableSchema.methods.modifier = async function modifier(){
    var typeMod = 1;
    var rankMod = -5;
    if(this.type>0){
        typeMod=2*this.type;
    }
    if(this.rank===1){ //E
        rankMod = -2.5;
    }
    if(this.rank===2){ //D
        rankMod = 0;
    }
    if(this.rank===3){ //C
        rankMod = 2.5;
    }
    if(this.rank===4){ //B
        rankMod = 6.25;
    }
    if(this.rank===5){ //A
        rankMod = 10;
    }
    if(this.rank===6){ //S
        rankMod = 15;
    }
    if(this.rank===7){ //SS
        rankMod = 17.5;
    }
    if(this.rank===8){ //SSS
        rankMod = 20;
    }
    return Math.floor(rankMod*typeMod);
}

const Trainable = mongoose.model("Trainable", trainableSchema);

module.exports = Trainable;