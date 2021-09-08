let additionalModifiersCount = 0;
let deletedModifiersCount = 0;
let initiativeRolls = [];
let roundCount = 0;
let battleActions = [];

const loadCombatants = async function(){
    for(let x=0; x<combatants.length; x++){
        await $.ajax({
            method: "GET",
            url: `/data/Combatant/${combatants[x]}`,
            success: (res)=>{
                combatants[x] = res;
            }
        }) 
        combatants[x].dice = new Dice();
        combatants[x].active = false;
    }
}
loadCombatants();

if(!rounds.length){
    $("#start-battle-button").css("display","flex");
    $("#start-battle-button").on("click", async function(){
        $("#start-battle-button").css("display","none");
        await rollInitiative();
        nextRound();
    })
}

const loadBattleText = function(sentText){
    $("#battle-text").append($(`<p class='battle-text-line'>${sentText}</p>`))
}

const requestModifiers = function(){
    return new Promise(async function(resolve){
        $("#battle-text").append($(`<p id="no-modifiers-button" class='battle-text-line clickable'>None</p>`))
        $("#no-modifiers-button").on("click",async function(){
            $("#add-modifier-button").remove();
            $("#additional-modifiers-text").remove();
            $("#no-modifiers-button").remove();
            resolve([]);
        })
        let modifiers = await addAddModifierButton();
        resolve(modifiers)
    })
}

const inputModifier = function(modifierCount){
    $("#battle-text").append($(`<p id="name-modifier${modifierCount}" class='battle-text-line'>Name: <input></input> <i id="delete-modifier${modifierCount}"class="fas fa-times clickable"></i> </p><p id="value-modifier${modifierCount}" class ="battle-text-line">Value: <input type="number"></input></p>`))
    $(`#delete-modifier${modifierCount}`).on("click", async function(){
        deletedModifiersCount++;
        console.log(modifierCount);
        $(`#name-modifier${modifierCount}`).remove();
        $(`#value-modifier${modifierCount}`).remove();
    })
}

const submitButton = function(){
    return new Promise((resolve) =>{
        $("#submit-button").on("click",async function(){
            modifiers = [];
            let totalModifiers = additionalModifiersCount-deletedModifiersCount;
            additionalModifiersCount = 0;
            deletedModifiersCount = 0;
            let num = 0;
            for(let x=0; x<totalModifiers; x++){
                while(!$(`#name-modifier${num}`).length){
                    num=num+1;
                }
                modifiers.push({name: $(`#name-modifier${num}`).children("input").val(), value: parseInt($(`#value-modifier${num}`).children("input").val())})
                $(`#name-modifier${num}`).remove();
                $(`#value-modifier${num}`).remove();
                num=num+1;
            }
            $("#submit-button").remove();
            $("#add-modifier-button").remove();
            $("#additional-modifiers-text").remove();
            console.log(modifiers);
            resolve(modifiers);
        })
    })    
}

const addAddModifierButton = function(){
    return new Promise((resolve) =>{
        $("#battle-text").append($(`<p id="add-modifier-button" class='battle-text-line clickable'>Add New Modifier</p>`))
        $("#add-modifier-button").on("click", async function(){
            additionalModifiersCount++;
            $("#no-modifiers-button").remove();
            $("#add-modifier-button").remove();
            inputModifier(additionalModifiersCount);
            modifiers = addAddModifierButton();
            if($('#submit-button').length){
                $("#battle-text").append($("#submit-button"));
            }else{
                $("#battle-text").append($(`<p id="submit-button" class='battle-text-line clickable'>Submit</p>`))
                modifiers = await submitButton();
            }
            console.log(modifiers);
            resolve(modifiers);
        })
    })
}



const rollInitiative = async function(){
    let roll;
    loadBattleText("Roll Initative!")
    for(let x=0; x<combatants.length; x++){
        loadBattleText("Roll Initiative for " + combatants[x].name + "!")
        $("#battle-text").append($(`<p id="additional-modifiers-text" class='battle-text-line'>Additional Modifiers:</p>`))
        let modifiers = await requestModifiers();
        console.log(modifiers);
        for(let y=0; y<modifiers.length; y++){
            combatants[x].dice.addModifier(modifiers[y]);
        }
        console.log(combatants[x]);
        roll = combatants[x].dice.roll()
        loadBattleText(roll)
        initiativeRolls.push(combatants[x].dice.latestResult)
    }
    quickSort(initiativeRolls,0,initiativeRolls.length-1,combatants);
    loadBattleText("Action Order:")
    for(let x=0; x<combatants.length; x++){
        loadBattleText(combatants[x].name);
    }
}

