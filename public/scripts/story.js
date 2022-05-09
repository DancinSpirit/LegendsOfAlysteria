let continueEvent = true;
let invisibleArrow = false;
let playersLoaded = false;
let eventArray = []
let currentStory = false;
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
    let events = eventArray[year];
    for(let x=0; x<events.length; x++){
        events[x] = await events[x];
        $(events[x].id).text(events[x].title)
    }
}

const loadEvents = async function(story){
    return new Promise(async function(resolve){
        for(let year=0; year<story.years.length; year++){
            eventArray.push([]);
            for(let x=0; x<story.years[year].seasons.length; x++){
                for(let y=0; y<story.years[year].seasons[x].regionPhases.length; y++){
                    for(let z=0; z<story.years[year].seasons[x].regionPhases[y].rulerPhases.length; z++){
                        for(let a=0; a<story.years[year].seasons[x].regionPhases[y].rulerPhases[z].events.length; a++){
                                eventArray[year].push(returnEventTitle(story.years[year].seasons[x].regionPhases[y].rulerPhases[z].events[a]));
                                if(a==story.years[year].seasons[x].regionPhases[y].rulerPhases[z].events.length-1)
                                    resolve();
                        }
                    }
                }
            }
        }
    })
}

const loadStory = async function(){
    $("#sub-story").css("display","block");
    if(currentStory._id!=story._id){
        await loadEvents(story);
    }
    currentStory = story;
}

const returnEventTitle = function(id){
    return new Promise(async function(resolve){
        let event = await loadDatabaseObject("Event",id);
        let title = event.title;
        event = {title:event.title,id:`#event-content-${id}`}
        resolve(event);
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

const nextLine = function(){
    if(index<text.length-1){
        index++;
        printLine(text[index]);
    }else{
        $("#right-arrow-box").click();
    }
}

const printLine = async function(sentText){
    $(`#event-${eventId}-height-box`).append(`<p id="height-check-${index}" class="boxtext">${sentText}</p>`);
    if(user.settings.pageScroll){
        pageCheck(eventId, index, sentText);
        createText($(`#page-${pageNum}`),eventId,index,sentText);
        typing = true;
        await typeWriter(`#page-${pageNum}`,"", 0, sentText, index, `#boxtext-${index}`, 1) 
        typing = false;
        loadClickSignifier($(`#page-${pageNum}`));
    }else{
        createText($(`#event-${eventId}`),eventId,index,sentText);
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
    console.log(pageNum);
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