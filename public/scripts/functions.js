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
    if(states[x].includes("event")){
        deactivateAll();
    }
    if(states[x].includes("title")){
        deactivateAll();
    }
    if(states[x].includes("%3E")){
        states[x] = states[x].replace(/%3E/g, ">")
    }
    $(`style-${x}`).remove();
    $("head").append($(`<link id='style-${x}' rel='stylesheet' type='text/css'/>`).attr('href',`/styles/${states[x]}.css`))
    let component;
    console.log(data[x]);
    if(!jQuery.isEmptyObject(data[x])){
        component = await load(`/component/${states[x]}`,{model: data[x], player: player});    
    }else{
        component = await load(`/component/${states[x]}`);
    }
    if(component.includes("<background>")){
        $("body").css("background-image",`url("${component.split("<background>")[1].split("</background>")[0]}"`);
    }
    component = await componentCheck(component);
    console.log(component);
    let stateOne;
    let stateTwo;
    if(x==0){
        console.log(states[x])
        stateOne = "base"
        stateTwo = states[x];
    }else{
        stateOne = states[x-1];
        stateTwo = states[x];
    }
    if(animation){
        await eval(`${animation}(stateOne,stateTwo, component)`)
    }else{
        if(component.includes("<animation>")){
            await eval(`${component.split("<animation>")[1].split("</animation")[0]}(stateOne,stateTwo, component)`)
        }else{
        console.log(states[x])
        await left(stateOne,stateTwo, component);
        }
    }
    if(states[x].includes("event")){
        activateEventClick();
    }
    if(states[x].includes("title")){
        activateTitleClick();
    }
    if(states.length==2)
        if(states[1].includes("main-title")){
            $("#left-arrow-box").addClass("invisible");
        }else{
            $("#left-arrow-box").removeClass("invisible");
        }
    //The Below Was Removed Because Intentions Were Changed
/*     if(states[1].includes("title")){
        $("#top-arrow-box").addClass("invisible");
    }else{
        $("#top-arrow-box").removeClass("invisible");
    } */
    if(states[0] != "main")
    $("link[href='/styles/main.css']").remove();
    if(states[0] != "start")
    $("link[href='/styles/start.css']").remove();
    if(states[0] != "story")
    $("link[href='/styles/story.css']").remove();
    if(states[x]=="character"){
        document.documentElement.style.setProperty('--light', characterColors.light);
        document.documentElement.style.setProperty('--dark', characterColors.dark);
        document.documentElement.style.setProperty('--darker', characterColors.darker);
        document.documentElement.style.setProperty('--highlight', characterColors.highlight);
        document.documentElement.style.setProperty('--background', characterColors.background);
    }
}

const componentCheck = async function(component){
    console.log("HELLO?!")
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
            newComponent = await componentCheck(newComponent);
            console.log()
            component = component.replace("<component>" + components[y] + "</component>", newComponent);
        }
    }
    console.log("CHeck" + component)
    return component;
}


const loadStates = async function(){
    $("#settings").css("visibility","hidden");
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
    $("#basic-sheet-button").off("click")
    $("#advanced-stat-sheet-button").off("click")
    $("#basic-combat-sheet-button").off("click");
    $("#combat-styles-sheet-button").off("click");
    $("#spirituality-sheet-button").off("click");
    $("#hero-sheet-button").off("click");
    $("#right-arrow-box").off("click");
    $("#left-arrow-box").off("click");
    $("#settings-button").off("click");
    $("#top-arrow-box").off("click");
    $("#nav-title").off("click");
}

const characterSheetButton = async function(type){
    if(states[1] == "character"){
        if(states[2] != [`${type}-sheet`]){
            states = ["main","character",`${type}-sheet`]
            window.history.pushState({states:states,data:data}, "Character Info", window.location.href.replace(window.location.href.split("/")[window.location.href.split("/").length-1],`${type}-sheet|characterinfo=${window.location.href.split("/")[window.location.href.split("/").length-1].split("=")[1]}`))
            deactivateButtons();
            await loadState(2);
            activateButtons();
        }
    }
    if(states[2] == "character"){
        if(states[3] != [`${type}-sheet`]){
            states = ["story","event","character",`${type}-sheet`]
            deactivateButtons();
            await loadState(3);
            activateButtons();
        }
    }
}