const moveableSpace = function(space, z, a, type){
    if(!(z<0||a<0||z>height-1||a>width-1)){
        gridBoxes[z][a].moveable = true;
        if(type=="walk")
        space.css("background-color","rgba(255, 255, 255, 0.5)")
        if(type=="run")
        space.css("background-color","rgba(255, 125, 5, 0.5)")
        if(type=="sprint")
        space.css("background-color","rgba(255, 25, 5, 0.5)")
        space.on("contextmenu", async function(event){
            event.preventDefault();
            loadBattleText(`${activeUnit.name} moves to box-${z}-${a}!`)
            $(this).html($(activeBox).html());
            $(activeBox).html(`
                <div id = "background-layer-${z}-${a}">
                    <img class="token" src='/tokens/Empty.jpg'>
                </div>
                <div id = "token-layer-${z}-${a}" class = "token-layer">
                    <img class="token upper-layer" src='/tokens/Empty.jpg'>
                </div>`)
            $(this).off("contextmenu");
            $(activeBox).css("border","solid 1px black");
            activeBox = null;
            for(let x=0; x<gridBoxes.length; x++){
                for(let y=0; y<gridBoxes[x].length; y++){
                    if(gridBoxes[x][y].moveable){
                        gridBoxes[x][y].moveable = false;
                        $(`#gridbox-${x}-${y}`).css("background-color","rgba(255, 255, 255, 0)")
                    }
                }
            } 
        })
    }
}

const activateCombatant = function(combatant){
    combatant.active = true;
    for(let z=0; z<gridBoxes.length; z++){
        for(let a=0; a<gridBoxes[z].length; a++){
            if(gridBoxes[z][a].token == combatant.name){
                $(`#gridbox-${z}-${a}`).css("border","solid white 1px")
                $(`#gridbox-${z}-${a}`).on("click", async function(){
                    $(`#gridbox-${z}-${a}`).css("border","solid gold 1px")
                    $("#unit-info").html(""); 
                    $("#unit-info").css("transition",`${user.settings.pageSpeed}ms`)
                    $("#unit-info").css("transform","translateY(-100%)")
                    let component = await load(`/component/unit-info`,{model: {name:"Combatant",id:gridBoxes[z][a].unit}});
                    $("#unit-info").html(component); 
                    $("#unit-info").css("transform","translateY(0%)")
                    setTimeout(function(){$("#unit-info").css("transition","0ms")},user.settings.pageSpeed)
                    activeBox = $(`#gridbox-${z}-${a}`);
                    activeUnit = combatant;
                    if(!combatant.engaged){
                        for(let x=-12; x<13; x++){
                            if(x==-12||x==12){
                                moveableSpace($(`#gridbox-${z+x}-${a}`), z+x, a, "sprint")
                            }
                            if(x==-11||x==11){
                                for(let y=-2; y<3; y++){
                                    moveableSpace($(`#gridbox-${z+x}-${a+y}`), z+x, a+y, "sprint")
                                }
                            }
                            if(x==-10||x==10){
                                for(let y=-4; y<5; y++){
                                    moveableSpace($(`#gridbox-${z+x}-${a+y}`), z+x, a+y, "sprint")
                                }
                            }
                            if(x==-9||x==9){
                                for(let y=-6; y<7; y++){
                                    moveableSpace($(`#gridbox-${z+x}-${a+y}`), z+x, a+y, "sprint")
                                }
                            }
                            if(x==-8||x==8){
                                for(let y=-8; y<9; y++){
                                    if(y==0){
                                        moveableSpace($(`#gridbox-${z+x}-${a+y}`), z+x, a+y, "run") 
                                    }else{
                                        moveableSpace($(`#gridbox-${z+x}-${a+y}`), z+x, a+y, "sprint")
                                    }
                                }
                            }
                            if(x==-7||x==7){
                                for(let y=-8; y<9; y++){
                                    if(y>-3&&y<3){
                                        moveableSpace($(`#gridbox-${z+x}-${a+y}`), z+x, a+y, "run") 
                                    }else{
                                        moveableSpace($(`#gridbox-${z+x}-${a+y}`), z+x, a+y, "sprint")
                                    }
                                }
                            }
                            if(x==-6||x==6){
                                for(let y=-9; y<10; y++){
                                    if(y>-5&&y<5){
                                        moveableSpace($(`#gridbox-${z+x}-${a+y}`), z+x, a+y, "run") 
                                    }else{
                                        moveableSpace($(`#gridbox-${z+x}-${a+y}`), z+x, a+y, "sprint")
                                    }
                                }
                            }
                            if(x==-5||x==5){
                                for(let y=-9; y<10; y++){
                                    if(y>-6&&y<6){
                                        moveableSpace($(`#gridbox-${z+x}-${a+y}`), z+x, a+y, "run") 
                                    }else{
                                        moveableSpace($(`#gridbox-${z+x}-${a+y}`), z+x, a+y, "sprint")
                                    }
                                }
                            }
                            if(x==-4||x==4){
                                for(let y=-10; y<11; y++){
                                    if(y>-7&&y<7){
                                        if(y==0){
                                            moveableSpace($(`#gridbox-${z+x}-${a}`), z+x, a, "walk");
                                        }else{
                                            moveableSpace($(`#gridbox-${z+x}-${a+y}`), z+x, a+y, "run")
                                        }
                                    }else{
                                        moveableSpace($(`#gridbox-${z+x}-${a+y}`), z+x, a+y, "sprint")
                                    }
                                }
                            }
                            else if(x==-3||x==3){
                                for(let y=-10; y<11; y++){
                                    if(y>-7&&y<7){
                                        if(y>-3&&y<3){
                                            moveableSpace($(`#gridbox-${z+x}-${a+y}`), z+x, a+y, "walk");
                                        }else{
                                            moveableSpace($(`#gridbox-${z+x}-${a+y}`), z+x, a+y, "run")
                                        }
                                    }else{
                                        moveableSpace($(`#gridbox-${z+x}-${a+y}`), z+x, a+y, "sprint")
                                    }
                                }
                            }
                            else if(x==-2||x==2){
                                for(let y=-11; y<12; y++){
                                    if(y>-8&&y<8){
                                        if(y>-4&&y<4){
                                            moveableSpace($(`#gridbox-${z+x}-${a+y}`), z+x, a+y, "walk");
                                        }else{
                                            moveableSpace($(`#gridbox-${z+x}-${a+y}`), z+x, a+y, "run")
                                        }
                                    }else{
                                        moveableSpace($(`#gridbox-${z+x}-${a+y}`), z+x, a+y, "sprint")
                                    }
                                }
                            }
                            else if(x==-1||x==1){
                                for(let y=-11; y<12; y++){
                                    if(y>-8&&y<8){
                                        if(y>-4&&y<4){
                                            moveableSpace($(`#gridbox-${z+x}-${a+y}`), z+x, a+y, "walk");
                                        }else{
                                            moveableSpace($(`#gridbox-${z+x}-${a+y}`), z+x, a+y, "run")
                                        }
                                    }else{
                                        moveableSpace($(`#gridbox-${z+x}-${a+y}`), z+x, a+y, "sprint")
                                    }
                                }
                            }
                            else if(x==0){
                                for(let y=-12; y<13; y++){
                                    if(y>-9&&y<9){
                                        if(y>-5&&y<5){
                                            moveableSpace($(`#gridbox-${z+x}-${a+y}`), z+x, a+y, "walk");
                                        }else{
                                            moveableSpace($(`#gridbox-${z+x}-${a+y}`), z+x, a+y, "run")
                                        }
                                    }else{
                                        moveableSpace($(`#gridbox-${z+x}-${a+y}`), z+x, a+y, "sprint")
                                    }
                                }
                            }
                        }
                    }
                })
            }
        }
    }
}

