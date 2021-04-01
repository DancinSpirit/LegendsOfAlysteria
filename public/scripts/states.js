const reset = function(){
    if(state === "characterBasic"){
        $("#basic-character-sheet-button").addClass("character-nav-button-unselected");
    }
    if(state === "characterCombat"){
        $("#combat-character-sheet-button").addClass("character-nav-button-unselected");
    }
}

const characterBasic = function(){
    $.ajax({
        method: "GET",
        url: `${window.location.href}/component/basic-sheet`,
        success: function(res){
            $("#character-sheet").html(res);
        }
    })
    $("#basic-character-sheet-button").removeClass("character-nav-button-unselected");
}

const character = function(){
    $.ajax({
        method: "GET",
        url: `${window.location.href}/component`,
        success: function(res){
            $("#character-page").html(res);
            $("#basic-character-sheet-button").on("click", ()=>{
                load("characterBasic");
            })
            $("#combat-character-sheet-button").on("click", ()=>{
                load("characterCombat");
            })
        }
    })
}

const characterCombat = function(){
    $.ajax({
        method: "GET",
        url: `${window.location.href}/component/combat-sheet`,
         success: function(res){
            $("#character-sheet").html(res);
        }
    })
    $("#combat-character-sheet-button").removeClass("character-nav-button-unselected");
}