const activateButtons = function(){
    $("#login-button").on("click", async function(){
        if(states[1] != ["login"]){
            states = ["main","login"]
            window.history.pushState({states:states,data:data}, "Login Page", "/main/login");
            deactivateButtons();
            await loadState(1);
            activateButtons();
        }
    })
    $("#register-button").on("click", async function(){
        if(states[1] != ["register"]){
            states = ["main","register"]
            window.history.pushState({states:states,data:data}, "Register Page", "/main/register");
            deactivateButtons();
            await loadState(1);
            activateButtons();
        }
    })
    $("#nav-title").on("click", async function(){
        if(states[1] != ["home"]){
            states = ["main","home"];
            data = [data[0],data[0]];
            window.history.pushState({states:states,data:data}, "Home Page", "/main/home");
            deactivateButtons();
            await loadState(1);
            activateButtons();
        }
    })
    $("#account-info").on("click", async function(){
        $("#account-options").css("display","block");
        $("#account-info").css("background-color","var(--darker)")
        $("#account-info").off("click");
        $("#account-info").on("click",async function(){
            $("#account-options").css("display","none");
            $("#account-info").css("background-color","var(--dark)")
            deactivateButtons();
            activateButtons();
        })
    })
    $("#basic-sheet-button").on("click", async function(){
        characterSheetButton("basic");
    })
    $("#basic-combat-sheet-button").on("click", async function(){
        characterSheetButton("basic-combat");
    })
    $("#combat-styles-sheet-button").on("click", async function(){
        characterSheetButton("combat-styles");
    })
    $("#advanced-stat-sheet-button").on("click", async function(){
        characterSheetButton("advanced-stat");
    })
    $("#spiritual-sheet-button").on("click", async function(){
        characterSheetButton("spiritual");
    })
    $("#hero-sheet-button").on("click", async function(){
        characterSheetButton("hero");
    })
    $("#settings-button").on("click", async function(){
        deactivateButtons();
        if(!settings){
            $("#top-section").css("transition",`${user.settings.pageSpeed}ms`);
            $("#main-story-section").css("transition",`${user.settings.pageSpeed}ms`);
            $("#settings").css("transition",`${user.settings.pageSpeed}ms`);
            $("#cutaway-image-collection").css("transition",`${user.settings.pageSpeed}ms`);
            $("#top-arrow-box").children('i').removeClass("fa-chevron-down");
            $("#top-arrow-box").children('i').addClass("fa-chevron-up");
            $("#top-arrow-box").css("transition",`${user.settings.pageSpeed}ms`);
            $("#top-arrow-box").css("transform","translateY(0)");
            $("#cutaway-image-collection").css("transform","translateY(100%)");
            $("#top-section").css("transform","translateY(100vh)");
            $("#main-story-section").css("transform","translateY(100vh)");
            $("#settings").css("transform","translateY(0%)");
            setTimeout(function(){
                $("#top-section").css("transition","0ms");
                $("#main-story-section").css("transition","0ms");
                $("#settings").css("transition","0ms");
            },1100)
            settings = true;
            images = false;
        }else{
            $("#top-section").css("transition",`${user.settings.pageSpeed}ms`);
            $("#main-story-section").css("transition",`${user.settings.pageSpeed}ms`);
            $("#settings").css("transition",`${user.settings.pageSpeed}ms`);
            $("#top-section").css("transform","translateY(0)");
            $("#main-story-section").css("transform","translateY(0)");
            $("#settings").css("transform","translateY(-120%)");
            $("#cutaway-image-collection").css("transform","translateY(0)");
            setTimeout(function(){
                $("#top-section").css("transition","0ms");
                $("#main-story-section").css("transition","0ms");
                $("#settings").css("transition","0ms");
            },1100) 
            settings = false;
        }
        activateButtons();
    })
    $("#top-arrow-box").on("click", function(){
        deactivateButtons();
        if(!images){
            $("#top-section").css("transition",`${user.settings.pageSpeed}ms`);
            $("#main-story-section").css("transition",`${user.settings.pageSpeed}ms`);
            $("#cutaway-image-collection").css("transition",`${user.settings.pageSpeed}ms`);
            $("#top-arrow-box").children('i').removeClass("fa-chevron-up");
            $("#top-arrow-box").children('i').addClass("fa-chevron-down");
            $("#top-arrow-box").css("transition",`${user.settings.pageSpeed}ms`);
            $("#settings").css("transition",`${user.settings.pageSpeed}ms`);
            $("#top-section").css("transform","translateY(-100vh)");
            $("#top-arrow-box").css("transform","translateY(-90vh)");
            $("#main-story-section").css("transform","translateY(-100vh)");
            $("#cutaway-image-collection").css("transform","translateY(-90vh)");
            $("#settings").css("transform","translateY(-200%)");
            setTimeout(function(){
                $("#top-section").css("transition","0ms");
                $("#top-arrow-box").css("transition","0ms");
                $("#main-story-section").css("transition","0ms");
                $("#cutaway-image-collection").css("transition","0ms");
                $("#settings").css("transition","0ms");
            },1100)
            images = true;
            settings = false;
        }else{
            $("#top-section").css("transition",`${user.settings.pageSpeed}ms`);
            $("#main-story-section").css("transition",`${user.settings.pageSpeed}ms`);
            $("#cutaway-image-collection").css("transition",`${user.settings.pageSpeed}ms`);
            $("#top-arrow-box").children('i').removeClass("fa-chevron-down");
            $("#top-arrow-box").children('i').addClass("fa-chevron-up");
            $("#top-arrow-box").css("transition",`${user.settings.pageSpeed}ms`);
            $("#top-section").css("transform","translateY(0)");
            $("#top-arrow-box").css("transform","translateY(0)");
            $("#main-story-section").css("transform","translateY(0)");
            $("#cutaway-image-collection").css("transform","translateY(0)");
            $("#settings").css("transform","translateY(-120%)");
            setTimeout(function(){
                $("#top-section").css("transition","0ms");
                $("#top-arrow-box").css("transition","0ms");
                $("#main-story-section").css("transition","0ms");
                $("#cutaway-image-collection").css("transition","0ms");
                $("#settings").css("transition","0ms");
            },1100)
            images = false;
        }
        activateButtons();
    })
    $("#right-arrow-box").on("click", async function(){
        if(continueEvent){
            deactivateButtons();
            if(states.includes("main-title")){
                let turnTitle = `turn-title>currentTurn=-3>currentYear=0>currentSeason=0`
                states = ["story",turnTitle]
                data = [data[0],data[0]]
                window.history.pushState({states:states,data:data}, "Turn Title", window.location.href.replace(window.location.href.split("/")[window.location.href.split("/").length-1],turnTitle + `|story=${window.location.href.split("/")[window.location.href.split("/").length-1].split("%7C")[1].split("=")[1]}`))
            }
            else if(states[1].includes("turn-title")){
                let regionTitle = `region-title>currentYear=0>currentSeason=0>region=0`;
                states = ["story", regionTitle]
                data = [data[0],data[0]]
                window.history.pushState({states:states,data:data}, "Region Title", window.location.href.replace(window.location.href.split("/")[window.location.href.split("/").length-1],regionTitle + `|story=${window.location.href.split("/")[window.location.href.split("/").length-1].split("%7C")[1].split("=")[1]}`))
            }
            else if(states[1].includes("region-title")){
                let year = states[states.length-1].split(">")[1].split("=")[1];
                let season = states[states.length-1].split(">")[2].split("=")[1];
                let regionPhase = states[states.length-1].split(">")[3].split("=")[1];
                let playerTitle = `player-title>currentYear=${year}>currentSeason=${season}>region=${regionPhase}>phase=0`;
                states = ["story", playerTitle];
                data = [data[0],data[0]]
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
            else if(states[1].includes("event")){
                let event;
                for(let x=0; x<years.length; x++){
                    for(let y=0; y<years[x].seasons.length; y++){
                        for(let z=0; z<years[x].seasons[y].regionPhases.length; z++){
                            for(let a=0; a<years[x].seasons[y].regionPhases[z].rulerPhases.length; a++){
                                for(let b=0; b<years[x].seasons[y].regionPhases[z].rulerPhases[a].events.length; b++){
                                    if(years[x].seasons[y].regionPhases[z].rulerPhases[a].events[b]==eventId){
                                        if(b<years[x].seasons[y].regionPhases[z].rulerPhases[a].events.length-1){
                                            states = ["story", "event"];
                                            event = years[x].seasons[y].regionPhases[z].rulerPhases[a].events[b+1];
                                            console.log("Event: " + event);
                                            data = [data[0],{name: "Event", id: event}]
                                            window.history.pushState({states:states,data:data}, "Event", window.location.href.replace(window.location.href.split("/")[window.location.href.split("/").length-1], `event|event=${event}`))
                                        }else{
                                            if(a<years[x].seasons[y].regionPhases[z].rulerPhases.length-1){
                                                let playerTitle = `player-title>currentYear=${x}>currentSeason=${y}>region=${z}>phase=${a+1}`;
                                                states = ["story", playerTitle];
                                                data = [data[0],data[0]]
                                                window.history.pushState({states:states,data:data}, "Player Title", window.location.href.replace(window.location.href.split("/")[window.location.href.split("/").length-1], playerTitle + `|story=${window.location.href.split("/")[3].split("%7C")[1].split("=")[1]}`))
                                            }else{
                                                if(z<years[x].seasons[y].regionPhases.length-1){
                                                    let regionTitle = `region-title>currentYear=${x}>currentSeason=${y}>region=${z+1}`
                                                    states = ["story", regionTitle];
                                                    data = [data[0],data[0]]
                                                    window.history.pushState({states:states,data:data}, "Player Title", window.location.href.replace(window.location.href.split("/")[window.location.href.split("/").length-1], regionTitle + `|story=${window.location.href.split("/")[3].split("%7C")[1].split("=")[1]}`))
                                                }else{
                                                    if(y<years[x].seasons.length-1){
                                                        //load the next season
                                                    }else{
                                                        if(x<years.length-1){
                                                            //load the next year
                                                        }else{
                                                            states = ["story", "to-be-continued"];
                                                            data = [data[0],data[0]];
                                                            window.history.pushState({states:states,data:data}, "To Be Continued", window.location.href.replace(window.location.href.split("/")[window.location.href.split("/").length-1], `to-be-continued|story=${window.location.href.split("/")[3].split("%7C")[1].split("=")[1]}`))
                                            
                                                        }
                                                    }
                                                }
                                            }
                                            
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            await loadState(1,"left");
            activateButtons();
        }
    })
    $("#left-arrow-box").on("click", async function(){
        if(continueEvent){
            deactivateButtons();
            if(states.includes("turn-title>currentTurn=-3>currentYear=0>currentSeason=0")){
                states = ["story","main-title"]
                data = [data[0],data[0]]
                window.history.pushState({states:states,data:data}, "Main Title", window.location.href.replace(window.location.href.split("/")[window.location.href.split("/").length-1],"main-title"+ `|story=${window.location.href.split("/")[3].split("%7C")[1].split("=")[1]}`))
            }
            else if(states[states.length-1].includes("region-title")){
                let year = states[states.length-1].split(">")[1].split("=")[1];
                let season = states[states.length-1].split(">")[2].split("=")[1];
                let regionPhase = states[states.length-1].split(">")[3].split("=")[1];
                if(parseInt(regionPhase)){
                    states = ["story", "event"];
                    let event = years[year].seasons[season].regionPhases[regionPhase-1].rulerPhases[years[year].seasons[season].regionPhases[regionPhase-1].rulerPhases.length-1].events[years[year].seasons[season].regionPhases[regionPhase-1].rulerPhases[years[year].seasons[season].regionPhases[regionPhase-1].rulerPhases.length-1].events.length-1];
                    console.log("Event: " + event);
                    data = [data[0],{name: "Event", id: event}]
                    window.history.pushState({states:states,data:data}, "Event", window.location.href.replace(window.location.href.split("/")[window.location.href.split("/").length-1], `event|event=${event}`))
                                        
                }else{
                    let turn;
                    if(year==0){
                        turn = season-3;
                    }else{
                        turn = ((year-1)*4) + (season+1);
                    }
                    let turnTitle = `turn-title>currentTurn=${turn}>currentYear=${year}>currentSeason=${season}`
                    states = ["story",turnTitle]
                    data = [data[0],data[0]]
                    window.history.pushState({states:states,data:data}, "Turn Title", window.location.href.replace(window.location.href.split("/")[window.location.href.split("/").length-1],turnTitle+ `|story=${window.location.href.split("/")[3].split("%7C")[1].split("=")[1]}`))
                }
            }
            else if(states[states.length-1].includes("player-title")){
                let year = states[states.length-1].split(">")[1].split("=")[1];
                let season = states[states.length-1].split(">")[2].split("=")[1];
                let regionPhase = states[states.length-1].split(">")[3].split("=")[1];
                let rulerPhase = states[states.length-1].split(">")[4].split("=")[1];
                if(rulerPhase==0){
                    let regionTitle = `region-title>currentYear=${year}>currentSeason=${season}>region=${regionPhase}`
                    states = ["story",regionTitle];
                    data = [data[0],data[0]]
                    window.history.pushState({states:states,data:data}, "Region Title", window.location.href.replace(window.location.href.split("/")[window.location.href.split("/").length-1],regionTitle+ `|story=${window.location.href.split("/")[3].split("%7C")[1].split("=")[1]}`)) 
                }else{
                    states = ["story", "event"];
                    let event = years[year].seasons[season].regionPhases[regionPhase].rulerPhases[rulerPhase-1].events[years[year].seasons[season].regionPhases[regionPhase].rulerPhases[rulerPhase-1].events.length-1];
                    console.log("Event: " + event);
                    data = [data[0],{name: "Event", id: event}]
                    window.history.pushState({states:states,data:data}, "Event", window.location.href.replace(window.location.href.split("/")[window.location.href.split("/").length-1], `event|event=${event}`))
                }
            }
            else if(states[1].includes("event")){
                let event;
                for(let x=0; x<years.length; x++){
                    for(let y=0; y<years[x].seasons.length; y++){
                        for(let z=0; z<years[x].seasons[y].regionPhases.length; z++){
                            for(let a=0; a<years[x].seasons[y].regionPhases[z].rulerPhases.length; a++){
                                for(let b=0; b<years[x].seasons[y].regionPhases[z].rulerPhases[a].events.length; b++){
                                    if(years[x].seasons[y].regionPhases[z].rulerPhases[a].events[b]==eventId){
                                        if(b!=0){
                                            states = ["story", "event"];
                                            event = years[x].seasons[y].regionPhases[z].rulerPhases[a].events[b-1];
                                            console.log("Event: " + event);
                                            data = [data[0],{name: "Event", id: event}]
                                            window.history.pushState({states:states,data:data}, "Event", window.location.href.replace(window.location.href.split("/")[window.location.href.split("/").length-1], `event|event=${event}`))
                                        }else{
                                            let year = x;
                                            let season = y;
                                            let regionPhase = z;
                                            let rulerPhase = a;
                                            let playerTitle = `player-title>currentYear=${year}>currentSeason=${season}>region=${regionPhase}>phase=${rulerPhase}`;
                                            states = ["story", playerTitle];
                                            data = [data[0],data[0]];
                                            console.log(window.location.href.split("/"));
                                            window.history.pushState({states:states,data:data}, "Player Title", window.location.href.replace(window.location.href.split("/")[window.location.href.split("/").length-1], playerTitle+ `|story=${window.location.href.split("/")[3].split("%7C")[1].split("=")[1]}`))
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else if(states[1].includes("to-be-continued")){
                let seasons = years[years.length-1].seasons;
                let regionPhases = seasons[seasons.length-1].regionPhases;
                let rulerPhases = regionPhases[regionPhases.length-1].rulerPhases;
                let events = rulerPhases[rulerPhases.length-1].events;
                let event = events[events.length-1];
                states = ["story", "event"];
                data = [data[0],{name: "Event", id: event}]
                window.history.pushState({states:states,data:data}, "Event", window.location.href.replace(window.location.href.split("/")[window.location.href.split("/").length-1], `event|event=${event}`))
                                        
            }
            await loadState(1,"right");
            console.log("Test: " + states)
            activateButtons();
        }
    })
}

const playerLogin = async function(id){
    $.ajax({
        method: "POST",
        url: "/playerlogin",
        data: {id: id},
        success: async function(res){
            player = res;
            states = ["main","character-home"];
            window.history.pushState({states:states,data:data}, "Character Home Page", `/main/character-home`)
            if(!$("#subnav").length){
                $("nav").after(await load("/component/subnav"),{});
            }
            document.documentElement.style.setProperty('--light', player.colors.light);
            document.documentElement.style.setProperty('--dark', player.colors.dark);
            document.documentElement.style.setProperty('--darker', player.colors.darker);
            document.documentElement.style.setProperty('--highlight', player.colors.highlight);
            document.documentElement.style.setProperty('--background', player.colors.background);
            $("body").css("background-image",`url(/images/${player.background}.jpg)`)
            await loadState(1,"down");
        }
    }) 
}

const playerLogout = function(){
    $.ajax({
        method: "POST",
        url: "/playerlogout",
        success: async function(res){
            player = res;
            $("#subnav").remove();
            document.documentElement.style.setProperty('--light', `#a5a5a5`);
            document.documentElement.style.setProperty('--dark', `#818181`);
            document.documentElement.style.setProperty('--darker', `#727272`);
            document.documentElement.style.setProperty('--highlight', `#5f5b50`);
            document.documentElement.style.setProperty('--background', `#2e2b28`);
            $("body").css("background-image",`url(/images/Ruins.jpg)`)
            //deLoad Player nav bar
        }
    }) 
    player = false;
}
