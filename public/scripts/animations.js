const left = async function(state, nextState, component){
    return new Promise((resolve)=>{
        console.log(nextState.split(">")[0])
        $(`#sub-${state}`).attr("id","old-sub-state");
        $(`#sub-${state}-container`).append(`<section id="sub-${state}"></section>`)
        $(`.big-boy-${nextState.split(">")[0]}`).removeClass(`big-boy-${nextState.split(">")[0]}`);
        $(`#sub-${state}`).html(component);
        $(`.big-boy-${nextState.split(">")[0]}`).height(($(".bottom").height()-($(`#title-box-${nextState.split(">")[0]}`).height()))/2);
        $("#big-boy-2").remove();
        $(`#sub-${state}-container`).css("transition",`${user.settings.pageSpeed}ms`);
        $(`#sub-${state}-container`).css("transform","translateX(-50%)")
        setTimeout(function(){
            $(`#sub-${state}-container`).css("transition","0ms");
            $("#old-sub-state").remove();
            $(`#sub-${state}-container`).css("transform","translate(0%,0%)");
            resolve();
        },user.settings.pageSpeed)
    })
}
const right = async function(state, nextState, component){
    return new Promise((resolve)=>{
        console.log(nextState.split(">")[0])
        $(`#sub-${state}`).attr("id","old-sub-state");
        $(`#sub-${state}-container`).prepend(`<section id="sub-${state}"></section>`)
        $(`.big-boy-${nextState.split(">")[0]}`).removeClass(`big-boy-${nextState.split(">")[0]}`);
        $(`#sub-${state}`).html(component);
        $(`.big-boy-${nextState.split(">")[0]}`).height(($(".bottom").height()-($(`#title-box-${nextState.split(">")[0]}`).height()))/2);
        $("#big-boy-2").remove();
        $(`#sub-${state}-container`).css("transform","translateX(-50%)");
        setTimeout(function(){
            $(`#sub-${state}-container`).css("transition",`${user.settings.pageSpeed}ms`);
            $(`#sub-${state}-container`).css("transform","translateX(0%)")
            setTimeout(function(){
                $(`#sub-${state}-container`).css("transition","0ms");
                $("#old-sub-state").remove();
                $(`#sub-${state}-container`).css("transform","translate(0%,0%)");
                resolve();
            },user.settings.pageSpeed)
        },10);
    })
}
const up = async function(state, nextState, component){
    return new Promise((resolve)=>{
        $(`#sub-${state}-container`).css("display","block");
        $(`#sub-${state}`).attr("id","old-sub-state");
        $(`#sub-${state}-container`).append(`<section id="sub-${state}"></section>`)
        $(`#sub-${state}`).html(component);
        $(`.big-boy-${nextState.split(">")[0]}`).height(($(".bottom").height()-($(`#title-box-${nextState.split(">")[0]}`).height()))/2);
        $(`#sub-${state}-container`).css("transition",`${user.settings.pageSpeed}ms`);
        $(`#sub-${state}-container`).css("transform","translateY(-50%)")
        setTimeout(function(){
            $(`#sub-${state}-container`).css("transition","0ms");
            $("#old-sub-state").remove();
            $(`#sub-${state}-container`).css("transform","translate(0%,0%)");
            $(`#sub-${state}-container`).css("display","flex");
            resolve();
        },user.settings.pageSpeed)
    })
}
const down = async function(state, nextState, component){
    return new Promise((resolve)=>{
        $(`#sub-${state}-container`).css("display","block");
        $(`#sub-${state}`).attr("id","old-sub-state");
        $(`#sub-${state}-container`).prepend(`<section id="sub-${state}"></section>`)
        $(`#sub-${state}`).html(component);
        $(`.big-boy-${nextState.split(">")[0]}`).height(($(".bottom").height()-($(`#title-box-${nextState.split(">")[0]}`).height()))/2);
        $(`#sub-${state}-container`).css("transform","translateY(-50%)");
        setTimeout(function(){
            $(`#sub-${state}-container`).css("transition",`${user.settings.pageSpeed}ms`);
            $(`#sub-${state}-container`).css("transform","translateY(0%)")
            setTimeout(function(){
                $(`#sub-${state}-container`).css("transition","0ms");
                $("#old-sub-state").remove();
                $(`#sub-${state}-container`).css("transform","translate(0%,0%)");
                $(`#sub-${state}-container`).css("display","flex");
                resolve();
            },user.settings.pageSpeed)
        },10);
    })
}

const basicSheet = async function(index, component){
    return new Promise((resolve)=>{
        $(".character-nav-button").addClass("character-nav-button-unselected");
        $("#basic-character-sheet-button").removeClass("character-nav-button-unselected");
        down(index, component);
        resolve();
    })
}

const advancedStatSheet = async function(index, component){
    return new Promise((resolve)=>{
        $(".character-nav-button").addClass("character-nav-button-unselected");
        $("#advanced-stat-sheet-button").removeClass("character-nav-button-unselected");
        down(index, component);
        resolve();
    })    
}



