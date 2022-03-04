const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {type: String},
    weaponStyle: {type: mongoose.Schema.Types.ObjectId, ref: "Knowledge"},
    fightingStyles: [{type: mongoose.Schema.Types.ObjectId, ref: "Fightingstyle"}],
    weaponTypes: [{type: mongoose.Schema.Types.ObjectId, ref: "Weapontype"}],
    rerolls: [{amount: {type: Number}, reroll: {name: {type: String}}}],
    weapons: [{type: mongoose.Schema.Types.ObjectId, ref: "Equipment"}],
    armor: {type: mongoose.Schema.Types.ObjectId, ref: "Equipment"},
    character: {type: mongoose.Schema.Types.ObjectId, ref: "Characterinfo"},
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

schema.methods.meleeArmor = function meleeArmor(){
  return this.armor.meleeArmor;
}

schema.methods.rangedArmor = function rangedArmor(){
  return this.armor.rangedArmor;
}

schema.methods.armorDurability = function armorDurability(){
  return this.armor.durability;
}

schema.methods.weaponWeight = function weaponWeight(){
  let total = 0;
  for(let x=0; x<this.weapons.length; x++){
    total +=this.weapons[x].weight;
  }
  return total;
}

schema.methods.armorWeight = function armorWeight(){
  return this.armor.weight;
}

schema.methods.weightValue = function weightValue(){
  return this.weaponWeight() + this.armorWeight();
}

schema.methods.weightClass = function weightClass(){
  if(this.weightValue()<0){
    return "Impossibly Heavy"
  }
  if(this.weightValue()==0){
    return "Incredibly Light"
  }
  if(this.weightValue()>62){
    return "Impossibly Heavy"
  }
  if(this.weightValue()>30){
    return "Very Heavy"
  }
  if(this.weightValue()>14){
    return "Heavy"
  }
  if(this.weightValue()>6){
    return "Medium"
  }
  if(this.weightValue()>2){
    return "Light"
  }
  if(this.weightValue()>0){
    return "Very Light"
  }
}

schema.methods.weightModifier = function weightModifier(){
  if(this.weightClass()=="Impossibly Light"){
    return 20
  }
  if(this.weightClass()=="Incredibly Light"){
    return 10
  }
  if(this.weightClass()=="Very Light"){
    return 5
  }
  if(this.weightClass()=="Light"){
    return 0
  }
  if(this.weightClass()=="Medium"){
    return -5
  }
  if(this.weightClass()=="Heavy"){
    return -10
  }
  if(this.weightclass()=="Very Heavy"){
    return -20
  }
}

const Model = mongoose.model("Combatstyle", schema);

module.exports = Model;