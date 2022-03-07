const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {type: String},
    weaponStyle: {type: mongoose.Schema.Types.ObjectId, ref: "Knowledge"},
    fightingStyles: [{type: mongoose.Schema.Types.ObjectId, ref: "Fightingstyle"}],
    weaponTypes: [{type: mongoose.Schema.Types.ObjectId, ref: "Weapontype"}],
    weapons: [{type: mongoose.Schema.Types.ObjectId, ref: "Equipment"}],
    armor: {type: mongoose.Schema.Types.ObjectId, ref: "Equipment"},
    character: {type: mongoose.Schema.Types.ObjectId, ref: "Characterinfo"},
  },
  {timestamps: true}
)

schema.methods.rerolls = function rerolls(){
  let rerollList = [];
  for(let x=0; x<this.fightingStyles.length; x++){
    rerollList.push({name: this.fightingStyles[x].reroll, available: 1, max: 1});
    if(x==0&&this.weaponStyle.info.rank()>5){
      rerollList[rerollList.length-1].available = 2;
      rerollList[rerollList.length-1].max = 2;
    }
    if(x==1&&this.weaponStyle.info.rank()>6){
      rerollList[rerollList.length-1].available = 2;
      rerollList[rerollList.length-1].max = 2;
    }
  }
  return rerollList;
}

schema.methods.allRerolls = function allRerolls(){
  let rerolls = this.rerolls();
  let statRoll = this.character.stats[0].rerolls;
  if(statRoll.max>0){
    rerolls.push({name: "Athletics Reroll",available: statRoll.available, max: statRoll.max})
  }
  statRoll = this.character.stats[1].rerolls;
  if(statRoll.max>0){
    rerolls.push({name: "Spirituality Reroll",available: statRoll.available, max: statRoll.max})
  }
  fateRoll = this.character.fateRerolls;
  if(fateRoll.max>0){
    rerolls.push({name: "Fate Reroll",available: fateRoll.available, max: fateRoll.max})
  }
  return rerolls;
}

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

schema.methods.allPassiveAbilities = function allPassiveAbilities(){
  let abilities = this.passiveAbilities();
  for(let y=0; y<this.character.traits.combatAbilities.length; y++){
    if(this.character.traits.combatAbilities[y].type=="Passive Battle Ability"){
        abilities.push(this.character.traits.combatAbilities[y])
        abilities[abilities.length-1].amount = 1;
    }
  } 
  for(let y=0; y<this.weaponStyle.knowledgeTree.specialties.length; y++){
    if(this.weaponStyle.knowledgeTree.specialties[y].type=="Passive Battle Ability"){
        abilities.push(this.weaponStyle.knowledgeTree.specialties[y])
        abilities[abilities.length-1].amount = 1;
        abilities[abilities.length-1].name += " [Rank " + abilities[abilities.length-1].info.rankString() + "]";
    }
  }
  for(let y=0; y<this.character.spiritPowers.length; y++){
    if(this.character.spiritPowers[y].battle){
      if(!this.character.spiritPowers[y].active){
        abilities.push(this.character.spiritPowers[y])
        abilities[abilities.length-1].amount = 1;
        abilities[abilities.length-1].name += " [Rank " + abilities[abilities.length-1].info.rankString() + "]";
      }
    }
  }
  return abilities;
}

schema.methods.allActiveAbilities = function allActiveAbilities(){
  let abilities = [];
  for(let y=0; y<this.weaponTypes.length; y++){
    abilities.push(this.weaponTypes[y].specialAbility);
    if(this.weaponStyle.info.rank()>6){
      abilities[abilities.length-1].available = 3;
      abilities[abilities.length-1].max = 3;
    }else if(this.weaponStyle.info.rank()==6){
      abilities[abilities.length-1].available = 2;
      abilities[abilities.length-1].max = 2;
    }else{
      abilities[abilities.length-1].available = 1;
      abilities[abilities.length-1].max = 1;
    }
  }
  abilities = [...abilities, ...this.allRerolls()];
  for(let y=0; y<this.character.traits.combatAbilities.length; y++){
    if(this.character.traits.combatAbilities[y].type=="Activated Battle Ability"){
        abilities.push(this.character.traits.combatAbilities[y])
        abilities[abilities.length-1].available = 1;
      abilities[abilities.length-1].max = 1;
    }
  } 
  for(let y=0; y<this.weaponStyle.knowledgeTree.specialties.length; y++){
    if(this.weaponStyle.knowledgeTree.specialties[y].type=="Activated Battle Ability"){
        abilities.push(this.weaponStyle.knowledgeTree.specialties[y])
        abilities[abilities.length-1].available = 1;
      abilities[abilities.length-1].max = 1;
    }
  }
  for(let y=0; y<this.character.spiritPowers.length; y++){
    if(this.character.spiritPowers[y].battle&&this.character.spiritPowers[y].active){
      abilities.push(this.character.spiritPowers[y])
      abilities[abilities.length-1].available = 1;
      abilities[abilities.length-1].max = 1;
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