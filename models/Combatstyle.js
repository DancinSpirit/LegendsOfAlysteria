const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {type: String},
    weaponStyle: {type: mongoose.Schema.Types.ObjectId, ref: "Knowledge"},
    fightingStyles: [{type: mongoose.Schema.Types.ObjectId, ref: "Fightingstyle"}],
    weaponTypes: [{type: mongoose.Schema.Types.ObjectId, ref: "Weapontype"}],
    rerolls: [{amount: {type: Number}, reroll: {name: {type: String}}}],
    weapons: [{type: mongoose.Schema.Types.ObjectId, ref: "Equipment"}],
    armor: [{type: mongoose.Schema.Types.ObjectId, ref: "Equipment"}],
    character: {type: mongoose.Schema.Types.ObjectId, ref: "CharacterInfo"},
  },
  {timestamps: true}
)

schema.methods.passiveAbilities = function passiveAbilities(){
  let abilities = [];
  for(let y=0; y<this.weaponTypes.length; y++){
    for(let z=0; z<this.weaponTypes[y].passiveAbilities.length; z++){
        if(!abilities.length){
            abilities.push({name: this.weaponTypes[y].passiveAbilities[z].name, amount: 1, effect: this.weaponTypes[y].passiveAbilities[z].effect})
        }
        for(let a=0; a<abilities.length; a++){
            if(this.weaponTypes[y].passiveAbilities[z].name==abilities[a].name){

            }else{
                abilities.push({name: this.weaponTypes[y].passiveAbilities[z].name, amount: 1, effect: this.weaponTypes[y].passiveAbilities[z].effect})
            }
        }
    }
  }
  return abilities;
}

schema.methods.weaponTypeDD = function weaponTypeDD(){
  let total = 0;
  for(let x=0; x<this.weaponTypes.length; x++){
    total +=this.weaponTypes[x].directDamage;
  }
  return total;
}

schema.methods.weaponsDD = function weaponsDD(){
  let total = 0;
  for(let x=0; x<this.weapons.length; x++){
    total +=this.weapons[x].directDamage;
  }
  return total;
}

schema.methods.directDamage = function directDamage(){
  return this.weaponTypeDD() + this.weaponsDD();
}

schema.methods.weaponTypeAP = function weaponTypeAP(){
  let total = 0;
  for(let x=0; x<this.weaponTypes.length; x++){
    total +=this.weaponTypes[x].armorPenetration;
  }
  return total;
}

schema.methods.weaponsAP = function weaponsAP(){
  let total = 0;
  for(let x=0; x<this.weapons.length; x++){
    total +=this.weapons[x].armorPenetration;
  }
  return total;
}

schema.methods.armorPenetration = function armorPenetration(){
  return this.weaponTypeAP() + this.weaponsAP();
}

const Model = mongoose.model("Combatstyle", schema);

module.exports = Model;