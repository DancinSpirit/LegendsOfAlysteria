let continueEvent = true;
let invisibleArrow = false;
let playersLoaded = false;
let pageNum = 1;
let index = -1;
let typing = false;
let typeInterrupt = false;
let eventInterrupt = false;
let ctrlButton = true;
let enterButton = true;
let screen = true;
let keyButtons = true;
let enterKeyPressed = false;
let duel;
let duelWriteIndex;
let duelIndex;
let duelText;
let duelPageNum;
let duelTyping;
let duelUpdating = false;
let duelTypeInterrupt = false;
let createDuelText;

const removeCustomStyles = async function(){
    if($("#red-style").length){
        $("#red-style").remove();
    }
    if($("#othered-style").length){
        $("#othered-script").remove();
        $("#othered-style").remove();
        $("#tentacle-container").fadeOut();
        $("#tentacle-background-image").fadeOut();
        $("#tentacle-background-color").fadeOut();
    }
}

const loadBackground = async function(url){
    return new Promise((resolve) =>{
        if(url.includes("[TOP]")){
            $('body').css("background-position", "top");
            url = url.replace("[TOP]","");
        }else{
            $('body').css("background-position", "center center");
        }
        $('body').css("background-image", `url('${url}')`);
        resolve();
    })
}

const loadPlayerColors = async function(){
    if(!playersLoaded){
        let players = await loadAllDatabaseObjects("Player");
        for(let x=0; x<players.length; x++){
            let playerColors = document.createElement("style");
            playerColors.innerText = `.${players[x].name.replaceAll(" ","-").replace(",","")}{background-color:${players[x].colors.background}}`
            document.head.appendChild(playerColors);
        }
        playersLoaded = true;
    }
}

const returnEvents = async function(year){
    let events = story.eventNames[year];
    for(let x=0; x<events.length; x++){
        events[x] = await events[x];
        $(events[x].id).text(events[x].title)
        $(events[x].id).attr("index",events[x].index);
    }
}

const expandRegion = function(thisButton){
    $(thisButton).children(".fa-arrow-left-rotate").removeClass("invisible");
    $(thisButton).children(".fa-arrows-left-right").addClass("invisible");
    $(".region-section").addClass("invisible");
    $("#"+$(thisButton).attr("id")+"-region").removeClass("invisible");
    $(".region-phase").css("flex-direction","row");
    $(".ruler-phase").css("width", "calc(25% - 10px)");
    $(".ruler-phase").css("margin-left", "5px");
    $(".ruler-phase").css("margin-right", "5px");
    $(".region-button").off("click");
    $(".region-button").on("click", function(){
        minimizeRegion(this)
    })
}

const expandSeason = function(thisButton){
    $(thisButton).children(".fa-arrow-left-rotate").removeClass("invisible");
    $(thisButton).children(".fa-arrows-left-right").addClass("invisible");
    $(".season").addClass("invisible");
    $("#season-"+$(thisButton).attr("id")).removeClass("invisible");
    $(".region-container").css("flex-direction","row");
    $(".region-title").css("border-bottom","none");
    $(".region-title").css("padding-bottom","0px");
    $("#season-"+$(thisButton).attr("id")).css("width","100%");
    $(".region-button").removeClass("invisible");
    $(".expand-button").off("click");
    $(".expand-button").on("click", function(){
        minimizeSeason(this)
    })
}
const minimizeSeason = function(thisButton){
    $(".season").removeClass("invisible");
    $(thisButton).children(".fa-arrow-left-rotate").addClass("invisible");
    $(thisButton).children(".fa-arrows-left-right").removeClass("invisible");
    $(".region-container").css("flex-direction","column");
    $(".region-title").css("border-bottom","solid white 2px");
    $(".region-title").css("padding-bottom","10px");
    $("#"+$(thisButton).attr("id")+"-season").css("width","25%");
    $(".region-button").addClass("invisible");
    $(".expand-button").off("click");
    $(".expand-button").on("click", function(){
        expandSeason(this)
    })
}
const minimizeRegion = function(thisButton){
    $(".region-section").removeClass("invisible");
    $(thisButton).children(".fa-arrow-left-rotate").addClass("invisible");
    $(thisButton).children(".fa-arrows-left-right").removeClass("invisible");
    $(".region-phase").css("flex-direction","column");
    $(".ruler-phase").css("width", "auto");
    $(".ruler-phase").css("margin-left", "0px");
    $(".ruler-phase").css("margin-right", "0px");
    $(".region-button").off("click");
    $(".region-button").on("click", function(){
        expandRegion(this)
    })
}

/* Event Scripts Below This Point */
const activateTitleClick = function(){
    buttons.playerBox = function(){
        $("#player-box").off("click");
        $("#player-box").on("click", async function(){
            $("#right-arrow-box").click();
        })
    }
    buttons.playerBox();
}

const loadEvent = function(){
    buttons.playerBox = function(){
        $("#player-box").off("click")
        $("#player-box").on("click", function(){
            if(continueEvent){
                $("#click-signifier").remove();
                eventInterrupt = false;
                $("#player-box").off("click");
                $(".big-boy").css("transition",user.settings.pageSpeed);
                $(".big-boy").height(0);
                setTimeout(function(){
                    nextLine();
                    $("#player-box").on("click", function(){
                        if(typing){
                            typing = false;
                            typeInterrupt = true;
                        }else{
                            if(continueEvent){
                                typing = false;
                                typeInterrupt = false;
                                $("#click-signifier").remove();
                                nextLine();  
                            }
                        }
                    })
                },user.settings.pageSpeed+100);
            }   
        })
    }
    buttons.playerBox();
}

