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

const Trainable = mongoose.model("Trainable", trainableSchema);

module.exports = Trainable;