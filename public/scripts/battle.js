class Battle{
    constructor(combatants,grid=false){
        this.combatants = combatants;
        for(let x=0; x<combatants.length; x++){
            this.combatants[x].dice = new Dice();
            this.combatants[x].trueMaxStamina = this.combatants[x].maxStamina;
        }
        this.roundCount = 1;
        this.phase = "Initiative Phase";
        console.log("New Battle Created!")
        console.log("Combatants:")
        for(let x=0; x<combatants.length; x++){
            console.log(this.combatants[x].name)
        }
        console.log("");
        console.log("Initiative Phase:");
    }
    //Automation Methods
    automateSimpleBattle(){
        this.automatic1v1DeclareActions();
        this.automatic1v1Combat();
    }
    automatic1v1DeclareActions(){
        this.declareAction(0,{name: "Attack", targets: [this.combatants[1].name]})
        this.declareAction(1,{name: "Attack", targets: [this.combatants[0].name]})
        this.confirmAllActionsDeclared();
    }
    automatic1v1Combat(){
        this.calculateAction(this.combatants[0]);
        let defensePoints = this.combatants[1].defensePoints;
        if(this.combatants[1].unresolvedAttacks[0].value - this.combatants[1].defensePoints<0){
            defensePoints = this.combatants[1].unresolvedAttacks[0].value
        };
        this.defend(this.combatants[1].name,this.combatants[0].name, defensePoints)
        this.overwhelmingDefense(this.combatants[1].name,this.combatants[1].defensePoints)
        this.calculateTotalDamage(this.combatants[1].name)

        this.calculateAction(this.combatants[1]);
        defensePoints = this.combatants[0].defensePoints;
        if(this.combatants[0].unresolvedAttacks[0].value - this.combatants[0].defensePoints<0){
            defensePoints = this.combatants[0].unresolvedAttacks[0].value
        };
        this.defend(this.combatants[0].name,this.combatants[1].name, defensePoints)
        this.overwhelmingDefense(this.combatants[0].name,this.combatants[0].defensePoints)
        this.calculateTotalDamage(this.combatants[0].name)
        this.confirmAllActionsCalculated();
    }
    //Universal Methods
    rollFor(combatant){
        if(combatant.tempModifiers){
            for(let x=0; x<combatant.tempModifiers.length; x++){
                combatant.dice.addModifier(combatant.tempModifiers[x]);
            }
            combatant.tempModifiers = [];
        }
        if(combatant.woundedLevel>0){
            let totalModifier = 0;
            let woundedModifier = 0;
            for(let x=0; x<combatant.dice.modList.length; x++){
                totalModifier += combatant.dice.modList[x].value;
            }
            if(combatant.woundedLevel==1){
                woundedModifier = 5;
                if(Math.round(totalModifier/10)>woundedModifier){
                    woundedModifier = Math.round(totalModifier/10);
                }
            }
            if(combatant.woundedLevel==2){
                woundedModifier = 15;
                if(Math.round(totalModifier/5)>woundedModifier){
                    woundedModifier = Math.round(totalModifier/5);
                }
            }
            if(combatant.woundedLevel==3){
                woundedModifier = 30;
                if(Math.round(totalModifier/2)>woundedModifier){
                    woundedModifier = Math.round(totalModifier/2);
                }
            }
            if(combatant.woundedLevel==4){
                woundedModifier = 100;
                if(Math.round((totalModifier/5)*4)>woundedModifier){
                    woundedModifier = Math.round((totalModifier/5)*4);
                }
            }
            combatant.dice.addModifier({name:combatant.woundedType,value:woundedModifier*-1})
        }
        let roll = combatant.dice.roll();
        combatant.initiativeScore += (combatant.dice.latestCritCount * 10) + (combatant.dice.latestCritFailCount * -10);
        this.update(combatant);
        return combatant.dice.latestResult;
    }
    customRollFor(combatant,customRollList){
        if(combatant.tempModifiers){
            for(let x=0; x<combatant.tempModifiers.length; x++){
                combatant.dice.addModifier(combatant.tempModifiers[x]);
            }
            combatant.tempModifiers = [];
        }
        if(combatant.woundedLevel>0){
            let totalModifier = 0;
            let woundedModifier = 0;
            for(let x=0; x<combatant.dice.modList.length; x++){
                totalModifier += combatant.dice.modList[x].value;
            }
            if(combatant.woundedLevel==1){
                woundedModifier = 5;
                if(Math.round(totalModifier/10)>woundedModifier){
                    woundedModifier = Math.round(totalModifier/10);
                }
            }
            if(combatant.woundedLevel==2){
                woundedModifier = 15;
                if(Math.round(totalModifier/5)>woundedModifier){
                    woundedModifier = Math.round(totalModifier/5);
                }
            }
            if(combatant.woundedLevel==3){
                woundedModifier = 30;
                if(Math.round(totalModifier/2)>woundedModifier){
                    woundedModifier = Math.round(totalModifier/2);
                }
            }
            if(combatant.woundedLevel==4){
                woundedModifier = 100;
                if(Math.round((totalModifier/5)*4)>woundedModifier){
                    woundedModifier = Math.round((totalModifier/5)*4);
                }
            }
            combatant.dice.addModifier({name:combatant.woundedType,value:woundedModifier*-1})
        }
        let roll = combatant.dice.customRollFull(customRollList);
        combatant.initiativeScore += (combatant.dice.latestCritCount * 10) + (combatant.dice.latestCritFailCount * -10);
        this.update(combatant);
        return combatant.dice.latestResult;
    }
    update(combatant){
        for(let x=0; x<this.combatants.length; x++){
            if(combatant.name == this.combatants[x].name){
                this.combatants[x] = combatant;
            }
        }
    }
    //Initative Methods
    rollFlatInitiativeAll(){
        console.log("Auto-Rolling Initiative...")
        for(let x=0; x<this.combatants.length; x++){
            this.rollInitiative(x)
        }
        this.calculateOrder();
        console.log("Initiative Order: ")
        for(let x=0; x<this.combatants.length; x++){
            console.log(this.combatants[x].name + " (" + this.combatants[x].initiativeScore + ")");
        }
    }
    rollInitiativeFor(combatantName, additionalModifiers=false){
        console.log("Rolling Initiative For " + combatantName + "...")
        for(let x=0; x<this.combatants.length; x++){
                if(this.combatants[x].name==combatantName){
                    this.rollInitiative(x, additionalModifiers)
                }
        }
    }
    rollCustomInitiativeFor(combatantName, additionalModifiers=false, customRollList){
        console.log("Rolling Custom Initiative For " + combatantName + "...")
        for(let x=0; x<this.combatants.length; x++){
            if(this.combatants[x].name==combatantName){
                this.rollCustomInitiative(x, additionalModifiers, customRollList)
            }
        }
    }
    rollInitiative(x, additionalModifiers=false){
        let modifiersList = [];
        if(additionalModifiers)
            modifiersList.push(...additionalModifiers);
        modifiersList.push(this.combatants[x].initiativeModifiers);
        for(let y=0; y<modifiersList.length; y++){
            this.combatants[x].dice.addModifier(modifiersList[y]);
        }
        console.log(this.combatants[x].name + "'s Roll:")
        let roll = this.combatants[x].dice.roll();
        this.combatants[x].initiativeScore = this.combatants[x].dice.latestResult;
    }
    rollCustomInitiative(x, additionalModifiers=false, customRollList){
        let modifiersList = [];
        if(additionalModifiers)
            modifiersList.push(...additionalModifiers);
        modifiersList.push(this.combatants[x].initiativeModifiers);
        for(let y=0; y<modifiersList.length; y++){
            this.combatants[x].dice.addModifier(modifiersList[y]);
        }
        let roll = this.combatants[x].dice.customRollFull(customRollList);
        this.combatants[x].initiativeScore = this.combatants[x].dice.latestResult;
    }
    //Phase Transition Method
    calculateOrder(){
        let initiativeScores = [];
        for(let x=0; x<this.combatants.length; x++){
            initiativeScores.push(this.combatants[x].initiativeScore);
        }
        quickSort(initiativeScores,0,initiativeScores.length-1,this.combatants);
        this.phase = "Action Declaration Phase";
        console.log("");
        console.log("Stats:")
        for(let x=0; x<this.combatants.length; x++){
            console.log(this.combatants[x].name)
            console.log("Health: " + this.combatants[x].health + "/" + this.combatants[x].maxHealth + " (" + this.combatants[x].woundedType + ")")
            console.log("Stamina: " + this.combatants[x].stamina + "/" + this.combatants[x].maxStamina + " (" + this.combatants[x].exhaustionType + ")")
            console.log("Initiative: " + this.combatants[x].initiativeScore)
            console.log("")
        }
        console.log("Action Declaration Phase:")
    }

    //Action Declaration Methods
    declareActionFor(combatantName, action, movement=false){
        for(let x=0; x<this.combatants.length; x++){
            if(this.combatants[x].name==combatantName){
                this.declareAction(x, action, movement)
            }
        }
    }
    declareAction(x, action, movement=false){
        this.combatants[x].action = action;
        if(movement)
            this.combatants[x].movement = movement;
    }
    //Phase Transition Method && Conflict Detection Method
    confirmAllActionsDeclared(){
        if(this.grid){
            this.phase = "Movement Phase"
            this.calculateMovementPhase()
        }else{
            this.phase = "Action Phase"
            for(let x=0; x<this.combatants.length; x++){
                console.log(this.combatants[x].name + " " + this.combatants[x].action.name + "s!")
                //could probably add a for loop that details every target in case of multiple targets for above console.log
            }
            console.log("");
            console.log("Action Calculation Phase:")
        }
    }
    calculateMovementPhase(){
        /* Can make alternate movement every square until out of movement points */
    }

    //Action Methods
    calculateActionFor(combatantName){
        for(let x=0; x<this.combatants.length; x++){
            if(this.combatants[x].name==combatantName){
                console.log(this.combatants[x].name + " " + this.combatants[x].action.name + "s!");
                this.calculateAction(this.combatants[x]);
            }
        }
    }
    calculateAction(combatant){
        if(combatant.action.name=="Attack"){
            let target;
            let attackers = [];
            //Attack!
            let defender;
            for(let x=0; x<this.combatants.length; x++){
                if(combatant.action.targets.length<2){
                    if(this.combatants[x].name == combatant.action.targets[0]){
                        this.combatants[x] = this.calculateAttack(combatant,this.combatants[x])
                        attackers.push(combatant);
                        target = this.combatants[x].name;
                        defender = this.combatants[x];
                    }
                }else{
                    //NEED TO ADD HANDLING FOR MULTITARGET ATTACKING
                }

            }
            //If anyone else is targetting they also get to go HAVENT ACCOUNTED FOR SPELLS YET!!!!
            for(let x=0; x<this.combatants.length; x++){
                if(this.combatants[x].action){
                    for(let z=0; z<this.combatants[x].action.targets.length; z++){
                        if(this.combatants[x].action.targets[z] == target){
                            if(this.combatants[x].name != combatant.name){
                                for(let y=0; y<this.combatants.length; y++){
                                    if(this.combatants[y].name == target){
                                            attackers.push(this.combatants[x]);
                                            this.combatants[y] = this.calculateAttack(this.combatants[x],this.combatants[y]);
                                    }
                                }
                            }
                        }
                    }

                }
            }
            //Defense Section
            this.calculateDefense(attackers, defender)
            //Clear Attack Actions
            for(let y=0; y<attackers.length; y++){
                for(let x=0; x<this.combatants.length;x++){
                    if(attackers[y].name == this.combatants[x].name){
                        this.combatants[x].action = null;
                    }
                }
            }
        }
    }
    calculateDefense(attackers, defender){
        console.log(defender.name + " Defends!")
        defender.dice.clear();
        for(let x=0; x<attackers.length; x++){
            //calculate fightingStyle stuff
        }
        for(let x=0; x<defender.defenseModifiers.length; x++){
            defender.dice.addModifier(defender.defenseModifiers[x]);
        }
        let defenseRoll;
        if(!attackers[0].action.customDefenseList){
            defenseRoll = this.rollFor(defender) 
        }else{
            defenseRoll = this.customRollFor(defender,attackers[0].action.customDefenseList) ;
        }
        defender.defensePoints = Math.round(defenseRoll/10);
        this.update(defender);
        console.log("Defense Points: " + defender.defensePoints);
        console.log("Incoming Damage:")
        for(let x=0; x<defender.unresolvedAttacks.length; x++){
            console.log(defender.unresolvedAttacks[x].name + ": " + defender.unresolvedAttacks[x].value);
        }
        //Defend Another is not accounted for
        console.log(defender.name + " Defense Sub-Phase:")
    }
    defend(defenderName,attackerName,points){
        
        console.log(defenderName + " Defends Against " + attackerName + "!")
        for(let x=0; x<this.combatants.length; x++){
            if(this.combatants[x].name==defenderName){
                for(let y=0; y<this.combatants[x].unresolvedAttacks.length;y++){
                    if(this.combatants[x].unresolvedAttacks[y].name==attackerName){
                        if(this.combatants[x].staminaWeightMod){
                            this.combatants[x].stamina = this.combatants[x].stamina - this.combatants[x].staminaWeightMod;
                            this.calculateExhaustion(this.combatants[x])
                        }
                        console.log("Defends " + points + " out of " +this.combatants[x].unresolvedAttacks[y].value + " Points of Damage!")
                        this.combatants[x].unresolvedAttacks[y].value = this.combatants[x].unresolvedAttacks[y].value - points;
                        this.combatants[x].defensePoints = this.combatants[x].defensePoints - points;
                        console.log("Remaining Attack Points: " + this.combatants[x].unresolvedAttacks[y].value)
                        console.log("Remaining Defense Points: " + this.combatants[x].defensePoints);
                    }
                }
            }
        }
    }
    overwhelmingDefense(defenderName, points){
        let bonus = Math.floor(points/10);
        for(let x=0; x<this.combatants.length; x++){
            if(this.combatants[x].name==defenderName){
                if(this.combatants[x].parry){
                    if(this.combatants[x].parry==1){
                        console.log(defenderName + " Uses Parry!")
                        bonus = bonus*10;
                    }
                    if(this.combatants[x].parry==2){
                        console.log(defenderName + " Uses Enhanced Parry!")
                        bonus = bonus*15;
                    }
                }else{
                    console.log(defenderName + " Uses Overwhelming Defense!")
                    bonus = bonus*5;
                }
                this.combatants[x].defensePoints = this.combatants[x].defensePoints - points;
                let attackers = [];
                for(let y=0; y<this.combatants[x].unresolvedAttacks.length; y++){
                    attackers.push(this.combatants[x].unresolvedAttacks[y].name);
                }
                this.combatants[x].parryModifier = {attackers: attackers,value: bonus};
                console.log(defenderName + " Gains a +" + this.combatants[x].parryModifier.value + " Bonus!")
            }
        }
    }
    counter(defenderName,attackerName, customAttackList, customDefenseList){
        console.log(defenderName + " Counters!");
        for(let x=0; x<this.combatants.length; x++){
            if(this.combatants[x].name == defenderName){
                for( let y=0; y<this.combatants.length; y++){
                    if(this.combatants[y].name == attackerName){
                        let defenderAction = this.combatants[x].action;
                        this.combatants[x].action = {name: "Attack",targets: [this.combatants[y].name],customAttackList: customAttackList,customDefenseList: customDefenseList}
                        this.combatants[x].counterModifier = {name: "Counter",value:this.combatants[x].defensePoints*10}
                        this.combatants[y] = this.calculateAttack(this.combatants[x],this.combatants[y])
                        this.calculateDefense([this.combatants[x]],this.combatants[y])
                        this.defend(attackerName,defenderName,this.combatants[y].defensePoints);
                        this.calculateTotalDamage(attackerName);
                        this.combatants[x].action = defenderAction;
                    }
                }
            }
        }
    }
    calculateTotalDamage(defenderName){
        let totalDamage = 0;
        for(let x=0; x<this.combatants.length; x++){
            if(defenderName == this.combatants[x].name){
                for(let y=0; y<this.combatants[x].unresolvedAttacks.length; y++){
                    let finalDamage = this.calculateAttackerDamage(this.combatants[x].unresolvedAttacks[y]);
                    console.log(finalDamage + " Damage from " + this.combatants[x].unresolvedAttacks[y].name + "!");
                    totalDamage += finalDamage;
                    this.combatants[x].unresolvedAttacks.splice(y,1)
                    y--;
                }
                console.log("Total Damage Taken: " + totalDamage);
                this.combatants[x].health = this.combatants[x].health - totalDamage;
                this.combatants[x].initiativeScore = this.combatants[x].initiativeScore - totalDamage*10;
                console.log("Remaining Health: " + this.combatants[x].health + "/" + this.combatants[x].maxHealth);
                let woundedLevel = this.combatants[x].woundedLevel;
                if(this.calculateWounded(this.combatants[x])==-1){
                    this.combatants[x].woundedType = "Dead!";
                    //add code to deadify somebody
                }
                if(this.calculateWounded(this.combatants[x])>woundedLevel){
                    this.combatants[x].woundedLevel = this.calculateWounded(this.combatants[x])
                    if(this.combatants[x].stamina>this.combatants[x].maxStamina){
                        excessStamina = this.combatants[x].stamina = this.combatants[x].maxStamina;
                    }
                    if(this.combatants[x].woundedLevel==1){
                        this.combatants[x].woundedType = "Minorly Wounded!";
                        this.combatants[x].stamina = Math.round(this.combatants[x].stamina - ((this.combatants[x].stamina/5)))
                        this.combatants[x].maxStamina = Math.round(this.combatants[x].trueMaxStamina-(this.combatants[x].trueMaxStamina/5))
                    }
                    if(this.combatants[x].woundedLevel==2){
                        this.combatants[x].woundedType = "Wounded!";
                        this.combatants[x].stamina = Math.round(this.combatants[x].stamina - ((this.combatants[x].stamina/5)*2))
                        this.combatants[x].maxStamina = Math.round(this.combatants[x].trueMaxStamina-((this.combatants[x].trueMaxStamina/5)*2))
                    }
                    if(this.combatants[x].woundedLevel==3){
                        this.combatants[x].woundedType = "Heavily Wounded!";
                        this.combatants[x].stamina = Math.round(this.combatants[x].stamina - ((this.combatants[x].stamina/5)*3))
                        this.combatants[x].maxStamina = Math.round(this.combatants[x].trueMaxStamina-((this.combatants[x].trueMaxStamina/5)*3))
                    }
                    if(this.combatants[x].woundedLevel==4){
                        this.combatants[x].woundedType = "Critically Wounded!";
                        this.combatants[x].stamina = Math.round(this.combatants[x].stamina - ((this.combatants[x].stamina/5)*4))
                        this.combatants[x].maxStamina = Math.round(this.combatants[x].trueMaxStamina-((this.combatants[x].trueMaxStamina/5)*4))
                    }
                    this.combatants[x].exhaustionLevel = this.calculateExhaustion(this.combatants[x]);
                    console.log(this.combatants[x].woundedType)
                    console.log("Max Stamina Lowered!");
                    console.log(this.combatants[x].stamina + "/" + this.combatants[x].maxStamina)
                    if(this.combatants[x].exhaustionLevel>0){
                        console.log(this.combatants[x].exhaustionType);
                    }
                }
            }
        }
    }
    calculateExhaustion(combatant){
        if(combatant.stamina<0){
            combatant.exhaustionType = "Exhausted";
            return 3;
        }
        if(combatant.stamina<combatant.maxStamina/4){
            combatant.exhaustionType = "Tired";
            return 2;
        }
        if(combatant.stamina<combatant.maxStamina/2){
            combatant.exhaustionType = "Winded";
            return 1;
        }
        return 0;

    }
    calculateWounded(combatant){
        if(combatant.health<1){
            return -1;
        }
        if(combatant.health<(combatant.maxHealth/5)){
            return 4;
        }
        if(combatant.health<(combatant.maxHealth/5)*2){
            return 3;
        }
        if(combatant.health<(combatant.maxHealth/5)*3){
            return 2;
        }
        if(combatant.health<(combatant.maxHealth/5)*4){
            return 1;
        }
        return 0;
    }
    calculateAttackerDamage(attack){
        //Need to check for abilities that deal more damage or whatever
        return attack.value;
    }
    calculateAttack(attacker, defender){
        console.log(attacker.name + " Attacks " + defender.name + "!")
        if(attacker.staminaWeightMod){
            attacker.stamina = attacker.stamina - attacker.staminaWeightMod;
            this.update(attacker);
        }
        attacker.dice.clear();
        if(this.roundCount == 1){
            //Calculate Initiative Modifier
            let iniModifier = Math.floor((attacker.initiativeScore-defender.initiativeScore)/10);
            if(iniModifier>0){
                if(!attacker.tempModifiers){
                    attacker.tempModifiers = [];
                }
                attacker.tempModifiers.push({name: "Initiative Bonus", value: iniModifier});
            }
        }
        if(attacker.parryModifier){
            let parryValid = false;
            for(let x=0; x<attacker.parryModifier.attackers.length; x++){
                if(defender.name==attacker.parryModifier.attackers[x]){
                    parryValid = true;
                }
            }
            if(parryValid){
                if(!attacker.tempModifiers){
                    attacker.tempModifiers = [];
                }
                if(attacker.parry)
                attacker.tempModifiers.push({name: "Parry Bonus", value: attacker.parryModifier.value})
                else
                attacker.tempModifiers.push({name: "Overwhelming Defense Bonus", value: attacker.parryModifier.value})
            }
            attacker.parryModifier = false;
        }
        if(attacker.counterModifier){
            attacker.dice.addModifier(attacker.counterModifier);
            attacker.counterModifier = false;
        }else{
            for(let x=0; x<attacker.attackModifiers.length; x++){
                attacker.dice.addModifier(attacker.attackModifiers[x]);
            }
        }
        let attackRoll;
        if(!attacker.action.customAttackList){
            attackRoll = this.rollFor(attacker) 
        }else{
            attackRoll = this.customRollFor(attacker,attacker.action.customAttackList) ;
        }
        let attackPoints = Math.round(attackRoll/10)
        let attack = {name: attacker.name,value: attackPoints}
        if(!defender.unresolvedAttacks){
            defender.unresolvedAttacks = [];
        }
        defender.unresolvedAttacks.push(attack);
        console.log("Attack Points: " + attack.value)
        return defender;
    }
    //End Action Phase, Start New Round!
    confirmAllActionsCalculated(){
        console.log("");
        this.roundCount++;
        console.log("Round " + this.roundCount);
        this.calculateOrder();
    }
}