const applyClass = async function(sentText, eventId, index, clas, newPageBoolean){
    $(`#event-${eventId}-height-box`).append(`<p id="height-check-${index}" class="boxtext">${sentText}</p>`);
        if(user.settings.pageScroll){
            if(newPageBoolean){
                newPage(eventId);
            }else{
                pageCheck(eventId, index, sentText);
            }
            createText($(`#page-${pageNum}`),eventId,index,sentText);
        }else{
            createText($(`#event-${eventId}`),eventId,index,sentText);
        }
    $(`#boxtext-${index}`).addClass(clas)
    printLine(sentText);
}

const nextLine = async function(){
    if(index<text.length-1){
        index++;
        if(text[index].includes("[")){
            let command = text[index].replace("[","").split(`]`)[0];
            let sentText = text[index].replace("[","").split(`${command}]`)[1];
            switch(command){
                case "WARP":
                    $("head").append(`<link id="warp-style" rel="stylesheet" href="/styles/warp.css">`)
                    break;
                case "UNWARP":
                    $("#warp-style").remove();
                    break;
                case "GRAYSCALE":
                    $("html").css("filter","grayscale(1)")
                    nextLine();
                    break;
                case "GRAYSCALE RETURN":
                    $("html").css("filter","none")
                    nextLine();
                    break;
                case "INVERT":
                    $("body").css("filter","invert(1)");
                    nextLine();
                    break;
                case "CONTRAST":
                    $("body").css("filter","contrast(.8)");
                    nextLine();
                    break;
                case "CONTRAST RETURN":
                    $("body").css("filter","none");
                    nextLine();
                    break;
                case "SCENE TRANSITION":
                    await loadBackground("/images/" + sentText + ".jpg")
                    nextLine();
                    break;
                case "PHILOSOPHER":
                    applyClass(sentText, eventId, index, "philosopher", true);
                    break;
                case "CORSIVA":
                    applyClass(sentText, eventId, index, "corsiva");
                    break;
                case "INDIE FLOWER":
                    applyClass(sentText, eventId, index, "indie-flower");
                    break;
                case "CAVEAT":
                    applyClass(sentText, eventId, index, "caveat");
                    break;
                case "SATISFY":
                    applyClass(sentText, eventId, index, "satisfy");
                    break;
                case "CENTERED":
                    applyClass(sentText, eventId, index, "centered");
                    break;
                case "EXTRA PADDING":
                    applyClass(sentText, eventId, index, "extra-padding");
                    break;
                case "LAST PADDING":
                    $(`#event-${eventId}-height-box`).append(`<p id="height-check-${index}" class="boxtext" style="padding-bottom:0px">${sentText}</p>`);
                    if(user.settings.pageScroll){
                        $(`#page-${pageNum}`).append(`<p id="boxtext-${index}" style="height: auto" class="boxtext">${sentText}</p>`);
                    }else{
                        $(`#page-${pageNum}`).append(`<p id="boxtext-${index}" style="height: auto" class="boxtext">${sentText}</p>`);
                    }
                    break;
                case "FIRST PADDING":
                    $(`#event-${eventId}-height-box`).append(`<p id="height-check-${index}" class="boxtext" style="padding-bottom:0px">${sentText}</p>`);
                    if(user.settings.pageScroll){
                        pageCheck(eventId, index, sentText);
                        $(`#page-${pageNum}`).append(`<p id="boxtext-${index}" class="no-padding"style="height: auto" class="boxtext">${sentText}</p>`);
                    }else{
                        $(`#page-${pageNum}`).append(`<p id="boxtext-${index}" class="no-padding" style="height: auto" class="boxtext">${sentText}</p>`);
                    }
                    nextLine();
                    break;
                case "NO PADDING":
                    $(`#event-${eventId}-height-box`).append(`<p id="height-check-${index}" class="boxtext" style="padding-bottom:0px">${sentText}</p>`);
                    if(user.settings.pageScroll){
                        $(`#page-${pageNum}`).append(`<p id="boxtext-${index}" class="no-padding"style="height: auto" class="boxtext">${sentText}</p>`);
                    }else{
                        $(`#page-${pageNum}`).append(`<p id="boxtext-${index}" class="no-padding" style="height: auto" class="boxtext">${sentText}</p>`);
                    }
                    nextLine();
                    break;
                case "PURPLE NO PADDING":
                    $(`#event-${eventId}-height-box`).append(`<p id="height-check-${index}" class="boxtext" style="padding-bottom:0px">${sentText}</p>`);
                    if(user.settings.pageScroll){
                        $(`#page-${pageNum}`).append(`<p id="boxtext-${index}" class="no-padding"style="height: auto" class="boxtext">${sentText}</p>`);
                        $("#boxtext-"+index).css("color","pink");
                    }else{
                        $(`#page-${pageNum}`).append(`<p id="boxtext-${index}" class="no-padding" style="height: auto" class="boxtext">${sentText}</p>`);
                        $("#boxtext-"+index).css("color","pink");
                    }
                    nextLine();
                    break;
                case "RECEDING":
                    text1 = sentText.split("<RECEDE>")[0];
                    text2 = sentText.split("<RECEDE>")[1];
                    text3 = sentText.split("<RECEDE>")[2];
                    text4 = sentText.split("<RECEDE>")[3];
                    $(`#event-${eventId}-height-box`).append(`<p id="height-check-${index}" class="boxtext">${sentText}</p>`);
                    if(user.settings.pageScroll){
                        pageCheck(eventId, index, sentText);
                        $(`#page-${pageNum}`).append(`<p id="boxtext-${index}" style="height: ${$(`#height-check-${index}`).height()+36}px" class='boxtext'><span id="boxtext-${index}-1"></span><span class='receded-1' id="boxtext-${index}-2"></span><span class='receded-2' id="boxtext-${index}-3"></span><span class='receded-3' id="boxtext-${index}-4"></span></p>`);
                        typing = true;
                        await typeWriter(`#page-${pageNum}`,"", 0, text1,index,`#boxtext-${index}-1`, 1, {text2:{id:`#boxtext-${index}-2`,text:text2},text3:{id:`#boxtext-${index}-3`,text:text3},text4:{id:`#boxtext-${index}-4`,text:text4}}, true);
                        await typeWriter(`#page-${pageNum}`,"", 0, text2,index,`#boxtext-${index}-2`, 1, {text3:{id:`#boxtext-${index}-3`,text:text3},text4:{id:`#boxtext-${index}-4`,text:text4}},true);
                        await typeWriter(`#page-${pageNum}`,"", 0, text3,index,`#boxtext-${index}-3`, 1, {text4:{id:`#boxtext-${index}-4`,text:text4}},true);
                        await typeWriter(`#page-${pageNum}`,"", 0, text4,index,`#boxtext-${index}-4`, 1);
                        typing = false;
                        loadClickSignifier($(`#page-${pageNum}`));
                    }else{
                        $(`#event-${eventId}`).append(`<p id="boxtext-${index}" style="height: ${$(`#height-check-${index}`).height()+36}px" class='boxtext'><span id="boxtext-${index}-1"></span><span class='shadows' id="boxtext-${index}-2"></span><span id="boxtext-${index}-3"></span></p>`);
                        typing = true;
                        await typeWriter(`#event-${eventId}`,"", 0, text1,index,`#boxtext-${index}-1`, 1, {text2:{id:`#boxtext-${index}-2`,text:text2},text3:{id:`#boxtext-${index}-3`,text:text3},text4:{id:`#boxtext-${index}-4`,text:text4}}, true);
                        await typeWriter(`#event-${eventId}`,"", 0, text2,index,`#boxtext-${index}-2`, 1, {text3:{id:`#boxtext-${index}-3`,text:text3},text4:{id:`#boxtext-${index}-4`,text:text4}},true);
                        await typeWriter(`#event-${eventId}`,"", 0, text3,index,`#boxtext-${index}-3`, 1, {text4:{id:`#boxtext-${index}-4`,text:text4}},true);
                        await typeWriter(`#event-${eventId}`,"", 0, text4,index,`#boxtext-${index}-4`, 1);
                        typing = false;
                        loadClickSignifier($(`#event-${eventId}`));
                    }
                    break;
                case "ORK":
                    $(`#event-${eventId}-height-box`).append(`<p id="height-check-${index}" class="boxtext">${sentText}</p>`);
                    if(sentText.startsWith("<")){
                        sentText = sentText.replace("<","").replace(">","");
                       if(user.settings.pageScroll){
                            pageCheck(eventId, index, sentText);
                            $(`#page-${pageNum}`).append(`<p id="boxtext-${index}" class='boxtext ork' style="height: ${$(`#height-check-${index}`).height()+36}px"></p>`);
                            typing = true;
                            await typeWriter(`#page-${pageNum}`,"", 0, sentText,index,`#boxtext-${index}`, 1);
                            typing = false;
                            loadClickSignifier($(`#page-${pageNum}`));
                        }else{
                            $(`#event-${eventId}`).append(`<p id="boxtext-${index}" class='boxtext ork' style="height: ${$(`#height-check-${index}`).height()+36}px"></p>`);
                            typing = true;
                            await typeWriter(`#event-${eventId}`,"", 0, sentText,index,`#boxtext-${index}`, 1);
                            typing = false;
                            loadClickSignifier($(`#event-${eventId}`));
                        }
                    }else{
                        text1 = sentText.split("<")[0] + " ";
                        text2 = sentText.split("<")[1].split(">")[0];
                        text3 = sentText.split(">")[1];
                        if(user.settings.pageScroll){
                            pageCheck(eventId, index, sentText);
                            $(`#page-${pageNum}`).append(`<p id="boxtext-${index}" class='boxtext' style="height: ${$(`#height-check-${index}`).height()+36}px"><span id="boxtext-${index}-1"></span><span class='ork' id="boxtext-${index}-2"></span><span id="boxtext-${index}-3"></span></p>`);
                            typing = true;
                            await typeWriter(`#page-${pageNum}`,"", 0, text1,index,`#boxtext-${index}-1`, 1, {text2:{id:`#boxtext-${index}-2`,text:text2},text3:{id:`#boxtext-${index}-3`,text:text3}});
                            await typeWriter(`#page-${pageNum}`,"", 0, text2,index,`#boxtext-${index}-2`, 20, {text3:{id:`#boxtext-${index}-3`,text:text3}});
                            await typeWriter(`#page-${pageNum}`,"", 0, text3,index,`#boxtext-${index}-3`, 1);
                            typing = false;
                            loadClickSignifier($(`#page-${pageNum}`));
                        }else{
                            $(`#event-${eventId}`).append(`<p id="boxtext-${index}" class='boxtext' style="height: ${$(`#height-check-${index}`).height()+36}px"><span id="boxtext-${index}-1"></span><span class='ork' id="boxtext-${index}-2"></span><span id="boxtext-${index}-3"></span></p>`);
                            typing = true;
                            await typeWriter(`#event-${eventId}`,"", 0, text1,index,`#boxtext-${index}-1`, 1, {text2:{id:`#boxtext-${index}-2`,text:text2},text3:{id:`#boxtext-${index}-3`,text:text3}});
                            await typeWriter(`#event-${eventId}`,"", 0, text2,index,`#boxtext-${index}-2`, 20, {text3:{id:`#boxtext-${index}-3`,text:text3}});
                            await typeWriter(`#event-${eventId}`,"", 0, text3,index,`#boxtext-${index}-3`, 1);
                            typing = false;
                            loadClickSignifier($(`#event-${eventId}`));
                        }
                    }
                    break;
                case "OTHER":
                    $(`#event-${eventId}-height-box`).append(`<p id="height-check-${index}" class="boxtext">${sentText}</p>`);
                    if(sentText.startsWith("<")){
                        sentText = sentText.replace("<","").replace(">","");
                       if(user.settings.pageScroll){
                            pageCheck(eventId, index, sentText);
                            $(`#page-${pageNum}`).append(`<p id="boxtext-${index}" class='boxtext other' style="height: ${$(`#height-check-${index}`).height()+36}px"></p>`);
                            typing = true;
                            await typeWriter(`#page-${pageNum}`,"", 0, sentText,index,`#boxtext-${index}`, 20);
                            typing = false;
                            loadClickSignifier($(`#page-${pageNum}`));
                        }else{
                            $(`#event-${eventId}`).append(`<p id="boxtext-${index}" class='boxtext other' style="height: ${$(`#height-check-${index}`).height()+36}px"></p>`);
                            typing = true;
                            await typeWriter(`#event-${eventId}`,"", 0, sentText,index,`#boxtext-${index}`, 20);
                            typing = false;
                            loadClickSignifier($(`#event-${eventId}`));
                        }
                    }else{
                        text1 = sentText.split("<")[0] + " ";
                        text2 = sentText.split("<")[1].split(">")[0];
                        text3 = sentText.split(">")[1];
                        if(user.settings.pageScroll){
                            pageCheck(eventId, index, sentText);
                            $(`#page-${pageNum}`).append(`<p id="boxtext-${index}" class='boxtext' style="height: ${$(`#height-check-${index}`).height()+36}px"><span id="boxtext-${index}-1"></span><span class='other' id="boxtext-${index}-2"></span><span id="boxtext-${index}-3"></span></p>`);
                            typing = true;
                            await typeWriter(`#page-${pageNum}`,"", 0, text1,index,`#boxtext-${index}-1`, 1, {text2:{id:`#boxtext-${index}-2`,text:text2},text3:{id:`#boxtext-${index}-3`,text:text3}});
                            await typeWriter(`#page-${pageNum}`,"", 0, text2,index,`#boxtext-${index}-2`, 20, {text3:{id:`#boxtext-${index}-3`,text:text3}});
                            await typeWriter(`#page-${pageNum}`,"", 0, text3,index,`#boxtext-${index}-3`, 1);
                            typing = false;
                            loadClickSignifier($(`#page-${pageNum}`));
                        }else{
                            $(`#event-${eventId}`).append(`<p id="boxtext-${index}" class='boxtext' style="height: ${$(`#height-check-${index}`).height()+36}px"><span id="boxtext-${index}-1"></span><span class='other' id="boxtext-${index}-2"></span><span id="boxtext-${index}-3"></span></p>`);
                            typing = true;
                            await typeWriter(`#event-${eventId}`,"", 0, text1,index,`#boxtext-${index}-1`, 1, {text2:{id:`#boxtext-${index}-2`,text:text2},text3:{id:`#boxtext-${index}-3`,text:text3}});
                            await typeWriter(`#event-${eventId}`,"", 0, text2,index,`#boxtext-${index}-2`, 20, {text3:{id:`#boxtext-${index}-3`,text:text3}});
                            await typeWriter(`#event-${eventId}`,"", 0, text3,index,`#boxtext-${index}-3`, 1);
                            typing = false;
                            loadClickSignifier($(`#event-${eventId}`));
                        }
                    }
                    break;
                case "RED":
                    $(`#event-${eventId}-height-box`).append(`<p id="height-check-${index}" class="boxtext">${sentText}</p>`);
                    if(sentText.startsWith("<")){
                        sentText = sentText.replace("<","").replace(">","");
                       if(user.settings.pageScroll){
                            pageCheck(eventId, index, sentText);
                            $(`#page-${pageNum}`).append(`<p id="boxtext-${index}" class='boxtext red' style="height: ${$(`#height-check-${index}`).height()+36}px"></p>`);
                            typing = true;
                            await typeWriter(`#page-${pageNum}`,"", 0, sentText,index,`#boxtext-${index}`, 20);
                            typing = false;
                            loadClickSignifier($(`#page-${pageNum}`));
                        }else{
                            $(`#event-${eventId}`).append(`<p id="boxtext-${index}" class='boxtext red' style="height: ${$(`#height-check-${index}`).height()+36}px"></p>`);
                            typing = true;
                            await typeWriter(`#event-${eventId}`,"", 0, sentText,index,`#boxtext-${index}`, 20);
                            typing = false;
                            loadClickSignifier($(`#event-${eventId}`));
                        }
                    }else{
                        text1 = sentText.split("<")[0] + " ";
                        text2 = sentText.split("<")[1].split(">")[0];
                        text3 = sentText.split(">")[1];
                        if(user.settings.pageScroll){
                            pageCheck(eventId, index, sentText);
                            $(`#page-${pageNum}`).append(`<p id="boxtext-${index}" class='boxtext' style="height: ${$(`#height-check-${index}`).height()+36}px"><span id="boxtext-${index}-1"></span><span class='red' id="boxtext-${index}-2"></span><span id="boxtext-${index}-3"></span></p>`);
                            typing = true;
                            await typeWriter(`#page-${pageNum}`,"", 0, text1,index,`#boxtext-${index}-1`, 1, {text2:{id:`#boxtext-${index}-2`,text:text2},text3:{id:`#boxtext-${index}-3`,text:text3}});
                            await typeWriter(`#page-${pageNum}`,"", 0, text2,index,`#boxtext-${index}-2`, 20, {text3:{id:`#boxtext-${index}-3`,text:text3}});
                            await typeWriter(`#page-${pageNum}`,"", 0, text3,index,`#boxtext-${index}-3`, 1);
                            typing = false;
                            loadClickSignifier($(`#page-${pageNum}`));
                        }else{
                            $(`#event-${eventId}`).append(`<p id="boxtext-${index}" class='boxtext' style="height: ${$(`#height-check-${index}`).height()+36}px"><span id="boxtext-${index}-1"></span><span class='red' id="boxtext-${index}-2"></span><span id="boxtext-${index}-3"></span></p>`);
                            typing = true;
                            await typeWriter(`#event-${eventId}`,"", 0, text1,index,`#boxtext-${index}-1`, 1, {text2:{id:`#boxtext-${index}-2`,text:text2},text3:{id:`#boxtext-${index}-3`,text:text3}});
                            await typeWriter(`#event-${eventId}`,"", 0, text2,index,`#boxtext-${index}-2`, 20, {text3:{id:`#boxtext-${index}-3`,text:text3}});
                            await typeWriter(`#event-${eventId}`,"", 0, text3,index,`#boxtext-${index}-3`, 1);
                            typing = false;
                            loadClickSignifier($(`#event-${eventId}`));
                        }
                    }
                    break;
                case "OTHERED":
                    updateTentacles=true;
                    $("#player-box").css("transition","5000ms");
                    $("head").append(`<link id="othered-style" rel="stylesheet" href="/styles/othered.css">`);
                    $("head").append(`<script id="othered-script"src="/scripts/tentacles.js"></script>`);
                    $("#tentacle-container").fadeIn();
                    $("#tentacle-background-image").fadeIn();
                    $("#tentacle-background-color").fadeIn();
                    setTimeout(function(){
                        $("#player-box").css("transition","0ms");
                    },5000)
                    nextLine();
                    break;
                case "CUTAWAY IMAGE":
                    ctrlButton = false;
                    enterButton = false;
                    $("#cutaway-subtitle").css("display","block")
                    $("#cutaway-image").css("background-image", `url(${sentText.replace("[CUTAWAY IMAGE]","").split("|")[0]})`)
                    $("#cutaway-image-collection").append(`<section class="cutaway-image-container"><div id="${sentText.split("|")[1].replace(/<strong>/g,"").replace(/<\/strong>/g,"")}" class='cutaway-image'></div><div class="cutaway-image-subtitle">${sentText.split("|")[1]}</div></section>`)
                    $("#cutaway-image").css("background-repeat", `no-repeat`)
                    $("#cutaway-image").css("background-size", `contain`)
                    $("#cutaway-image").css("background-position", `center`)
                    $("#cutaway-image").fadeIn();
                    $("#cutaway-subtitle").html(sentText.split("|")[1])
                    $("#cutaway-subtitle").fadeIn();
                    $("#cutaway-image-container").css("display","flex");
                    $("#cutaway-image-container").on("click", function(){
                        $("#cutaway-image").fadeOut();
                        $("#cutaway-subtitle").fadeOut();
                        ctrlButton = true;
                        enterButton = true;
                        setTimeout(function(){
                            $("#cutaway-image-container").css("display","none");
                            $("#cutaway-subtitle").css("display","none");
                        },500)
                    })
                    break;
                case "FADE TO BLACK":
                    $("#sub-base").css("transition","5000ms");
                    $("#sub-base").css("background-color","black");
                    nextLine();
                    break;
                case "PLAYER ACTION":
                    //Description|Title|NUMofOPTIONS|{OPTIONS WITH CHOSEN OPTION HAVING [CHOSEN]}
                    $("#choice").empty();
                    $("#choice").css("color","white");
                    $("#choice-container").css("border-color","white");
                    ctrlButton = false;
                    enterButton = false;
                    let numberOfOptions = parseInt(sentText.split("|")[2]);
                    $("#choice").append(`<p class='choice-title'>${sentText.split("|")[1]}</p>`)
                    $("#choice").append(`<p class='choice-description'>${sentText.split("|")[0]}</p>`)
                    for(let x=0; x<numberOfOptions; x++){
                        if(sentText.split("|")[x+3].startsWith("[CHOSEN]")){
                            $("#choice").append(`<div class='choice-option chosen-option'>${sentText.split("|")[x+3].replace("[CHOSEN]","")}</div>`)
                            $(".chosen-option").on("click",function(){
                                $("#choice-container").css("display","none");
                                ctrlButton = true;
                                enterButton = true;
                            })
                        }
                        else
                        $("#choice").append(`<div class='choice-option unchosen-option'>${sentText.split("|")[x+3]}</div>`)
                    }
                    $("#choice-container").css("display","flex");
                    break;
                case "REWARD":
                    //Name|Reward Details|player Color Id
                    $("#choice").empty();
                    $("#choice").css("color","black");
                    ctrlButton = false;
                    enterButton = false;
                    const component = await loadComponent("rewards",false,{name:sentText.split("|")[0],rewards:sentText.split("|")[1]});
                    const player = await loadDatabaseObject("Player",sentText.split("|")[2]);
                    document.documentElement.style.setProperty('--light', player.colors.light);
                    document.documentElement.style.setProperty('--dark', player.colors.dark);
                    document.documentElement.style.setProperty('--darker', player.colors.darker);
                    document.documentElement.style.setProperty('--highlight', player.colors.highlight);
                    document.documentElement.style.setProperty('--background', player.colors.background);
                    $("#choice").append(component);
                    $("#choice").append(`<p class='continue-button'>Continue</p>`);
                    $(".continue-button").on("click",function(){
                        $("#choice-container").css("display","none");
                        ctrlButton = true;
                        enterButton = true;
                    })
                    $("#choice-container").css("display","flex");
                    break;
                case "MUSIC":
                    await loadMusic(sentText);
                    nextLine();
                    break;
                case "MUSIC STOP":
                    stopAudio(song);
                    nextLine();
                    break;
                case "SOUND EFFECT":
                    playSound(sentText);
                    nextLine();
                    break;
                case "ONOMATOPOEIA":
                    playSound(sentText);
                    sentText = "<i>" + sentText + "</i>";
                    $(`#event-${eventId}-height-box`).append(`<p id="height-check-${index}" class="boxtext">${sentText}</p>`);
                    if(user.settings.pageScroll){
                        pageCheck(eventId, index, sentText);
                        createText($(`#page-${pageNum}`),eventId,index,sentText);
                    }else{
                        createText($(`#event-${eventId}`),eventId,index,sentText);
                    }
                    printLine(sentText); 
                    break;
                case "DUCHY":
                    //DuchyName|DuchyRuler|OfficialStance|DiplomatyicStance|InfoLevel|Description
                    $(`#page-${pageNum}`).append(`<section id="duchy"><section id = "duchy-text"><div id="duchy-symbol"></div></section><section id = "duchy-image"></section></section>`)
                    let url = "/images/" + sentText.split("|")[0] + ".jpg"
                    $("#duchy-image").css("background-image", `url(${url})`)
                    $("#duchy-image").css("background-repeat", `no-repeat`)
                    $("#duchy-image").css("background-size", `contain`)
                    $("#duchy-image").css("background-position", `center`)
                    url = "/images/" + sentText.split("|")[0] + "Symbol.jpg"
                    $("#duchy-symbol").css("background-image", `url(${url})`)
                    $("#duchy-symbol").css("background-repeat", `no-repeat`)
                    $("#duchy-symbol").css("background-size", `contain`)
                    $("#duchy-symbol").css("background-position", `center`)
                    $("#duchy-text").append(`<p class="duchy-info-p"><strong>Ruler:</strong> ${sentText.split("|")[1]}</p>`)
                    $("#duchy-text").append(`<p class="duchy-info-p"><strong>Official Stance:</strong> ${sentText.split("|")[2]}</p>`)
                    $("#duchy-text").append(`<p class="duchy-info-p"><strong>Diplomatic Relations:</strong> ${sentText.split("|")[3]}</p>`)
                    $("#duchy-text").append(`<p class="duchy-info-p"><strong>Information Level:</strong> ${sentText.split("|")[4]}</p>`)
                    $("#duchy-text").append(`<p class="duchy-descript-p"><strong>Description:</strong> ${sentText.split("|")[5]}</p>`)
                    $("#duchy-symbol").height($("#player-box").height() - $("#duchy-text").height())
                    break;
                case "ACTIONS":
                    //[ACTIONS]actionsId|playerId (playerId for colors)
                    if(!$("#actions-style").length){
                        $("head").append(`<link id="actions-style" rel="stylesheet" href="/styles/actions.css">`)
                    }
                    $("#title-box-event").css("transition",user.settings.pageSpeed + "ms");
                    $("#title-box-event").css("transform", "translateY(-100%)");
                    setTimeout(function(){
                        $("#title-box-event").css("transition","0ms");
                        $("#title-box-event").css("transform", "translateY(0%)");
                    },user.settings.pageSpeed)
                    let playerC = await loadDatabaseObject("Player",sentText.split("|")[1])
                    document.documentElement.style.setProperty('--Olight', playerC.colors.light);
                    document.documentElement.style.setProperty('--Odark', playerC.colors.dark);
                    document.documentElement.style.setProperty('--Odarker', playerC.colors.darker);
                    document.documentElement.style.setProperty('--Ohighlight', playerC.colors.highlight);
                    document.documentElement.style.setProperty('--background', playerC.colors.background);
                    document.documentElement.style.setProperty('--light', `color-mix(in srgb, var(--Olight)80%, black)`);
                    document.documentElement.style.setProperty('--dark', `color-mix(in srgb, var(--Odark)80%, black)`);
                    document.documentElement.style.setProperty('--darker', `color-mix(in srgb, var(--Odarker)80%, black)`);
                    document.documentElement.style.setProperty('--highlight',`color-mix(in srgb, var(--Ohighlight)80%, black)`);
                    document.documentElement.style.setProperty('--dark-background',`color-mix(in srgb, var(--background)70%, black)`)
                    let action = await loadComponent("actions",[{name: "Actions",id:sentText.split("|")[0]}])
                    if(user.settings.pageScroll){
                        $(`#page-${pageNum}`).append(action);
                    }else{
                        $(`#event-${eventId}`).append(action);
                    }
                    $("#actions-page").on("click",function(event){
                        event.stopPropagation();
                    })
                    $("#sub-story").scrollTop($("#sub-story").prop("scrollHeight"));
                    break;
                case "CHARACTER":
                    //starting-sheet|Characterinfo-ID|Player-ID|stat-sheet-boolean|combat-sheet-boolean|spirit-sheet-boolean|hero-sheet-boolean
                    if(!$("#character-style").length){
                        $("head").append(`<link id="character-style" rel="stylesheet" href="/styles/character.css">`)
                    }
                    $("#title-box-event").css("transition",user.settings.pageSpeed + "ms");
                    $("#title-box-event").css("transform", "translateY(-100%)");
                    setTimeout(function(){
                        $("#title-box-event").css("transition","0ms");
                        $("#title-box-event").css("transform", "translateY(0%)");
                    },user.settings.pageSpeed)
                    let startingSheet = sentText.split("|")[0];
                    let characterInfoId = sentText.split("|")[1];
                    let playerId = sentText.split("|")[2];
                    let statSheet = sentText.split("|")[3];
                    let combatSheet = sentText.split("|")[4];
                    let spiritSheet = sentText.split("|")[5];
                    let heroSheet = sentText.split("|")[6];
                    characterInfo = await loadComponent("character",[{name: "Characterinfo",id:characterInfoId},{name:"Player",id:playerId}],{statSheet:statSheet,combatSheet:combatSheet,spiritSheet:spiritSheet,heroSheet:heroSheet})
                    if(user.settings.pageScroll){
                        $(`#page-${pageNum}`).append(characterInfo);
                    }else{
                        $(`#event-${eventId}`).append(characterInfo);
                    }
                    $("#character").on("click",function(event){
                        event.stopPropagation();
                    })
                    oldStates = states;
                    oldDatabaseObjects = databaseObjects;
                    oldCustomData = customData;
                    states = ["story","event","character",startingSheet];
                    databaseObjects = [databaseObjects[0],databaseObjects[1],[{name: "Characterinfo",id:characterInfoId},{name:"Player",id:playerId}],[{name: "Characterinfo",id:characterInfoId},{name:"Player",id:playerId}]];
                    customData = [customData[0],customData[1],{statSheet:statSheet,combatSheet:combatSheet,spiritSheet:spiritSheet,heroSheet:heroSheet},false]
                    $("#sub-story").scrollTop($("#sub-story").prop("scrollHeight"));
                    await loadState(3);
                    break;
                case "DUEL":
                    duelUpdating = true;
                    if(isMobile){
                        if(!$(`#duel-style`).length){
                            $("head").append(`<link id="duel-style" rel="stylesheet" href="/phone-styles/duel.css">`)
                        }
                    }else{
                        if(!$(`#duel-style`).length){
                            $("head").append(`<link id="duel-style" rel="stylesheet" href="/styles/duel.css">`)
                        }
                    }
                    duelWindow = await loadComponent("duel")
                    $("#sub-story").before(`<div id='duel-window'>${duelWindow}</div>`)
                    //load CSS colors for each combatant and load the duel data etc.
                    $(".background-1").css("background-color","#8b0000");
                    $(".darker-1").css("background-color","#cc4125");
                    $(".dark-1").css("background-color","#dd7e6b");
                    $(".light-1").css("background-color","#e6b8af");
                    $(".background-2").css("background-color","#674ea7");
                    $(".darker-2").css("background-color","#8e7cc3");
                    $(".dark-2").css("background-color","#b4a7d6");
                    $(".light-2").css("background-color","#d9d2e9");
                    $("#duel-window").css("animation","battlewindow-transform 1000ms linear");
                    $("#sub-story").css("animation","battlestory-transform 1000ms linear");
                    setTimeout(function(){
                        $("#sub-story").css("height","20%");
                        $("#duel-window").css("height","30%");
                    },1000)
                    let duelData = await loadDatabaseObject("Duel",sentText.split("|")[1])
                    duelData.combatants[0] = await loadDatabaseObject("Combatant",duelData.combatants[0])
                    duelData.combatants[1] = await loadDatabaseObject("Combatant",duelData.combatants[1])
                    duel = new Battle("duel",[duelData.combatants[0], duelData.combatants[1]])
                    break;
                case "DUEL COMMAND":
                    if(duelTyping||duelUpdating){
                        duelTyping = false;
                        duelTypeInterrupt = true;
                        index--;
                    }else{
                        duelUpdating = true;
                        sentText = sentText.replace(/“/g,"'")
                        sentText = sentText.replace(/”/g,"'");
                        eval(`duel.${sentText}`);
                        nextLine();
                    }
                    break;
                case "DUEL PROGRESS":
                    if(duelTyping||duelUpdating){
                        duelTyping = false;
                        duelTypeInterrupt = true;
                        index--;
                    }else{
                        duelTyping = false;
                        duelTypeInterrupt = false;
                        let updateDuel = new CustomEvent(`duel-progress`)
                        window.dispatchEvent(updateDuel);
                        nextLine();
                    }
                    break;
                case "STAT UPDATE":
                    //[STAT UPDATE]stat-type(must be lowercase)|mana-remaining|mana-max|action-dexcrittion
                    $(`#event-${eventId}-height-box`).append(` 
                    <section id="stat-box-${index}" class="rowD stat-row-load">
                        ${sentText.split("|")[3]}
                        <section class="row-cell stat-name">
                        Remaining ${sentText.split("|")[0].charAt(0).toUpperCase() + sentText.split("|")[0].slice(1)}:
                        </section>
                        <section id="character-mana-${index}" class="row-cell stat-bar">
                        </section>
                    </section>`)
                    for(let x=0; x<sentText.split("|")[1]; x++){
                        $("#character-mana-"+ index).append(`<div class="stat-tick ${sentText.split("|")[0]}-tick">
                        </div>`)
                    }
                    for(let x=sentText.split("|")[1]; x<sentText.split("|")[2]; x++){
                        $("#character-mana-"+ index).append(`<div class="stat-tick empty-tick">
                        </div>`)
                    }
                    $("#stat-box-"+ index).append(`<span class="stat-number">
                        ${sentText.split("|")[1]}/${sentText.split("|")[2]}
                    </span>`)
                    $(`#page-${pageNum}`).append($("#stat-box-" + index));
                    break;
                case "EMPTY":
                    $(`#event-${eventId}-height-box`).append(`<p id="height-check-${index}" class="boxtext"></p>`);
                    if(user.settings.pageScroll){
                        pageCheck(eventId, index, "");
                        createText($(`#page-${pageNum}`),eventId,index,"");
                    }else{
                        createText($(`#event-${eventId}`),eventId,index,"");
                    }
                    printLine(""); 
                    break;
                case "GAMEMASTER":
                    nextLine();
                    break;
                case "AUTO BREAK":
                    //this is to prevent an automatic next line   
                    break; 
                default:
                    $(`#event-${eventId}-height-box`).append(`<p id="height-check-${index}" class="boxtext">${text[index]}</p>`);
                    if(user.settings.pageScroll){
                        pageCheck(eventId, index, text[index]);
                        createText($(`#page-${pageNum}`),eventId,index,text[index]);
                    }else{
                        createText($(`#event-${eventId}`),eventId,index,text[index]);
                    }
                    printLine(text[index]); 
            }
        }else{
            $(`#event-${eventId}-height-box`).append(`<p id="height-check-${index}" class="boxtext">${text[index]}</p>`);
            if(user.settings.pageScroll){
                pageCheck(eventId, index, text[index]);
                createText($(`#page-${pageNum}`),eventId,index,text[index]);
            }else{
                createText($(`#event-${eventId}`),eventId,index,text[index]);
            }
            printLine(text[index]);
        }
    }else{
        $("#right-arrow-box").click();
    }
}

const extractContent = function(s) {
    var span = document.createElement('span');
    span.innerHTML = s;
    return span.textContent || span.innerText;
};

const printLine = async function(sentText){
    if(user.settings.voiceTrue){
/*         console.log(extractContent(sentText))
        asticaVoice(extractContent(sentText),3);   */
        $().articulate('stop');
        let audioText = extractContent(sentText).replace("“","").replace("”","");
        if(googleVoice){
            speechId = Math.random();
            let currentId = speechId;
            for(let x=0; x<audioText.split(". ").length; x++){
                function checkFlag() {
                        if(window.speechSynthesis.speaking == true) {
                            window.setTimeout(checkFlag, 100); 
                         } else {
                            if(speechId==currentId){
                             $(`<span>${audioText.split(". ")[x]}</span>`).articulate("speak");
                            }
                         }
                }
                checkFlag();  
            }
        }else{
            $(`<span>${audioText}</span>`).articulate("speak");
        }
    }
    if(user.settings.pageScroll){
        typing = true;
        await typeWriter(`#page-${pageNum}`,"", 0, sentText, index, `#boxtext-${index}`, 1) 
        typing = false;
        loadClickSignifier($(`#page-${pageNum}`));
    }else{
        typing = true;
        await typeWriter(`#event-${eventId}`,"", 0, sentText, index, `#boxtext-${index}`, 1) 
        typing = false;
        loadClickSignifier($(`#event-${eventId}`));
    }
}

const pageCheck = function(eventId){
    let pageHeight = 0;
    for(let x=0; x<$(`#page-${pageNum}`).children().length; x++){
        if($($(`#page-${pageNum}`).children()[x]).hasClass("big-boy")){

        }else{
            pageHeight = pageHeight+$($(`#page-${pageNum}`).children()[x]).height()+20;
        }
    }
    pageHeight = pageHeight+$(`#height-check-${index}`).height()+20+36;
    if(pageHeight>$("#sub-story").height()){
        newPage(eventId);
    }
}

const newPage = function(eventId){
    $(".big-boy").css("transition","0ms");
    $("#title-box-event").css("transition","0ms");
    $(`#page-${pageNum}`).css("height","auto");
    pageNum++;
    $(`#event-${eventId}`).append(`<section id="page-${pageNum}" class = 'page'></section>`)
}

const createText = function($appendBox, eventId,index,sentText){
    $appendBox.append(`<p id="boxtext-${index}" style="height: ${$(`#height-check-${index}`).outerHeight(true)+36}px" class="boxtext"></p>`);
    if(!user.settings.pageScroll)
    $("#sub-story").scrollTop($("#sub-story").prop("scrollHeight"));
    else
    $("#sub-story").scrollTop($("#sub-story").prop("scrollHeight")-20-$("#sub-story").height());
}

const loadClickSignifier = function($appendBox){
    if(index<text.length-1){ 
            $(`#boxtext-${index}`).css("height",`${$(`#height-check-${index}`).outerHeight(true)}px`)  
            $appendBox.append("<div id='click-signifier'><i class='fas fa-scroll fa-blink'></i></div>")
            $("#click-signifier").css("justify-content","left")
            $("#click-signifier").css("padding-left","25px");
            if(!user.settings.pageScroll)
            $("#sub-story").scrollTop($("#sub-story").prop("scrollHeight"));
            else
            $("#sub-story").scrollTop($("#sub-story").prop("scrollHeight")-20-$("#sub-story").height());
            $(".boxtext").css("height","auto")
    }
}

const typeWriter = async function(appendBox, returnString, i, txt, sentIndex, id, speedMod, otherText) {
    return new Promise((resolve) =>{
        if (i < txt.length) {
            returnChar = txt.charAt(i);
            returnString += returnChar;
        for(let x=2; x<=speedMod; x++){
            if(i+x-1<txt.length)
            returnString += txt.charAt(i+x-1);
            else
            i=txt.length;
        }
        $(id).html(returnString) 
        if(i!=txt.length)
        i+=speedMod;
        }
        if(i==txt.length){
            resolve();
        }else{
            let timeout = setTimeout(function(){typeWriter(appendBox, returnString, i, txt, sentIndex, id, speedMod, otherText).then(resolve)}, user.settings.textSpeed)
            if(index!=sentIndex||typeInterrupt){
                if(otherText){
                    if(otherText.text2){
                        $(otherText.text2.id).text(otherText.text2.text);
                    }
                    if(otherText.text3){
                        $(otherText.text3.id).text(otherText.text3.text);
                    }
                    if(otherText.text4){
                        $(otherText.text4.id).text(otherText.text4.text);
                    }
                }
                $(`#boxtext-${sentIndex}`).css("height",`${$(`#height-check-${sentIndex}`).outerHeight(true)}px`)
                $(id).html(txt) 
                clearTimeout(timeout);
                typeInterrupt = false;
                loadClickSignifier($(appendBox));
            }else if(eventInterrupt){
                clearTimeout(timeout);
            }
        }
    })
}