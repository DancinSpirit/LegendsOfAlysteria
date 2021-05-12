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
        if(state ==="characters"){
            $("#characters").css("transform", "translateY(-1000%)");
        }
        if(!superStateChange){
            resolve();
        }else{
            superState = null;
            superStateChange = false;
            $("#character-page").css("transform", "translateY(100%)")
            $("#loading").css("display","flex");
            $("#loading-2").css("display","flex");
            $("#top").css("background-color", $("#background").css("color"))
            $("#shadow-hide").css("background-color",$("#background").css("color"))
            $(".login-button").css("color","black")
            $("#title").css("color","black")
            $("#slide-bar").css("background-color",$("#slidebar").css("color"))
            $("#nav-buttons").css("background-color",$("#slidebar").css("color"))
            $("body").css("background-color",$("#light").css("color"))
            setTimeout(function(){
                $("#character-page").css("display","none");
                $("#loading").css("display","none");
                $("#loading-2").css("display","none");
                resolve();
            }, 1000)
        }
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
            $("#login-form").on("submit", function(e){
                e.preventDefault();
                const formData = $(this).serialize();
                $.ajax({
                    method: "POST",
                    url: "/login",
                    data: formData,
                    success: function (res) {
                        $("#response-message").html(res);
                        if (res === "Login Successful!") {
                            load("playerHome")
                        } else if (res === "Welcome Gamemaster!"){
                            load("gamemasterHub")
                        }else{
                            /* Error */
                        }
                    }
                })
            })
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
            $("#registration-form").submit(function (e) {
                e.preventDefault();
                const formData = $(this).serialize();
                $.ajax({
                    method: "POST",
                    url: "/register",
                    data: formData,
                    success: function (res) {
                        $("#response-message").html(res);
                        if (res === "Registration Successful!") {
                        load("")
                        } else {
                        /* Error */
                        }
                    }
                })
            })
        }
    }) 
}

/* GAMEMASTER HOME */
const gamemasterHub = function(){
    $("#nav-buttons").css("transform", "translate(0%)");
    $("#slide-bar").css("transform", "skew(-40deg, 0deg) translateX(0%)");
    window.history.pushState("gamemasterHub", '', "/")
}

/* CHARACTER LIST */
const characters = function(){
    $.ajax({
        method: "GET",
        url: `/character/component`,
        success: function(res){
            $("#characters").html(res);
            $("#characters").css("transform", "translateY(-40px)");
            if(window.location.pathname != "/character")
            window.history.pushState("characters",'',"/character")
            $(".characterLink").on("click", function(){
                if(gamemaster){
                    window.history.pushState("editCharacter", '', `/character/${$(this).attr('id')}`)
                    load("editCharacter");
                }else{
                    window.history.pushState("character", '', `/character/${$(this).attr('id')}`)
                    load("character");
                }
            })
            $("#create-character").on("click", function(){
                $.ajax({
                    method: "POST",
                    url: "/character",
                    success: function(res){
                        if(gamemaster){
                            window.history.pushState("editCharacter", '', `/character/${res}`)
                            load("editCharacter");
                        }else{
                            window.history.pushState("character", '', `/character/${res}`)
                            load("character");
                        }
                    }
                })
            })
        }
    })
}

