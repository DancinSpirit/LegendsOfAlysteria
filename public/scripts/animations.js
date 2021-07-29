const left = async function(index, component){
    return new Promise((resolve)=>{
        console.log(states[index+1].split(">")[0])
        $(`#sub-${states[index]}`).attr("id","old-sub-state");
        $(`#sub-${states[index]}-container`).append(`<section id="sub-${states[index]}"></section>`)
        $(`.big-boy-${states[index+1].split(">")[0]}`).removeClass(`big-boy-${states[index+1].split(">")[0]}`);
        $(`#sub-${states[index]}`).html(component);
        $(`.big-boy-${states[index+1].split(">")[0]}`).height(($(".bottom").height()-($(`#title-box-${states[index+1].split(">")[0]}`).height()))/2);
        $("#big-boy-2").remove();
        $(`#sub-${states[index]}-container`).css("transition","1000ms");
        $(`#sub-${states[index]}-container`).css("transform","translateX(-50%)")
        setTimeout(function(){
            $(`#sub-${states[index]}-container`).css("transition","0ms");
            $("#old-sub-state").remove();
            $(`#sub-${states[index]}-container`).css("transform","translate(0%,0%)");
            resolve();
        },1000)
    })
}
const right = async function(index, component){
    return new Promise((resolve)=>{
        console.log(states[index+1].split(">")[0])
        $(`#sub-${states[index]}`).attr("id","old-sub-state");
        $(`#sub-${states[index]}-container`).prepend(`<section id="sub-${states[index]}"></section>`)
        $(`.big-boy-${states[index+1].split(">")[0]}`).removeClass(`big-boy-${states[index+1].split(">")[0]}`);
        $(`#sub-${states[index]}`).html(component);
        $(`.big-boy-${states[index+1].split(">")[0]}`).height(($(".bottom").height()-($(`#title-box-${states[index+1].split(">")[0]}`).height()))/2);
        $("#big-boy-2").remove();
        $(`#sub-${states[index]}-container`).css("transform","translateX(-50%)");
        setTimeout(function(){
            $(`#sub-${states[index]}-container`).css("transition","1000ms");
            $(`#sub-${states[index]}-container`).css("transform","translateX(0%)")
            setTimeout(function(){
                $(`#sub-${states[index]}-container`).css("transition","0ms");
                $("#old-sub-state").remove();
                $(`#sub-${states[index]}-container`).css("transform","translate(0%,0%)");
                resolve();
            },1000)
        },10);
    })
}
const up = async function(index, component){
    return new Promise((resolve)=>{
        $(`#sub-${states[index]}-container`).css("display","block");
        $(`#sub-${states[index]}`).attr("id","old-sub-state");
        $(`#sub-${states[index]}-container`).append(`<section id="sub-${states[index]}"></section>`)
        $(`#sub-${states[index]}`).html(component);
        $(`.big-boy-${states[index+1].split(">")[0]}`).height(($(".bottom").height()-($(`#title-box-${states[index+1].split(">")[0]}`).height()))/2);
        $(`#sub-${states[index]}-container`).css("transition","1000ms");
        $(`#sub-${states[index]}-container`).css("transform","translateY(-50%)")
        setTimeout(function(){
            $(`#sub-${states[index]}-container`).css("transition","0ms");
            $("#old-sub-state").remove();
            $(`#sub-${states[index]}-container`).css("transform","translate(0%,0%)");
            $(`#sub-${states[index]}-container`).css("display","flex");
            resolve();
        },1000)
    })
}
const down = async function(index, component){
    return new Promise((resolve)=>{
        $(`#sub-${states[index]}-container`).css("display","block");
        $(`#sub-${states[index]}`).attr("id","old-sub-state");
        $(`#sub-${states[index]}-container`).prepend(`<section id="sub-${states[index]}"></section>`)
        $(`#sub-${states[index]}`).html(component);
        $(`.big-boy-${states[index+1].split(">")[0]}`).height(($(".bottom").height()-($(`#title-box-${states[index+1].split(">")[0]}`).height()))/2);
        $(`#sub-${states[index]}-container`).css("transform","translateY(-50%)");
        setTimeout(function(){
            $(`#sub-${states[index]}-container`).css("transition","1000ms");
            $(`#sub-${states[index]}-container`).css("transform","translateY(0%)")
            setTimeout(function(){
                $(`#sub-${states[index]}-container`).css("transition","0ms");
                $("#old-sub-state").remove();
                $(`#sub-${states[index]}-container`).css("transform","translate(0%,0%)");
                $(`#sub-${states[index]}-container`).css("display","flex");
                resolve();
            },1000)
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



