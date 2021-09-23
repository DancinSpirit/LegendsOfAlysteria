let years; //set up for story variable
let text;
let eventId;
let activeBox = null;
let activeUnit = false;
let gridbox;
let rounds;
let players;
let gridBoxes;
let characterColors;

let settings = false;
let images = false;

var isMobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
    isMobile = true;
}

if(isMobile){
    states = ["mobile"];
    window.history.pushState({states:states,data:data}, "Mobile", "/mobile");
    loadStates();
}

window.history.replaceState({states:states,data:data}, "Starting Page", window.location.href);

/* Auth Check */
const authCheck = function(){
    if(!user){
        if(states[1] != "register" && states[1] != "login"){
            console.log("HM?")
            window.location.replace("/main/login");
        }
        user = {settings: {pageSpeed: 1000}}
    }
}

authCheck();

const playerCheck = function(){
    if(player){
        if(states[1] != "character-home" && states[1] != "chapter-select" && states[1] != "characters" && states[1] != "character"  && states[1] != "settings" && player.background != "eventPlayer"){
            playerLogout();
        }
    }else{
        if(states[1] == "character-home" || states[1] == "chapter-select" || states[1] == "characters" || states[1] == "character"){
            states = ["main","character-select"];
            window.history.pushState({states:states,data:data}, "Character Select Page", "/main/character-select");
            
            loadState(1);
        }
    }
}

playerCheck();

$("html").on("click", function(){
    authCheck();
    playerCheck();
})

loadStates();

window.addEventListener('popstate',async function(event){
    $("#settings").css("visibility","hidden");
    $("#settings-button").css("visibility","hidden");
    deactivateButtons();
    let load = false;
    for(let x=0; x<event.state.states.length; x++){
        authCheck();
        playerCheck();
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

/* Quick Sort functions */
function partition(array, start, end, array2){
    const pivot = array[end];
    let pivotIndex = start;
    for(let x=start; x<end; x++){
        if(array[x]>pivot){
            [array[x],array[pivotIndex]] = [array[pivotIndex], array[x]];
            [array2[x],array2[pivotIndex]] = [array2[pivotIndex], array2[x]];
            pivotIndex++;
        }
    }
    [array[pivotIndex], array[end]] = [array[end], array[pivotIndex]];
    [array2[pivotIndex], array2[end]] = [array2[end], array2[pivotIndex]];
    return pivotIndex;
}
function quickSort(array, start, end, array2){
    if(start>=end){
        return;
    }
    if(array2){
        let index = partition(array, start, end, array2);
        quickSort(array, start, index-1, array2);
        quickSort(array, index+1, end, array2);
    }else{
        let index = partition(array, start, end);
        quickSort(array, start, index-1);
        quickSort(array, index+1, end); 
    }

}
/* Should probably add a First Time Loading function that triggers automatically/when pop state triggers that disables animations or something */