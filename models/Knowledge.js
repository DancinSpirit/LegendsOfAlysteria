const mongoose = require("mongoose");
const knowledgeSchema = new mongoose.Schema(
    {
        name: {type: String},
        type: {type: Number},
        info: {type: mongoose.Schema.Types.ObjectId, ref: "Trainable"},
        knowledgeTree: {type: mongoose.Schema.Types.ObjectId, ref: "Knowledgetree"},
    },
    {timestamps: true}
)

knowledgeSchema.methods.totalModifier = function totalModifier(){
    let total = this.info.modifier();
    if(this.type>0){
        total = total + this.knowledgeTotal(this.knowledgeTree.generalKnowledge);
    }
    if(this.type>1){
        total = total + this.knowledgeTotal(this.knowledgeTree.specializedKnowledge);
    }
    if(this.type>2){
        total = total + this.knowledgeTotal(this.knowledgeTree.highlySpecializedKnowledge);
    }
    return total;
}

knowledgeSchema.methods.totalSkillModifier = function totalSkillModifier(){
    let total = this.info.skillModifier();
    if(this.type>0){
        total = total + this.knowledgeTotal(this.knowledgeTree.generalKnowledge);
    }
    if(this.type>1){
        total = total + this.knowledgeTotal(this.knowledgeTree.specializedKnowledge);
    }
    if(this.type>2){
        total = total + this.knowledgeTotal(this.knowledgeTree.highlySpecializedKnowledge);
    }
    return total;
}

knowledgeSchema.methods.knowledgeTotal = function knowledgeTotal(knowledgeGroup){
    let total = 0;
    console.log(knowledgeGroup);
    for(let x=0; x<knowledgeGroup.length; x++){
        total = total + (knowledgeGroup[x].info.modifier()/knowledgeGroup.length);
    }
    return total;
}

const Knowledge = mongoose.model("Knowledge", knowledgeSchema);

module.exports = Knowledge;