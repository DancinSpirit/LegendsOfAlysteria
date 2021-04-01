const load = function(newState){
    reset();
    if(newState === "character" ){
        character();
        newState = "characterBasic";
    }
    if(newState === "characterBasic"){
        characterBasic();
    }
    if(newState === "characterCombat"){
        characterCombat();
    }
    state = newState;
}

load(state);