const deactivateCombatant = function(combatant){
    combatant.active = false;
    for(let z=0; z<gridBoxes.length; z++){
        for(let a=0; a<gridBoxes[z].length; a++){
            if(gridBoxes[z][a].token == combatant.name){
                $(`#gridbox-${z}-${a}`).css("border","solid black 1px")
                $(`#token-layer-${z}-${a}`).off();
            }
        }
    }
}

const deactivateAllCombatants = function(){
    for(let x=0; x<combatants.length; x++){
        deactivateCombatant(combatants[x]);
    }
}

const declareActions = function(playerCombatants){
    return new Promise(async function(resolve){
        for(let x=0; x<playerCombatants.length; x++){
            for(let y=0; y<combatants.length; y++){
                if(playerCombatants[x]==combatants[y].name){
                    activateCombatant(combatants[y]);
                }
            }
        }
        $("#start-battle-button").off("click");
        $("#start-battle-button").text(`Submit Actions`)
        $("#start-battle-button").css("display","flex");
        $("#start-battle-button").on("click",function(){
            deactivateAllCombatants();
            $("#start-battle-button").css("display","none");
            $("#declare-actions").remove();
            resolve();
        })
    })
}

const actionPhase = async function(){
    loadBattleText("Action Phase!");
    for(let x=0; x<players.length; x++){
        $("#battle-text").append($(`<p id="declare-actions" class='battle-text-line clickable'>${players[x].name}: Declare Actions</p>`))
        const declaredActions = await declareActions(players[x].combatants);
    }
}

const nextRound = function(){
    roundCount++;
    loadBattleText(`<strong>Round ${roundCount}</strong>`);
    actionPhase();
}
