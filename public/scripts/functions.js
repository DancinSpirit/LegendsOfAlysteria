const load = async function(url, data){
    return new Promise((resolve)=>{
        if(url.startsWith("/component")){
            $.ajax({
                method: "POST",
                url: url,
                data: data,
                success: (res)=>{
                    resolve(res);
                }
            }) 
        }
        else{
            $.ajax({
                method: "GET",
                url: url,
                success: (res)=>{
                    resolve(res);
                }
            }) 
        }
    })
}

const loadState = async function(x, animation){
    console.log("Before: " + states[x]);
    if(states[x].includes("%3E")){
        states[x] = states[x].replace(/%3E/g, ">")
    }
    console.log("After: " + states[x])
    console.log(x);
    $(`style-${x}`).remove();
    $("head").append($(`<link id='style-${x}' rel='stylesheet' type='text/css'/>`).attr('href',`/styles/${states[x]}.css`))
    let component;
    if(!jQuery.isEmptyObject(data[x])){
        console.log(data[x]);
        console.log(data);
        component = await load(`/component/${states[x]}`,{model: data[x]});    
    }else{
        component = await load(`/component/${states[x]}`);
    }
    if(component.includes("<background>")){
        $("#background").css("background-image",`url("${component.split("<background>")[1].split("</background>")[0]}"`);
    }
    if(component.includes("<component>")){
        let components = [];
        for(let y=1; y<component.split("<component>").length; y++){
            components.push(component.split("<component>")[y].split("</component>")[0]);
        }
        for(let y=0; y<components.length; y++){
            console.log(components[y])
            let data = {model: {name: components[y].split("|")[1],id: components[y].split("|")[2]}};
            console.log(data);
            let newComponent = await load(`/component/${components[y].split("|")[0]}`,data); 
            console.log(newComponent);
            console.log()
            component = component.replace("<component>" + components[y] + "</component>", newComponent);
        }
    }
    if(x==0){
        $('body').html(component);
    }else{
        if(component.includes("<animation>")){
            await eval(`${component.split("<animation>")[1].split("</animation")[0]}(${x-1}, component)`)
        }else{
            if(animation){
                await eval(`${animation}(${x-1}, component)`)
            }else{
                await eval(`left(${x-1}, component)`)
            }
        }
    }
}



const loadStates = async function(){
    console.log(states);
    deactivateButtons();
    for(let x=0; x<states.length; x++){
        await loadState(x);
    }
    console.log("Test: " + states)
    activateButtons();
}

const deactivateButtons = function(){
    $("#login-button").off("click")
    $("#register-button").off("click")
    $("#basic-character-sheet-button").off("click")
    $("#advanced-stat-sheet-button").off("click")
    $("#right-arrow-box").off("click");
    $("#left-arrow-box").off("click");
}

