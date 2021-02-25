const mongoose = require("mongoose");
const characterInfoSchema = new mongoose.Schema(
    {
        firstName: {type: String},
        lastName: {type: String},
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
    },
    {timestamps: true}
)

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

const CharacterInfo = mongoose.model("CharacterInfo", characterInfoSchema);

module.exports = CharacterInfo;


