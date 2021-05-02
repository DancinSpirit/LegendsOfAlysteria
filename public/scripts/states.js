let previousRequest = null;
const reset = function(){
    return new Promise((resolve) =>{
        if(previousRequest != null)
            previousRequest.abort();
        if(state === "characterBasic"){
            $("#basic-character-sheet-button").addClass("character-nav-button-unselected");
        }
        if(state === "characterCombat"){
            $("#combat-character-sheet-button").addClass("character-nav-button-unselected");
        }
        if(state === "editCharacterBasic"){
            $("#edit-basic-character-sheet-button").addClass("character-nav-button-unselected");
        }
        if(state === "login"){
            $("#login").css("transform", "translate(-100%, -40px)")
        }
        if(state === "register"){
            $("#register").css("transform", "translateY(calc(100% - 40px)")
        }
        resolve();
    })
}

/* AUTH STATES */
const login = function(){
    $.ajax({
        method: "GET",
        url: "login/component",
        success: function(res){
            $("#login").html(res);
            $("#login").css("transform", "translate(0%,-40px)")
            window.history.pushState("login", '', "/login")
        }
    })
}
const register = function(){
    $.ajax({
        method: "GET",
        url: "register/component",
        success: function(res){
            $("#register").html(res);
            $("#register").css("transform", "translate(0%,-40px)")
            window.history.pushState("register", '', "/register")
        }
    }) 
}

/* CHARACTER STATES */
const character = function(){
    return new Promise((resolve) =>{
        $.ajax({
            method: "GET",
            url: `${window.location.href}/component`,
            success: function(res){
                $("#character-page").html(res);
                $("#character-sheet").html('<div class="loading" >Loading&#8230;</div>');
                $(".character-nav-button-unselected").on("click", ()=>{
                    $("#character-sheet").html('<div class="loading">Loading&#8230;</div>');
                })
                $("#basic-character-sheet-button").on("click", ()=>{
                    load("characterBasic");
                })
                $("#combat-character-sheet-button").on("click", ()=>{
                    load("characterCombat");
                })
                $("#top").css("background-color",$("#character-sheet").css("background-color"))
                $("#shadow-hide").css("background-color",$("#character-sheet").css("background-color"))
                $(".login-button").css("color","white")
                $("#title").css("color","white")
                $("#slide-bar").css("background-color",$(".character-nav-button-unselected").css("background-color"))
                $("#nav-buttons").css("background-color",$(".character-nav-button-unselected").css("background-color"))
                $("#nav-buttons").css("transform", "translate(0%)");
                $("#slide-bar").css("transform", "skew(-40deg, 0deg) translateX(0%)");
                resolve();
            }
        })
    })
}
    const characterBasic = function(){
        previousRequest = $.ajax({
            method: "GET",
            url: `${window.location.href}/component/basic-sheet`,
            success: function(res){
                $("#character-sheet").html(res);
            }
        })
        $("#basic-character-sheet-button").removeClass("character-nav-button-unselected");
    }
    const characterCombat = function(){
        previousRequest = $.ajax({
            method: "GET",
            url: `${window.location.href}/component/combat-sheet`,
            success: function(res){
                $("#character-sheet").html(res);
            }
        })
        $("#combat-character-sheet-button").removeClass("character-nav-button-unselected");
    }

/* EDIT CHARACTER STATES */
const editCharacter = function(){
    return new Promise((resolve) =>{
        $.ajax({
            method: "GET",
            url: `${window.location.href}/component`,
            success: function(res){
                $("#character-page").html(res);
                $("#character-sheet").html('<div class="loading" >Loading&#8230;</div>');
                $(".character-nav-button-unselected").on("click", ()=>{
                    $("#character-sheet").html('<div class="loading">Loading&#8230;</div>');
                })
                $("#basic-character-sheet-button").on("click", ()=>{
                    load("characterBasic");
                })
                $("#combat-character-sheet-button").on("click", ()=>{
                    load("characterCombat");
                })
                resolve();
            }
        })
    })
}
    const editCharacterBasic = function(){
        previousRequest = $.ajax({
            method: "GET",
            url: `${window.location.href}/component/basic-sheet`,
            success: function(res){
                $("#character-sheet").html(res);
            }
        })
        $("#edit-basic-character-sheet-button").removeClass("character-nav-button-unselected");
    }