/* CHARACTER STATES */
const character = function(){
    return new Promise((resolve) =>{
        $.ajax({
            method: "GET",
            url: `${window.location.href}/component`,
            success: function(originalRes){
                $.ajax({
                    method: "GET",
                    url: `${window.location.href}/style`,
                    success: function(res){
                        $("head").append($("<link rel='stylesheet' type='text/css' />").attr('href',`/styles/characters/${res}.css`))
                        $("#loading").css("display","flex");
                        $("#loading-2").css("display","flex");
                        $("#character-page").css("display","block");
                        const loadCharacterListener = setInterval(function(){
                            if($("#css-load-tester").css("color")==="rgb(255, 255, 255)"){
                                clearInterval(loadCharacterListener);
                                loadCharacter(originalRes);
                                $("#loading").css("display","none");
                                $("#loading-2").css("display","none");
                                resolve();
                            }
                        },50)
                    }
                })
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
            success: function(originalRes){
                $.ajax({
                    method: "GET",
                    url: `${window.location.href}/style`,
                    success: function(res){
                        $.ajax({
                            method: "GET",
                            url: `/styles/characters/${res}.css`,
                            success: function(){
                                $("head").append($("<link rel='stylesheet' type='text/css' />").attr('href',`/styles/characters/${res}.css`))
                            },
                            error: function(){
                                $("head").append($("<link rel='stylesheet' type='text/css' />").attr('href',`/styles/characters/new.css`))
                            }
                        })
                        $("#loading").css("display","flex");
                        $("#loading-2").css("display","flex");
                        $("#character-page").css("display","block");
                        const loadCharacterListener = setInterval(function(){
                            if($("#css-load-tester").css("color")==="rgb(255, 255, 255)"){
                                clearInterval(loadCharacterListener);
                                loadCharacter(originalRes);
                                $("#loading").css("display","none");
                                $("#loading-2").css("display","none");
                                resolve();
                            }
                        },50)
                    }
                })
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
                loadEditing();
            }
        })
        $("#edit-basic-character-sheet-button").removeClass("character-nav-button-unselected");
    }

const loadCharacter = function(res){
    $("#character-page").html(res);
    $("#character-page").css("transform","translateY(-20px)")
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
    console.log($("#character-light"))
    $("body").css("background-color",$("#character-light").css("color"))
    $("#nav-buttons").css("transform", "translate(0%)");
    $("#slide-bar").css("transform", "skew(-40deg, 0deg) translateX(0%)");
}

const loadEditing = function(){
    $(".character-edit").focusout(function(){
        $.ajax({
            method: "PUT",
            url: `${window.location.href}?${$(this).attr("id")}=${$(this).text()}`,
            success: function(res){
                console.log("Character updated!")
            }
        })
    })
    /* Image Upload */
    $("#character-image").on("click", function() {
        $("#file").click();
    })
    $("#file").change(function () {
        $("#file-submit").click();
    })
    $(".add-trait").on("click", function(){
        const thisButton = this;
        $.ajax({
            method: "POST",
            url: `${window.location.href}/trait/${$(this).attr("type")}`,
            success: function(res){
                console.log("Trait Added!")
                if($(thisButton).attr("type") == 4){
                    $(thisButton).before(`<section class="trait"><section class="character-box-title character-box-section character-edit" role="textbox" id="traits|${$(thisButton).attr("type")}]|${res}].name" contenteditable=""></section><section class="character-box-content character-box-section character-edit" id="traits|${$(thisButton).attr("type")}]|${res}].description" role="textbox" contenteditable=""></section></section>`);
                }else if($(thisButton).attr("type") == 0){

                }else{
                $(thisButton).before(`<section class="trait"><section class="character-box-title character-box-section character-edit" role="textbox" id="traits|${$(thisButton).attr("type")}]|${res}].name" contenteditable=""></section><section class="character-box-content character-box-section character-edit" id="traits|${$(thisButton).attr("type")}]|${res}].description" role="textbox" contenteditable=""></section><section class="character-box-content character-box-section"><b>Effect:</b> <span role="textbox" class="character-edit" contenteditable="" id="traits|${$(thisButton).attr("type")}]|${res}].effect"></span></section></section>`);
                }
                $(".character-edit").off("focusout");
                $(".character-edit").focusout(function(){
                    $.ajax({
                        method: "PUT",
                        url: `${window.location.href}?${$(this).attr("id")}=${$(this).text()}`,
                        success: function(res){
                            console.log("Character updated!")
                        }
                    })
                })
            }
        })
    })
    
    const deleteButton = function(button){
        if(!button.startsWith(".")){
            button = document.getElementById(button);
        }
        $(button).on("click", function(){
            const id = $(this).attr("id");
            const $name =  $(document.getElementById(`${id}.name`));
            const $description = $(document.getElementById(`${id}.description`));
            const $effect = $(document.getElementById(`${id}.effect`))
            $name.off("focusout");
            $description.off("focusout");
            $effect.off("focusout");
            const oldName = $name.text();
            const oldNameHtml = $name.html();
            const oldDescrip = $description.html();
            $name.text('Are you sure you want to delete "' + oldName + '"?');
            $description.html("<button id='yes-button'>YES</button><button id='no-button'>NO</button>");
            $("#yes-button").on("click", function(){
                thisButton = this;
                $.ajax({
                    method: "DELETE",
                    url: `${window.location.href}/trait/${id}}`,
                    success: function(res){
                        $(thisButton).parent().parent().remove();
                        /* UPDATE INDEXES! */
                    } 
                })
            })
            $("#no-button").on("click", function(){
                $name.html(oldNameHtml);
                $description.html(oldDescrip);
                $name.on("focusout", function(){
                    $.ajax({
                        method: "PUT",
                        url: `${window.location.href}?${$(this).attr("id")}=${$(this).text()}`,
                        success: function(res){
                            console.log("Character updated!")
                        }
                    })
                });
                $description.on("focusout", function(){
                    $.ajax({
                        method: "PUT",
                        url: `${window.location.href}?${$(this).attr("id")}=${$(this).text()}`,
                        success: function(res){
                            console.log("Character updated!")
                        }
                    })
                });
                $effect.on("focusout", function(){
                    $.ajax({
                        method: "PUT",
                        url: `${window.location.href}?${$(this).attr("id")}=${$(this).text()}`,
                        success: function(res){
                            console.log("Character updated!")
                        }
                    })
                });
                deleteButton(id);
            })
        })
    }
    deleteButton(".fa-times-circle");
}
