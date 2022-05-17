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
    $("#"+$(thisButton).attr("id")+"-season").removeClass("invisible");
    $(".region-container").css("flex-direction","row");
    $(".region-title").css("border-bottom","none");
    $(".region-title").css("padding-bottom","0px");
    $("#"+$(thisButton).attr("id")+"-season").css("width","100%");
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
            
        })
    }
    buttons.playerBox();
}

const applyFont = async function(sentText, eventId, index, font){
    $(`#event-${eventId}-height-box`).append(`<p id="height-check-${index}" class="boxtext">${sentText}</p>`);
    if(user.settings.pageScroll){
        newPage(eventId);
        createText($(`#page-${pageNum}`),eventId,index,sentText);
    }else{
        createText($(`#event-${eventId}`),eventId,index,sentText);
    }
    $(`#boxtext-${index}`).addClass(font)
    printLine(sentText);
}

const nextLine = async function(){
    if(index<text.length-1){
        index++;
        if(text[index].includes("[")){
            let [command,sentText] = text[index].replace("[","").split("]");
            switch(command){
                case "PHILOSOPHER":
                    applyFont(sentText, eventId, index, "philosopher");
                    break;
                case "CORSIVA":
                    applyFont(sentText, eventId, index, "corsiva");
                    break;
                case "INDIE FLOWER":
                    applyFont(sentText, eventId, index, "indie-flower");
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
                case "PLAYER ACTION":
                    //Description|Title|NUMofOPTIONS|{OPTIONS WITH CHOSEN OPTION HAVING <CHOSEN>}
                    $("#choice").empty();
                    $("#choice").css("color","white");
                    $("#choice-container").css("border-color","white");
                    ctrlButton = false;
                    enterButton = false;
                    let numberOfOptions = parseInt(sentText.split("|")[2]);
                    $("#choice").append(`<p class='choice-title'>${sentText.split("|")[1]}</p>`)
                    $("#choice").append(`<p class='choice-description'>${sentText.split("|")[0]}</p>`)
                    for(let x=0; x<numberOfOptions; x++){
                        if(sentText.split("|")[x+3].startsWith("<CHOSEN>")){
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
                    //Name|Reward Details|Character Color Id
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
                case "CHARACTER":
                    //starting-sheet|Characterinfo-ID|Player-ID|stat-sheet-boolean|combat-sheet-boolean|spirit-sheet-boolean|hero-sheet-boolean
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
                    document.documentElement.style.setProperty('--light', characterColors.light);
                    document.documentElement.style.setProperty('--dark', characterColors.dark);
                    document.documentElement.style.setProperty('--darker', characterColors.darker);
                    document.documentElement.style.setProperty('--highlight', characterColors.highlight);
                    document.documentElement.style.setProperty('--background', characterColors.background);
                    oldStates = states;
                    oldDatabaseObjects = databaseObjects;
                    oldCustomData = customData;
                    states = ["story","event","character",startingSheet];
                    databaseObjects = [databaseObjects[0],databaseObjects[1],[{name: "Characterinfo",id:characterInfoId},{name:"Player",id:playerId}],[{name: "Characterinfo",id:characterInfoId},{name:"Player",id:playerId}]];
                    customData = [customData[0],customData[1],{statSheet:statSheet,combatSheet:combatSheet,spiritSheet:spiritSheet,heroSheet:heroSheet},false]
                    $("#sub-story").scrollTop($("#sub-story").prop("scrollHeight"));
                    await loadState(3);
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

const printLine = async function(sentText){
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
    if(pageHeight>$("#player-box").height()){
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
    $("#sub-story").scrollTop($("#sub-story").prop("scrollHeight")-20-$("#player-box").height());
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
            $("#sub-story").scrollTop($("#sub-story").prop("scrollHeight")-20-$("#player-box").height());
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