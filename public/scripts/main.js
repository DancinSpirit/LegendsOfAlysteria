let superState = null;
let superStateChange = false;

const load = async function(newState){
    console.log(newState);
    /* SuperState Checks */ 
    if(!newState.includes("haracter")||newState ==="characters"){   
        console.log("superstate" + superState)
        if(superState ==="character" || superState ==="editCharacter")
            superStateChange = true;
    }
    await reset();
    if(newState === "character" ){
        superState = "character"
        await character();
        newState = "characterBasic";
    }
        if(newState === "characterBasic"){
            characterBasic();
        }
        if(newState === "characterCombat"){
            characterCombat();
        }
    if(newState === "editCharacter"){
        superState = "editCharacter"
        await editCharacter();
        newState = "editCharacterBasic";
    }
        if(newState === "editCharacterBasic"){
            editCharacterBasic();
        }
    if(newState === "login"){
        login();
    }
    if(newState === "register"){
        register();
    }
    if(newState === "gamemasterHub"){
        gamemasterHub();
    }
    if(newState === "characters"){
        characters();
    }
    state = newState;
}

/*State Management*/
load(state);
window.addEventListener('popstate', (event) => {
    load(event.state);
})


/* BUTTONS! */
$("#login-button").on("click", function(){
    load("login");
})
$("#register-button").on("click", function(){
    load("register");
})
$("#characters-button").on("click", function(){
    load("characters");
})

/* RESIZE ANIMATION STOPPER */
let resizeTimer;
window.addEventListener("resize", () => {
  document.body.classList.add("resize-animation-stopper");
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    document.body.classList.remove("resize-animation-stopper");
  }, 400);
});