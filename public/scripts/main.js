const load = async function(newState){
    console.log(newState);
    await reset();
    if(newState === "character" ){
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

load(state);


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