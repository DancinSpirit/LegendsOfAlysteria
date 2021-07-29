let years; //set up for story variable
let text;
let eventId;

/* Auth Check */
if(!user){
    if(states != ["main", "register"]){
        states = ["main","login"];
        window.history.pushState({states:states,data:data}, "Login Page", "/main/login");
    }
}

loadStates();

window.addEventListener('popstate',(event)=>{
    console.log(event.state);
    states = event.state.states;
    data = event.state.data;
    console.log(states)
    console.log(event.state)
    loadStates();
})

/* Should probably add a First Time Loading function that triggers automatically/when pop state triggers that disables animations or something */