class Modifier{
    constructor(name, value){
        this.name=name;
        this.value=value;
    }
}

class Dice{
    constructor(){
        this.critFails = 0;
        this.trueCritFails = 0;
        this.critSuccesses = 0;
        this.trueCritSuccesses = 0;
        this.modList = [];
        this.critModList = [];      
        this.nextLine = "";
    }

    addModifier(modifier){
        if(modifier)
        this.modList.push(new Modifier(modifier.name,modifier.value))
    }

    returnMods(){
        let modString = "";
        let modNum = 0;
        if(this.modList.length){
            for(let x=0; x<this.modList.length; x++){
                modNum = modNum + this.modList[x].value;
                if(this.modList[x].value>-1){
                    modString += " + " + this.modList[x].value + " (" + this.modList[x].name + ")";
                }else{
                    modString += " - " + this.modList[x].value*-1 + " (" + this.modList[x].name + ")";
                }
            }
        }
        if(this.critModList.length){
            for(let x=0; x<this.critModList.length; x++){
                modNum = modNum + this.critModList[x].value;
                if(this.critModList[x].value>-1){
                    modString += " + " + this.critModList[x].value;
                }else{
                    modString += " - " + this.critModList[x].value*-1;
                }
                if(this.critModList[x].name != "None"){
                    modString += " (" + this.critModList[x].name + ")";
                }
            }
            this.critModList = [];
        }
        this.nextLine += modString;
        return modNum;
    }

    natRoll(){
        return Math.floor(Math.random()*100) + 1;
    }

    reroll(){
        this.naturalRoll = this.natRoll();
        return this.rollCalc();
    }

    printLine(){
        console.log(this.nextLine);
        this.nextLine = "";
    }

    rollCalc(){
        while(this.naturalRoll==100||this.naturalRoll==1){
            this.trueCritCheck(this.naturalRoll);
        }
        this.nextLine += this.naturalRoll;
        let total = this.naturalRoll;
        if(this.modList.length||this.critModList.length){
            total = this.naturalRoll + this.returnMods();
            this.nextLine += " = " + total;
        }
        this.printLine();
        if(total>99){
            this.critSuccesses++;
            this.modList = [];
            if(!((total-100)==0)){
                this.critModList.unshift(new Modifier("None",(total-100)));
            }
            this.nextLine = "Crit Success " + this.critSuccesses + ": ";
            total = this.reroll();
        }
        if(total<1){
            this.critFails++;
            this.modList = [];
            if(!(total==0)){
                this.critModList.unshift(new Modifier("None",total));
            }
            this.nextLine = "Crit Fail " + this.critFails + ": ";
            total = this.reroll();
        }
        return total;
    }

    trueCritCheck(){
        if(this.naturalRoll==1){
            this.critFails++;
            this.trueCritFails++;
            this.critModList.unshift(new Modifier("True Crit Fail",-50));
            this.nextLine += "1";
            this.printLine();
            this.nextLine = "Crit Fail " + this.critFails + ": ";
            this.naturalRoll = this.natRoll();
        }
        if(this.naturalRoll==100){
            this.critSuccesses++;
            this.trueCritSuccesses++;
            this.critModList.unshift(new Modifier("True Crit Success",50));
            this.nextLine += "100";
            this.printLine();
            this.nextLine = "Crit Success " + this.critSuccesses + ": ";
            this.naturalRoll = this.natRoll();
        }
    }

    critCalc(roll){
        let result = roll + (this.trueCritSuccesses*100) + (this.critSuccesses*100) + (this.critFails*-100) + (this.trueCritFails*-100);
        this.nextLine = ("Total: " + (roll+(this.critSuccesses*100)+(this.critFails*-100)));
        if(this.trueCritSuccesses>0){
            this.nextLine += (" + " + (this.trueCritSuccesses*100) + " (True Crit Success)");
        }
        if(this.trueCritFails>0){
            this.nextLine += (" - " + (this.trueCritFails*100) + " (True Crit Fail)");
        }
        if(this.trueCritFails>0||this.trueCritSuccesses>0){
            this.nextLine += (" = " + result);
        }
        this.printLine();
        return result;
    }

    roll(){
        this.naturalRoll = this.natRoll();
        let roll = this.rollCalc();
        let finalResult = this.critCalc(roll);
        this.reset();
        return finalResult;
    }

    reset(){
        this.naturalRoll = 0;
        this.critFails = 0;
        this.trueCritFails = 0;
        this.critSuccesses = 0;
        this.trueCritSuccesses = 0;
        this.critModList = [];    
    }

    clear(){
        this.reset();
        this.modList = [];
    }
}

module.exports = new Dice();