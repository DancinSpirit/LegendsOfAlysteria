class Grid{
    constructor(height,width){
        this.rows = [];
        for(let x=0; x<height; x++){
            this.rows.push({columns: []});
            for(let z=0; z<width; z++){
                let space = {terrain:"Empty", unit:"Empty"}
                this.rows[x].columns.push(space);
            }
        }
    }

    addUnit(name,row,column){
            this.rows[row].columns[column].unit = name;
    }

    toConsole = async function(){
        let grid = {}
        for(const x of this.rows.keys()){
            let row = [];
            for(let y=0; y<this.rows[x].columns.length; y++){
                let unit = false;
                let quadrant = "";
                if(this.rows[x].columns[y].unit!="Empty"){
                    unit = this.rows[x].columns[y].unit
                }
                if(unit)
                row.push("[" + unit + "]");
                else
                row.push("[ ]");
            }
            grid[x] = row;
        }
        console.table(grid);
    }
}

class Battle{
    constructor(name,combatants,grid=false){
        this.name = name;
        this.grid = grid;
        this.combatants = combatants;
        for(let x=0; x<combatants.length; x++){
            this.combatants[x].dice = new Dice();
            this.combatants[x].trueMaxStamina = this.combatants[x].maxStamina;
        }
        this.roundCount = 1;
        this.phase = "Initiation Phase";
        this.updateString = `${combatants[0].name} vs. ${combatants[1].name}`;
        this.updateBattle();
        console.log("New Battle Created!")
        console.log("Combatants:")
        for(let x=0; x<combatants.length; x++){
            console.log(this.combatants[x].name)
        }
        console.log("");
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
    calculateAdvantage(combatant,type){
        for(let x=0; x<combatant.fightingStyles.length; x++){
            this.applyAdvantageFor(combatant.fightingStyles[x],combatant,type);
        }
    }
    applyAdvantageFor(fightingStyle,combatant,type){
        for(let x=0; x<combatant.inCombatWith.length; x++){
            if(fightingStyle=="Punisher"){
                for(let y=0; y<this.combatants.length; y++){
                    if(this.combatants[y].name==combatant.inCombatWith[x]){
                        if(this.combatants[y].fightingStyles.includes("Reversal")){
                            combatant.tempModifiers.push({name:"Punisher Advantage",value:5})
                        }
                    }
                }
            }
            if(fightingStyle=="Reversal"){
                for(let y=0; y<this.combatants.length; y++){
                    if(this.combatants[y].name==combatant.inCombatWith[x]){
                        if(this.combatants[y].fightingStyles.includes("Berserk-Attack")||this.combatants[y].fightingStyles.includes("Berserk-Defend")){
                            if(type=="Attack"){

                            }
                            if(type=="Defend"){
                                combatant.tempModifiers.push({name:"Reversal Advantage",value:10})
                            }
                        }
                    }
                }
            }
            if((fightingStyle=="Berserk-Attack")||(fightingStyle=="Berserk-Defend")){
                for(let y=0; y<this.combatants.length; y++){
                    if(this.combatants[y].name==combatant.inCombatWith[x]){
                        if(this.combatants[y].fightingStyles.includes("Barrage")){
                            if(type=="Attack"&&fightingStyle=="Berserk-Attack"){
                                combatant.tempModifiers.push({name:"Berserk Advantage",value:10})
                            }
                            if(type=="Defend"&&fightingStyle=="Berserk-Defend"){
                                combatant.tempModifiers.push({name:"Berserk Advantage",value:10})
                            }
                        }
                    }
                }
            }
            if(fightingStyle=="Barrage"){
                for(let y=0; y<this.combatants.length; y++){
                    if(this.combatants[y].name==combatant.inCombatWith[x]){
                        if(this.combatants[y].fightingStyles.includes("Punisher")){
                            if(type=="Attack"){
                                combatant.tempModifiers.push({name:"Barrage Advantage",value:10})
                            }
                            if(type=="Defend"){

                            }
                        }
                    }
                }
            }
        }
    }
    rollFor(combatant){
        if(combatant.berserkMod){
            combatant.tempModifiers.push({name:"Berserking!",value:combatant.berserkMod})
        }
        if(combatant.barrageMod){
            combatant.tempModifiers.push({name:"Barraged!",value:combatant.barrageMod})
        }
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
        if(combatant.berserkMod){
            combatant.tempModifiers.push({name:"Berserking!",value:combatant.berserkMod})
        }
        if(combatant.barrageMod){
            combatant.tempModifiers.push({name:"Barraged!",value:combatant.barrageMod})
        }
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
                woundedModifier = 50;
                if(Math.round((totalModifier/5)*4)>woundedModifier){
                    woundedModifier = Math.round((totalModifier/5)*4);
                }
            }
            combatant.dice.addModifier({name:combatant.woundedType,value:woundedModifier*-1})
        }
        let roll = combatant.dice.customRollFull(customRollList);
        combatant.initiativeScore += (combatant.dice.latestCritCount * 10) + (combatant.dice.latestCritFailCount * -10);
        if(combatant.dice.latestCritFailCount>0){
            for(let x=0; x<combatant.inCombatWith.length; x++){
                for(let y=0; y<this.combatants.length; y++){
                    if(this.combatants[y].name==combatant.inCombatWith[x]){
                        this.punishmentCheck(combatant,this.combatants[y]);
                    }
                }
            }
        }
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
    updateBattle(){
        let updateEvent = new CustomEvent(`${this.name}-update`,{detail: this})
        window.dispatchEvent(updateEvent);
    }
    //Initative Methods
    rollFlatInitiativeAll(){
        this.startInitiativePhase();
        console.log("Auto-Rolling Initiative...")
        for(let x=0; x<this.combatants.length; x++){
            this.rollInitiative(x)
        }
        this.calculateOrder();
    }
    startInitiativePhase(){
        this.phase = "Initiative Phase";
        console.log("Initiative Phase:");
        this.updateString = "<span class='sectionTitle'>Initiative Phase</span>";
        this.updateBattle();
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
        this.updateString  = "<span class='subSection'>" + this.combatants[x].name + "'s Roll:</span>";
        let roll = this.combatants[x].dice.roll();
        this.combatants[x].initiativeScore = this.combatants[x].dice.latestResult;
        console.log(this.combatants[x].dice.latestRollString);
        this.updateString += "<span class='diceRoll'>" + this.combatants[x].dice.latestRollString + "</span>";
        this.updateBattle();
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
        this.updateString = "<span class='subSection'>" + this.combatants[x].name + "'s Roll:</span>";
        this.updateString += "<span class='diceRoll'>" + this.combatants[x].dice.latestRollString + "</span>";
        this.updateBattle();
    }
    //Phase Transition Method
    calculateOrder(){
        let initiativeScores = [];
        for(let x=0; x<this.combatants.length; x++){
            initiativeScores.push(this.combatants[x].initiativeScore);
        }
        quickSort(initiativeScores,0,initiativeScores.length-1,this.combatants);
        this.phase = "Action Declaration Phase";
        this.updateString = "<span class='sectionTitle'>Action Declaration Phase:</span>"
        this.updateBattle();
        console.log("");
        console.log("Stats:")
        for(let x=0; x<this.combatants.length; x++){
            this.updateString = "<strong>" + this.combatants[x].name + "</strong>";
            console.log(this.combatants[x].name)
            if(this.combatants[x].woundedType){
                this.updateString += "Health: " + this.combatants[x].health + "/" + this.combatants[x].maxHealth + " (" + this.combatants[x].woundedType + ")"
                console.log("Health: " + this.combatants[x].health + "/" + this.combatants[x].maxHealth + " (" + this.combatants[x].woundedType + ")")
            }else{
                this.updateString += "Health: " + this.combatants[x].health + "/" + this.combatants[x].maxHealth;
                console.log("Health: " + this.combatants[x].health + "/" + this.combatants[x].maxHealth)
            }
            if(this.combatants[x].exhaustionType){
                this.updateString += "<br>" + "Stamina: " + this.combatants[x].stamina + "/" + this.combatants[x].maxStamina + " (" + this.combatants[x].exhaustionType + ")"
                console.log("Stamina: " + this.combatants[x].stamina + "/" + this.combatants[x].maxStamina + " (" + this.combatants[x].exhaustionType + ")")
            }else{
                this.updateString += "<br>" + "Stamina: " + this.combatants[x].stamina + "/" + this.combatants[x].maxStamina
                console.log("Stamina: " + this.combatants[x].stamina + "/" + this.combatants[x].maxStamina)
            }
            console.log("Initiative: " + this.combatants[x].initiativeScore)
            this.updateString += "<br>" + "Initiative: " + this.combatants[x].initiativeScore;
            let fightingStyleString = "";
            if(this.combatants[x].punishmentPool){
                console.log("Punishment Pools:")
                fightingStyleString += "<br><span class='fightingStyleMods'>Punishment Pools:</span>"
                for (const combatant in this.combatants[x].punishmentPool) {
                    fightingStyleString += "<br>   " + combatant + ": " + this.combatants[x].punishmentPool[combatant]
                    console.log("   " + combatant + ": " + this.combatants[x].punishmentPool[combatant]);
                }
            }
            if(this.combatants[x].reversalPool){
                fightingStyleString += "Reversal Pool: " + this.combatants[x].reversalPool;
                console.log("Reversal Pool: " + this.combatants[x].reversalPool);
            }
            if(this.combatants[x].berserkMod){
                fightingStyleString += "Berserk Modifier: " + this.combatants[x].berserkMod;
                console.log("Berserk Modifier: " + this.combatants[x].berserkMod)
            }
            if(this.combatants[x].barrageMod){
                fightingStyleString += "Barrage Modifier: " + this.combatants[x].barrageMod;
                console.log("Barrage Modifier: " + this.combatants[x].barrageMod)
            }
            console.log("")
            if(fightingStyleString!=""){
                this.updateString += "<br>Fighting Style Modifiers:" + fightingStyleString;
            }
            this.updateString += fightingStyleString;
            this.updateBattle();
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
            this.updateString = "";
            for(let x=0; x<this.combatants.length; x++){
                if(x>0){
                    this.updateString += "<br>"
                }
                console.log(this.combatants[x].name + " " + this.combatants[x].action.name + "s!")
                this.updateString += this.combatants[x].name + " " + this.combatants[x].action.name + "s!"
                //could probably add a for loop that details every target in case of multiple targets for above console.log
            }
            console.log("");
            console.log("Action Calculation Phase:")
            this.updateBattle();
            this.updateString = "<span class='sectionTitle'>Action Calculation Phase:</span>"
            this.updateBattle();
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
                this.updateString = "<strong>" + this.combatants[x].name + " " + this.combatants[x].action.name + "s!</strong>";
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
        this.updateString = "<strong>" + defender.name + " Defends!</strong>";
        defender.dice.clear();
        for(let x=0; x<attackers.length; x++){
            //calculate fightingStyle stuff
        }
        for(let x=0; x<defender.defenseModifiers.length; x++){
            defender.dice.addModifier(defender.defenseModifiers[x]);
        }
        let defenseRoll;
        this.calculateAdvantage(defender,"Defend")
        if(!attackers[0].action.customDefenseList){
            defenseRoll = this.rollFor(defender) 
        }else{
            defenseRoll = this.customRollFor(defender,attackers[0].action.customDefenseList) ;
        }
        this.updateString += defender.dice.latestRollString;
        defender.defensePoints = Math.round(defenseRoll/10);
        this.update(defender);
        this.updateBattle();
        this.updateString = "<span class='sectionTitle'>" + defender.name + " Defense Sub-Phase:</span>";
        console.log(defender.name + " Defense Sub-Phase:")
        this.updateBattle();
        this.updateString = "Defense Points: " + defender.defensePoints;
        this.updateString += "<br>Incoming Damage:"
        console.log("Defense Points: " + defender.defensePoints);
        console.log("Incoming Damage:")
        for(let x=0; x<defender.unresolvedAttacks.length; x++){
            this.updateString += "<br>&nbsp;&nbsp;&nbsp;" + defender.unresolvedAttacks[x].name + ": " + defender.unresolvedAttacks[x].value;
            console.log(defender.unresolvedAttacks[x].name + ": " + defender.unresolvedAttacks[x].value);
        }
        //Defend Another is not accounted for
        this.updateString +="<br>"
        this.updateBattle();
    }
    defend(defenderName,attackerName,points){ 
        this.updateString = defenderName + " Defends Against " + attackerName + "!";
        console.log(defenderName + " Defends Against " + attackerName + "!")
        for(let x=0; x<this.combatants.length; x++){
            if(this.combatants[x].name==defenderName){
                for(let y=0; y<this.combatants[x].unresolvedAttacks.length;y++){
                    if(this.combatants[x].unresolvedAttacks[y].name==attackerName){
                        if(this.combatants[x].staminaWeightMod){
                            this.combatants[x].stamina = this.combatants[x].stamina - this.combatants[x].staminaWeightMod;
                            this.calculateExhaustion(this.combatants[x])
                        }
                        this.updateString += "<br>Defends " + points + " out of " +this.combatants[x].unresolvedAttacks[y].value + " Points of Damage!";
                        console.log("Defends " + points + " out of " +this.combatants[x].unresolvedAttacks[y].value + " Points of Damage!")
                        this.combatants[x].unresolvedAttacks[y].value = this.combatants[x].unresolvedAttacks[y].value - points;
                        this.combatants[x].unresolvedAttacks[y].defended = true;
                        if(this.combatants[x].unresolvedAttacks[y].value<1){
                            this.reversalCheck(this.combatants[x])
                            for(let z=0; z<this.combatants.length; z++){
                                if(this.combatants[z].name==attackerName){
                                    for(let a=0; a<this.combatants[z].inCombatWith.length; a++){
                                        for(let b=0; b<this.combatants.length; b++){
                                            if(this.combatants[z].inCombatWith[a]==this.combatants[b].name){
                                               this.punishmentCheck(this.combatants[z],this.combatants[b]);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        
                        this.combatants[x].defensePoints = this.combatants[x].defensePoints - points;
                        this.updateString += "Remaining Attack Points: " + this.combatants[x].unresolvedAttacks[y].value;
                        this.updateString += "<br>Remaining Defense Points: " + this.combatants[x].defensePoints;
                        console.log("Remaining Attack Points: " + this.combatants[x].unresolvedAttacks[y].value)
                        console.log("Remaining Defense Points: " + this.combatants[x].defensePoints);
                        this.updateBattle();
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
                        this.updateString = defenderName + " Uses Parry!";
                        console.log(defenderName + " Uses Parry!")
                        bonus = bonus*10;
                    }
                    if(this.combatants[x].parry==2){
                        this.updateString = defenderName + " Uses Enhanced Parry!";
                        console.log(defenderName + " Uses Enhanced Parry!")
                        bonus = bonus*15;
                    }
                }else{
                    this.updateString = defenderName + " Uses Overwhelming Defense!";
                    console.log(defenderName + " Uses Overwhelming Defense!")
                    bonus = bonus*5;
                }
                this.combatants[x].defensePoints = this.combatants[x].defensePoints - points;
                let attackers = [];
                for(let y=0; y<this.combatants[x].unresolvedAttacks.length; y++){
                    attackers.push(this.combatants[x].unresolvedAttacks[y].name);
                }
                this.combatants[x].parryModifier = {attackers: attackers,value: bonus};
                this.updateString += "<br>" + defenderName + " Gains a +" + this.combatants[x].parryModifier.value + " Bonus!";
                console.log(defenderName + " Gains a +" + this.combatants[x].parryModifier.value + " Bonus!")
                this.updateBattle();
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
                        this.combatants[x].action = {name: "Attack",targets: [this.combatants[y].name],customAttackList: customAttackList,customDefenseList: customDefenseList,type:"melee"}
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
                    if(!this.combatants[x].unresolvedAttacks[y].defended){
                        for(let z=0; z<this.combatants.length; z++){
                            if(this.combatants[z].name == this.combatants[x].unresolvedAttacks[y].name){
                                this.punishmentCheck(this.combatants[x],this.combatants[z]);
                            }
                        }
                    }
                    let finalDamage = this.calculateAttackerDamage(this.combatants[x].unresolvedAttacks[y],this.combatants[x]);
                    console.log(finalDamage + " Damage from " + this.combatants[x].unresolvedAttacks[y].name + "!");
                    if(finalDamage>0){
                        for(let z=0; z<this.combatants.length; z++){
                            if(this.combatants[z].name == this.combatants[x].unresolvedAttacks[y].name){
                                this.punishmentCheck(this.combatants[x],this.combatants[z]);
                                this.berserkAttackSuccess(this.combatants[z]);
                                this.barrageSuccess(this.combatants[x],this.combatants[z])
                            }
                        }
                    }else{
                        for(let z=0; z<this.combatants.length; z++){
                            if(this.combatants[z].name == this.combatants[x].unresolvedAttacks[y].name){
                                this.berserkAttackFailure(this.combatants[z])
                                this.barrageFailure(this.combatants[x],this.combatants[z])
                            }
                        }
                    }
                    totalDamage += finalDamage;
                    this.combatants[x].unresolvedAttacks.splice(y,1)
                    y--;
                }
                console.log("Total Damage Taken: " + totalDamage);
                if(totalDamage==0){
                    this.berserkDefendSuccess(this.combatants[x])
                }else{
                    this.combatants[x].health = this.combatants[x].health - totalDamage;
                    this.combatants[x].initiativeScore = this.combatants[x].initiativeScore - totalDamage*10;
                    console.log("Remaining Health: " + this.combatants[x].health + "/" + this.combatants[x].maxHealth);
                    this.berserkDefendFailure(this.combatants[x]);
                }
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
        this.updateBattle();
    }
    reversalCheck(combatant){
        if(combatant.fightingStyles.includes("Reversal")){
            if(!combatant.reversalPool){
                combatant.reversalPool = 0;
            }
            if((combatant.fightingStyles[0]=="Reversal")&&(combatant.fightingStyles[1]=="Reversal")){
                this.updateSring += "<br><span class='fightingStyleUpdate'>+2 to the Reversal Pool!</span>"
                console.log("+2 to the Reversal Pool!")
                combatant.reversalPool += 2;
            }else{
                this.updateString += "<br><span class='fightingStyleUpdate'>+1 to the Reversal Pool!</span>"
                console.log("+1 to the Reversal Pool!")
                combatant.reversalPool += 1;
            }
            this.updateString += "<span class='fightingStyleUpdate'>Reversal Pool Total: " + combatant.reversalPool + "</span>";
            console.log("Reversal Pool Total: " + combatant.reversalPool)
        }
    }
    punishmentCheck(punished,punisher){
        if(punisher.fightingStyles.includes("Punisher")){
            if(!punished.punishmentPool){
                punished.punishmentPool = {};
            }
            if(!punished.punishmentPool[punisher.name]){
                punished.punishmentPool[punisher.name] = 0;
            }
            if((punisher.fightingStyles[0]=="Punisher")&&(punisher.fightingStyles[1]=="Punisher")){
                console.log("+2 to the Punishment Pool!")
                punished.punishmentPool[punisher.name] += 2;
            }else{
                console.log("+1 to the Punishment Pool!")
                punished.punishmentPool[punisher.name] += 1;
            }
            console.log("Punishment Pool Total: " + punished.punishmentPool[punisher.name])
        }
    }
    berserkAttackSuccess(combatant){
        if(combatant.fightingStyles.includes("Berserk-Attack")){
            if(!combatant.berserkMod){
                combatant.berserkMod = 1;
            }else{
                if((combatant.fightingStyles[0]=="Berserk-Attack")&&(combatant.fightingStyles[1]=="Berserk-Attack")){
                    console.log("Berserk Mod Multiplied By 4!")
                    combatant.berserkMod= berserkMod*4;
                }else{
                    console.log("Berserk Mod Multiplied By 2!")
                    combatant.berserkMod= berserkMod*2;
                }
            }
            console.log("Berserk Modifier Total: " + combatant.berserkMod)
        }
    }
    berserkDefendSuccess(combatant){
        if(combatant.fightingStyles.includes("Berserk-Defend")){
            if(!combatant.berserkMod){
                combatant.berserkMod = 1;
            }else{
                if((combatant.fightingStyles[0]=="Berserk-Defend")&&(combatant.fightingStyles[1]=="Berserk-Defend")){
                    console.log("Berserk Mod Multiplied By 4!")
                    combatant.berserkMod= berserkMod*4;
                }else{
                    console.log("Berserk Mod Multiplied By 2!")
                    combatant.berserkMod= berserkMod*2;
                }
            }
            console.log("Berserk Modifier Total: " + combatant.berserkMod)
        }
    }
    berserkAttackFailure(combatant){
        if(combatant.fightingStyles.includes("Berserk-Attack")){
            combatant.berserkMod = 0;
            console.log("Berserk Modifier Total: " + combatant.berserkMod)
        }
    }
    berserkDefendFailure(combatant){
        if(combatant.fightingStyles.includes("Berserk-Defend")){
            combatant.berserkMod = 0;
            console.log("Berserk Modifier Total: " + combatant.berserkMod)
        }
    }
    barrageSuccess(target,attacker){
        if(attacker.fightingStyles.includes("Barrage")){
            if(!target.barrageMod){
                target.barrageMod = -1;
            }else{
                if((attacker.fightingStyles[0]=="Barrage")&&(attacker.fightingStyles[1]=="Barrage")){
                    console.log("Barrage Mod Multiplied By 4!")
                    target.barrageMod= barrageMod*4;
                }else{
                    console.log("Barrage Mod Multiplied By 2!")
                    target.barrageMod= barrageMod*2;
                }
            }
            console.log("Barrage Modifier Total: " + target.barrageMod);
        }
    }
    barrageFailure(target,attacker){
        if(attacker.fightingStyles.includes("Barrage")){
            target.barrageMod = 0;
            console.log("Barrage Modifier Total: " + target.barrageMod);
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
    calculateAttackerDamage(attack, defender){
        //makes sure value is not negative
        if(attack.value<1){
            return 0;
        }
        let durabilityDamage = 0;
        if(defender.armor){
            if(attack.value < defender.armor[attack.type]){
                durabilityDamage += attack.value;
            }else{
                durabilityDamage += defender.armor[attack.type];
            }
            attack.value = attack.value - defender.armor[attack.type];
            if(attack.armorPenetration){
                attack.value += attack.armorPenetration;
                durabilityDamage += attack.armorPenetration;
                console.log("Bonus Damage from AP: " + attack.armorPenetration)
            }
            if(attack.directDamage){
                attack.value += Math.floor(attack.directDamage/2);
                durabilityDamage += attack.directDamage;
                console.log("Bonus Damage from DD: " + Math.floor(attack.directDamage/2))
            }
            console.log(durabilityDamage + " Damage to Armor!")
            defender.armor.durability = defender.armor.durability - durabilityDamage;
            console.log("Armor Durability: " + defender.armor.durability + "/" + defender.armor.maxDurability)
        }else{
            if(attack.armorPenetration){
                attack.value += Math.floor(attack.armorPenetration/2);
                console.log("Bonus Damage from AP: " + Math.floor(attack.armorPenetration/2))
            }
            if(attack.directDamage){
                attack.value += attack.directDamage;
                console.log("Bonus Damage from DD: " + Math.floor(attack.directDamage))
            }
        }
        //Need to check for abilities that deal more damage or whatever
        if(attack.value<0){
            attack.value = 0;
        }
        console.log("Total Damage: " + attack.value)
        return attack.value;
    }
    calculateAttack(attacker, defender){
        this.updateString = "<strong>" + attacker.name + " Attacks " + defender.name + "!</strong>";
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
        this.calculateAdvantage(attacker,"Attack")
        if(!attacker.action.customAttackList){
            attackRoll = this.rollFor(attacker) 
        }else{
            attackRoll = this.customRollFor(attacker,attacker.action.customAttackList) ;
        }
        this.updateString += attacker.dice.latestRollString;
        let attackPoints = Math.round(attackRoll/10)
        let attack = {name: attacker.name,value: attackPoints,type:attacker.action.type}
        if(attacker.armorPenetration){
            attack.armorPenetration = attacker.armorPenetration;
        }
        if(attacker.directDamage){
            attack.directDamage = attacker.directDamage;
        }
        if(!defender.unresolvedAttacks){
            defender.unresolvedAttacks = [];
        }
        defender.unresolvedAttacks.push(attack);
        console.log("Attack Points: " + attack.value)
        this.updateString += "<span>Attack Points: " + attack.value + "</span>";
        this.updateBattle();
        return defender;
    }
    //End Action Phase, Start New Round!
    confirmAllActionsCalculated(){
        console.log("");
        this.roundCount++;
        console.log("Round " + this.roundCount);
        this.calculateOrder();
    }
    applyReversalPool(attackerName){
        for(let x=0; x<this.combatants.length; x++){
            if(this.combatants[x].name == attackerName){
                this.combatants[x].tempModifiers.push({name: "Reversal!", value: this.combatants[x].reversalPool})
                this.combatants[x].reversalPool = 0;
            }
        }
    }
    applyPunishmentPool(attackerName,defenderName){
        for(let x=0; x<this.combatants.length; x++){
            if(this.combatants[x].name == attackerName){
                for(let y=0; y<this.combatants.length; y++){
                    if(this.combatants[y].name == defenderName){
                        this.combatants[x].tempModifiers.push({name: "Punishment!", value: this.combatants[y].punishmentPool[attackerName]})
                        this.combatants[y].punishmentPool[attackerName] = 0;
                    }
                }
            }
        }
    }
    convertIntoReversal(combatantName,defensePoints){
        console.log(combatantName + " sets up a Reversal!")
        for(let x=0; x<this.combatants.length; x++){
            if(this.combatants[x].name == combatantName){
                this.combatants[x].reversalPool += defensePoints/5;
                if((this.combatants[x].fightingStyles[0]=="Reversal")&&(this.combatants[x].fightingStyles[1]=="Reversal")){
                    this.combatants[x].reversalPool += defensePoints/5;
                }
                this.combatants[x].defensePoints += -defensePoints;
                console.log("Reversal Pool Total: " + this.combatants[x].reversalPool)
                console.log("Remaining Defense Points: " + this.combatants[x].defensePoints);
            }
        }
    }
}

