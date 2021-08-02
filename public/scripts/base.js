let years; //set up for story variable
let text;
let eventId;

let settings = false;
let images = false;

/* Auth Check */
if(!user){
    if(states != ["main", "register"]){
        states = ["main","login"];
        window.history.pushState({states:states,data:data}, "Login Page", "/main/login");
    }
    user = {settings: {pageSpeed: 1000}}
}

loadStates();

window.addEventListener('popstate',async function(event){
    $("#settings").css("visibility","hidden");
    $("#settings-button").css("visibility","hidden");
    console.log("EGHIEGHEOGHEIGHEIOGHIOGHEIGHEIOGHE")
    deactivateButtons();
    let load = false;
    for(let x=0; x<event.state.states.length; x++){
        if(load){
            await loadState(x);
        }else if(states[x]!=event.state.states[x]||data[x].id!=event.state.data[x].id){
            states = event.state.states;
            data = event.state.data;
            await loadState(x);
            load = true;
        }
    }
    activateButtons();
})

$("html").on("keydown", function (e) {
    if (e.keyCode == 38) {
       konamiCode();
    }
})

let konamiCode = function(){
    $("html").off("keydown")
    $("html").on("keydown", function (e) {
        if (e.keyCode == 38) {
            $("html").off("keydown")
            $("html").on("keydown", function (e) {
                if (e.keyCode == 40) {
                    $("html").off("keydown")
                    $("html").on("keydown", function (e) {
                        if (e.keyCode == 40) {
                            $("html").off("keydown")
                            $("html").on("keydown", function (e) {
                                if (e.keyCode == 37) {
                                    $("html").off("keydown")
                                    $("html").on("keydown", function (e) {
                                        if (e.keyCode == 39) {
                                            $("html").off("keydown")
                                            $("html").on("keydown", function (e) {
                                                if (e.keyCode == 37) {
                                                    $("html").off("keydown")
                                                    $("html").on("keydown", function (e) {
                                                        if (e.keyCode == 39) {
                                                            $("html").off("keydown")
                                                            activateKonami();
                                                            $("html").on("keydown", function(e){
                                                                if(e.keyCode == 38){
                                                                    konamiCode();
                                                                }
                                                            })
                                                        }else{
                                                            konamiCode();
                                                        }
                                                    })
                                                }else{
                                                    konamiCode();
                                                }
                                            })
                                        }else{
                                            konamiCode();
                                        }
                                    })
                                }else{
                                    konamiCode();
                                }
                            })
                        }else{
                            konamiCode();
                        }
                    })
                }else{
                    konamiCode();
                }
            })
        }else{
            $("html").on("keydown", function(e){
                if(e.keyCode == 38){
                    konamiCode();
                }
            })
        }
    })
}

let activateKonami = function(){
    $("body").css("transition","1000ms");
    $("body").css("transform","rotate(360deg)");
    setTimeout(function(){
        $("body").css("transition","0ms");
        $("body").css("transform","unset");
    },1000)
}

/* Should probably add a First Time Loading function that triggers automatically/when pop state triggers that disables animations or something */