const activateButtons = function(){
    $("#login-button").on("click", async function(){
        states = ["main","login"]
        window.history.pushState({states:states,data:data}, "Login Page", "/main/login");
        deactivateButtons();
        await loadState(1);
        activateButtons();
    })
    $("#register-button").on("click", async function(){
        states = ["main","register"]
        window.history.pushState({states:states,data:data}, "Register Page", "/main/register");
        deactivateButtons();
        await loadState(1);
        activateButtons();
    })
    $("#basic-character-sheet-button").on("click", async function(){
        states = ["main","characterinfo","basic-sheet"]
        window.history.pushState({states:states,data:data}, "Character Info - Basic", window.location.href.replace(window.location.href.split("/")[window.location.href.split("/").length-1],"basic-sheet"))
        deactivateButtons();
        await loadState(2);
        activateButtons();
    })
    $("#advanced-stat-sheet-button").on("click", async function(){
        states = ["main","characterinfo","advanced-stat-sheet"]
        window.history.pushState({states:states,data:data}, "Character Info - Advanced Stats", window.location.href.replace(window.location.href.split("/")[window.location.href.split("/").length-1],"advanced-stat-sheet"))
        deactivateButtons();
        await loadState(2);
        activateButtons();
    })
    $("#right-arrow-box").on("click", async function(){
        deactivateButtons();
        if(states.includes("main-title")){
            let turnTitle = `turn-title>currentTurn=0>currentYear=0>currentSeason=3`
            states = ["story",turnTitle]
            window.history.pushState({states:states,data:data}, "Turn Title", window.location.href.replace(window.location.href.split("/")[window.location.href.split("/").length-1],turnTitle + `|story=${window.location.href.split("/")[window.location.href.split("/").length-1].split("%7C")[1].split("=")[1]}`))
        }
        else if(states[1].includes("turn-title")){
            let regionTitle = `region-title>currentYear=0>currentSeason=3>region=0`;
            states = ["story", regionTitle]
            window.history.pushState({states:states,data:data}, "Region Title", window.location.href.replace(window.location.href.split("/")[window.location.href.split("/").length-1],regionTitle + `|story=${window.location.href.split("/")[window.location.href.split("/").length-1].split("%7C")[1].split("=")[1]}`))
        }
        else if(states[1].includes("region-title")){
            let year = states[states.length-1].split(">")[1].split("=")[1];
            let season = states[states.length-1].split(">")[2].split("=")[1];
            let regionPhase = states[states.length-1].split(">")[3].split("=")[1];
            let playerTitle = `player-title>currentYear=${year}>currentSeason=${season}>region=${regionPhase}>phase=0`;
            states = ["story", playerTitle];
            window.history.pushState({states:states,data:data}, "Player Title", window.location.href.replace(window.location.href.split("/")[window.location.href.split("/").length-1], playerTitle + `|story=${window.location.href.split("/")[window.location.href.split("/").length-1].split("%7C")[1].split("=")[1]}`))
        }
        else if(states[1].includes("player-title")){
            let year = states[states.length-1].split(">")[1].split("=")[1];
            let season = states[states.length-1].split(">")[2].split("=")[1];
            let regionPhase = states[states.length-1].split(">")[3].split("=")[1];
            let rulerPhase = states[states.length-1].split(">")[4].split("=")[1];
            let event = years[year].seasons[season].regionPhases[regionPhase].rulerPhases[rulerPhase].events[0];
            states = ["story", `event`];
            data = [data[0],{name: "Event", id: event}]
            window.history.pushState({states:states,data:data}, "Event", window.location.href.replace(window.location.href.split("/")[window.location.href.split("/").length-1], `event|event=${event}`))
        }
        await loadState(1,"left");
        activateButtons();
    })
    $("#left-arrow-box").on("click", async function(){
        deactivateButtons();
        if(states.includes("turn-title>currentTurn=0>currentYear=0>currentSeason=3")){
            states = ["story","main-title"]
            window.history.pushState({states:states,data:data}, "Main Title", window.location.href.replace(window.location.href.split("/")[window.location.href.split("/").length-1],"main-title"))
        }
        else if(states[states.length-1].includes("region-title")){
            let year = states[states.length-1].split(">")[1].split("=")[1];
            let season = states[states.length-1].split(">")[2].split("=")[1];
            let regionPhase = states[states.length-1].split(">")[3].split("=")[1];
            if(parseInt(regionPhase)){
                //load final event of previous region phase
            }else{
                let turn;
                if(year==0&&season==3){
                    turn = 0;
                }else{
                    turn = ((year-1)*4) + (season+1);
                }
                let turnTitle = `turn-title>currentTurn=${turn}>currentYear=${year}>currentSeason=${season}`
                states = ["story",turnTitle]
                window.history.pushState({states:states,data:data}, "Turn Title", window.location.href.replace(window.location.href.split("/")[window.location.href.split("/").length-1],turnTitle))
            }
        }
        else if(states[states.length-1].includes("player-title")){
            let year = states[states.length-1].split(">")[1].split("=")[1];
            let season = states[states.length-1].split(">")[2].split("=")[1];
            let regionPhase = states[states.length-1].split(">")[3].split("=")[1];
            let regionTitle = `region-title>currentYear=${year}>currentSeason=${season}>region=${regionPhase}`
            states = ["story",regionTitle];
            window.history.pushState({states:states,data:data}, "Region Title", window.location.href.replace(window.location.href.split("/")[window.location.href.split("/").length-1],regionTitle))

        }
        await loadState(1,"right");
        console.log("Test: " + states)
        activateButtons();
    })
}