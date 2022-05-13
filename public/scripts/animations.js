if(!user){
    user = {settings:{}};
    user.settings.pageSpeed = 1000;
}

const animations = {};

animations.left = async function(state, component){
    return new Promise((resolve)=>{
        $(`#sub-${state}`).attr("id",`old-sub-${state}`);
        $(`#sub-${state}-container`).append(`<section id="sub-${state}"></section>`)
        $(`#sub-${state}`).html(component);
        $(`#sub-${state}-container`).css("transition",`${user.settings.pageSpeed}ms`);
        $(`#sub-${state}-container`).css("transform","translateX(-50%)")
        setTimeout(function(){
            $(`#sub-${state}-container`).css("transition","0ms");
            $(`#old-sub-${state}`).remove();
            $(`#sub-${state}-container`).css("transform","translate(0%,0%)");
            resolve();
        },user.settings.pageSpeed)
    })
}
animations.right = async function(state, component){
    return new Promise((resolve)=>{
        $(`#sub-${state}`).attr("id",`old-sub-${state}`);
        $(`#sub-${state}-container`).prepend(`<section id="sub-${state}"></section>`)
        $(`#sub-${state}`).html(component);
        $(`#sub-${state}-container`).css("transform","translateX(-50%)");
        setTimeout(function(){
            $(`#sub-${state}-container`).css("transition",`${user.settings.pageSpeed}ms`);
            $(`#sub-${state}-container`).css("transform","translateX(0%)")
            setTimeout(function(){
                $(`#sub-${state}-container`).css("transition","0ms");
                $(`#old-sub-${state}`).remove();
                $(`#sub-${state}-container`).css("transform","translate(0%,0%)");
                resolve();
            },user.settings.pageSpeed)
        },10);
    })
}
animations.up = async function(state, component){
    return new Promise((resolve)=>{
        $(`#sub-${state}-container`).css("display","block");
        $(`#sub-${state}`).attr("id",`old-sub-${state}`);
        $(`#sub-${state}-container`).append(`<section id="sub-${state}"></section>`)
        $(`#sub-${state}`).html(component);
        $(`#sub-${state}-container`).css("transition",`${user.settings.pageSpeed}ms`);
        $(`#sub-${state}-container`).css("transform","translateY(-50%)")
        setTimeout(function(){
            $(`#sub-${state}-container`).css("transition","0ms");
            $(`#old-sub-${state}`).remove();
            $(`#sub-${state}-container`).css("transform","translate(0%,0%)");
            $(`#sub-${state}-container`).css("display","flex");
            resolve();
        },user.settings.pageSpeed)
    })
}
animations.down = async function(state, component){
    return new Promise((resolve)=>{
        $(`#sub-${state}-container`).css("display","block");
        $(`#sub-${state}`).attr("id",`old-sub-${state}`);
        $(`#sub-${state}-container`).prepend(`<section id="sub-${state}"></section>`)
        $(`#sub-${state}`).html(component);
        $(`#sub-${state}-container`).css("transform","translateY(-50%)");
        setTimeout(function(){
            $(`#sub-${state}-container`).css("transition",`${user.settings.pageSpeed}ms`);
            $(`#sub-${state}-container`).css("transform","translateY(0%)")
            setTimeout(function(){
                $(`#sub-${state}-container`).css("transition","0ms");
                $(`#old-sub-${state}`).remove();
                $(`#sub-${state}-container`).css("transform","translate(0%,0%)");
                $(`#sub-${state}-container`).css("display","flex");
                resolve();
            },user.settings.pageSpeed)
        },10);
    })
}

animations.none = async function(state, component){
    return new Promise((resolve)=>{
        $(`#sub-${state}`).attr("id",`old-sub-${state}`);
        $(`#sub-${state}-container`).prepend(`<section id="sub-${state}"></section>`)
        $(`#sub-${state}`).html(component);
        $(`#old-sub-${state}`).remove();
        resolve();
    })
}

animations.basicSheet = async function(state, component){
    return new Promise((resolve)=>{
        $(".character-nav-button").addClass("character-nav-button-unselected");
        $("#basic-sheet-button").removeClass("character-nav-button-unselected");
        animations.down(state, component);
        resolve();
    })
}

animations.advancedStatSheet = async function(state, component){
    return new Promise((resolve)=>{
        $(".character-nav-button").addClass("character-nav-button-unselected");
        $("#advanced-stat-sheet-button").removeClass("character-nav-button-unselected");
        animations.down(state, component);
        resolve();
    })    
}
animations.basicCombatSheet = async function(state, component){
    return new Promise((resolve)=>{
        $(".character-nav-button").addClass("character-nav-button-unselected");
        $("#basic-combat-sheet-button").removeClass("character-nav-button-unselected");
        animations.down(state, component);
        resolve();
    }) 
}

animations.combatStylesSheet = async function(state, component){
    return new Promise((resolve)=>{
        $(".character-nav-button").addClass("character-nav-button-unselected");
        $("#combat-styles-sheet-button").removeClass("character-nav-button-unselected");
        animations.down(state, component);
        resolve();
    }) 
}
animations.spiritualSheet = async function(state, component){
    return new Promise((resolve)=>{
        $(".character-nav-button").addClass("character-nav-button-unselected");
        $("#spiritual-sheet-button").removeClass("character-nav-button-unselected");
        animations.down(state, component);
        resolve();
    }) 
}
animations.heroSheet = async function(state, component){
    return new Promise((resolve)=>{
        $(".character-nav-button").addClass("character-nav-button-unselected");
        $("#hero-sheet-button").removeClass("character-nav-button-unselected");
        animations.down(state, component);
        resolve();
    }) 
}