const mongoose = require("mongoose");
const characterInfoSchema = new mongoose.Schema(
    {
        firstName: {type: String},
        lastName: {type: String},
        avatar: {type: String},
        birthday: {type: Number},
        age: {type: Number},
        stressLevel: {type: Number},
        fateRerolls: {available: {type: Number}, max: {type: Number}},
        mana: {available: {type: Number}, max: {type: Number}},
        profession: {type: String},
        savings: {type: Number}, 
        salary: {type: Number}, 
        lifestyle: {type: Number},
        description: {type: String},
        stats: [{type: mongoose.Schema.Types.ObjectId, ref: "Stat"}],
        traits: [[{type: mongoose.Schema.Types.ObjectId, ref: "Trait"}]],
        knowledgeTrees: [{type: mongoose.Schema.Types.ObjectId, ref: "KnowledgeTree"}],
        combatStyles: [{type: mongoose.Schema.Types.ObjectId, ref: "CombatStyle"}],
        genderRoll: {type: Number},
        statProdigies: [{type: Boolean}]
    },
    {timestamps: true}
)

characterInfoSchema.methods.fullName = function fullname(){
    return this.firstName + " " + this.lastName;
}

characterInfoSchema.methods.birthDate = function birthDate(){
    let year = Math.floor(this.birthday/365);
    let day = this.birthday%365;
    if(day<0){
        day = 365 + day;
        year++;
    }
    let date = new Date(year, 0);
    let foundDate = new Date(date.setDate(day));
    return `${foundDate.toLocaleString('default', { month: 'long' })} ${foundDate.getDate()}`;
}

characterInfoSchema.methods.lifestyleString = function lifestyleString(){
    if(this.lifestyle===0){
        return "Actively Struggling";
    }
    if(this.lifestyle===1){
        return "Decent";
    }
    if(this.lifestyle===2){
        return "Good";
    }
    if(this.lifestyle===3){
        return "Luxury";
    }
    if(this.lifestyle===4){
        return "Emperor";
    }
}

characterInfoSchema.methods.allTraits = function allTraits(){
    return [...this.traits[0],...this.traits[1],...this.traits[2],...this.traits[3],...this.traits[4]];
}

const CharacterInfo = mongoose.model("CharacterInfo", characterInfoSchema);

module.exports = CharacterInfo;


