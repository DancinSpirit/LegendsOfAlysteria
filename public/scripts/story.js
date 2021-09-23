let index = -2;
let click = true;
let song = false;
let ctrlButton = true;
let enterButton = true;
let continueEvent = true;
let screen = true;

const activateEventClick = function(){
    $("#player-box").on("click", async function(){
        click = true;
        if(continueEvent)
            await loadEvent();
    })
}
const deactivateEventClick = function(){
    $("#player-box").off("click");
    index = -2;
}

const loadEvent = async function(){
    if(index<text.length-1){
        index++;
        if(index==-1){
            click = false;
            $(".big-boy").css("transition","1000ms");
            $("#title-box-event").css("transition","1000ms");
            $(".big-boy").height("0");
            $("#title-box-event").css("padding-top","20px");
            setTimeout(function(){
                $("#title-box-event").css("transition","0ms");
                $(".big-boy").css("transition","0ms");
                if(!click)
                    loadEvent();
            },1100)
        }else{
            await loadText(text[index]);
        }
    }else{
        index++;
        $("#sub-story").scrollTop($("#sub-story").prop("scrollHeight"));
    }
}

const loadText = async function(sentText){
    $("#click-signifier").remove();
    if(sentText.startsWith("[BACKGROUND IMAGE]")){
        textLine = false;
        await loadBackground(sentText.split("[BACKGROUND IMAGE]")[1]);
        loadEvent();
    }else if(sentText.startsWith("[PHILOSOPHER]")){
        textLine = false;
        $(`#event-${eventId}`).append(`<p id="boxtext-${index}" class='boxtext philosopher'>${sentText.replace("[PHILOSOPHER]","")}</p>`);
        loadClickSignifier();
    }else if(sentText.startsWith("[SCENE TRANSITION]")){
        textLine = false;
        await loadBackground("/images/" + sentText.split("[SCENE TRANSITION]")[1]+".jpg");
        loadEvent();
    }else if(sentText.startsWith("[MUSIC]")){
        textLine = false;
        await loadMusic(sentText.split("[MUSIC]")[1]);
        loadEvent();
    }else if(sentText.startsWith("[MUSIC STOP")){
        textLine = false;
        stopAudio(song);
        loadEvent();
    }else if(sentText.startsWith("[SOUND EFFECT]")){
        textLine = false;
        playSound(sentText.split("[SOUND EFFECT]")[1]);
        loadEvent();
    }else if(sentText.startsWith("[DUCHY]")){
        console.log("HM?")
        textLine = false;
        $(`#event-${eventId}`).append(`<section id="duchy"><section id = "duchy-text"><div id="duchy-symbol"></div></section><section id = "duchy-image"></section></section>`)
        let url = "/images/" + sentText.replace("[DUCHY]","").split("|")[0] + ".jpg"
        $("#duchy-image").css("background-image", `url(${url})`)
        $("#duchy-image").css("background-repeat", `no-repeat`)
        $("#duchy-image").css("background-size", `contain`)
        $("#duchy-image").css("background-position", `center`)
        url = "/images/" + sentText.replace("[DUCHY]","").split("|")[0] + "Symbol.jpg"
        $("#duchy-symbol").css("background-image", `url(${url})`)
        $("#duchy-symbol").css("background-repeat", `no-repeat`)
        $("#duchy-symbol").css("background-size", `contain`)
        $("#duchy-symbol").css("background-position", `center`)
        $("#duchy-text").append(`<p class="duchy-info-p"><strong>Ruler:</strong> ${sentText.split("]")[1].split("|")[1]}</p>`)
        $("#duchy-text").append(`<p class="duchy-info-p"><strong>Official Stance:</strong> ${sentText.split("]")[1].split("|")[2]}</p>`)
        $("#duchy-text").append(`<p class="duchy-info-p"><strong>Diplomatic Relations:</strong> ${sentText.split("]")[1].split("|")[3]}</p>`)
        $("#duchy-text").append(`<p class="duchy-info-p"><strong>Information Level:</strong> ${sentText.split("]")[1].split("|")[4]}</p>`)
        $("#duchy-text").append(`<p class="duchy-descript-p"><strong>Description:</strong> ${sentText.split("]")[1].split("|")[5]}</p>`)
        $("#duchy-symbol").height($("#player-box").height() - $("#duchy-text").height())
    }else if(sentText.startsWith("[CUTAWAY IMAGE]")){
        textLine = false;
        $("#cutaway-subtitle").css("display","block")
        $("#cutaway-image").css("background-image", `url(${sentText.replace("[CUTAWAY IMAGE]","").split("|")[0]})`)
        $("#cutaway-image-collection").append(`<section class="cutaway-image-container"><div id="${sentText.split("|")[1].replace(/<strong>/g,"").replace(/<\/strong>/g,"")}" class='cutaway-image'></div><div class="cutaway-image-subtitle">${sentText.split("|")[1]}</div></section>`)
        textId = document.getElementById(sentText.split("|")[1].replace(/<strong>/g,"").replace(/<\/strong>/g,""));
        $(textId).css("background-image", `url(${sentText.replace("[CUTAWAY IMAGE]","").split("|")[0]})`)
        $(textId).css("background-repeat", `no-repeat`)
        $(textId).css("background-size", `contain`)
        $(textId).css("background-position", `center`)
        $(textId).on("click", function(){
            $("#cutaway-subtitle").css("display","block")
            $("#cutaway-image").css("background-image", `url(${sentText.replace("[CUTAWAY IMAGE]","").split("|")[0]})`)
            $("#cutaway-image").css("background-repeat", `no-repeat`)
            $("#cutaway-image").css("background-size", `contain`)
            $("#cutaway-image").css("background-position", `center`)
            $("#cutaway-image").fadeIn();
            $("#cutaway-subtitle").html(sentText.split("|")[1])
            $("#cutaway-subtitle").fadeIn();
            $("#cutaway-image-container").css("display","flex");
            $("#cutaway-image-container").off("click")
            $("#cutaway-image-container").on("click", function(){
                $("#cutaway-image").fadeOut();
                $("#cutaway-subtitle").fadeOut();
                setTimeout(function(){
                    $("#cutaway-image-container").css("display","none");
                    $("#cutaway-subtitle").css("display","none");
                },500)
            })
        })
        $("#cutaway-image").css("background-repeat", `no-repeat`)
        $("#cutaway-image").css("background-size", `contain`)
        $("#cutaway-image").css("background-position", `center`)
        $("#cutaway-image").fadeIn();
        $("#cutaway-subtitle").html(sentText.split("|")[1])
        $("#cutaway-subtitle").fadeIn();
        $("#cutaway-image-container").css("display","flex");
        $("#cutaway-image-container").on("click", function(){
            loadEvent();
        })
    }else if(sentText.startsWith("[PLAYER ACTION]")){
        $("#choice").empty();
        $("#choice").css("color","white");
        $("#choice-container").css("border-color","white");
        ctrlButton = false;
        enterButton = false;
        let numberOfOptions = parseInt(sentText.split("|")[2]);
        $("#choice").append(`<p class='choice-title'>${sentText.split("|")[1]}</p>`)
        $("#choice").append(`<p class='choice-description'>${sentText.split("|")[0].replace("[PLAYER ACTION]","")}</p>`)
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
    }else if(sentText.startsWith("[RETURN FROM IMAGE]")){
        $("#cutaway-image").fadeOut();
        $("#cutaway-subtitle").fadeOut();
        setTimeout(function(){
            $("#cutaway-image-container").css("display","none");
            $("#cutaway-subtitle").css("display","none");
        },500)
        loadClickSignifier();
    }else if(sentText.startsWith("[RETURN FROM FADE]")){
        textLine = false;
        $("#sub-base").css("transition","100ms");
        $("#sub-base").css("background-color","transparent");
        loadEvent();
    }else if(sentText.startsWith("[SLOW FADE TO BLACK]")){
        textLine = false;
        $("#sub-base").css("transition","25000ms");
        $("#sub-base").css("background-color","black");
        loadEvent();
    }else if(sentText.includes("[OTHER]")){
        if(sentText.startsWith("[OTHER]")){
            sentText = sentText.replace("[OTHER]","");
            $(`#event-${eventId}-height-box`).append(`<p id="height-check-${index}" class="boxtext">${sentText}</p>`);
            $(`#event-${eventId}`).append(`<p id="boxtext-${index}" class='boxtext other' style="height: ${$(`#height-check-${index}`).height()+36}px"></p>`);
            await typeWriter("", 0, sentText,index,`#boxtext-${index}`, 20);
            loadClickSignifier();
        }else{
            sentText = sentText.replace("[]","");
            text1 = sentText.split("[OTHER]")[0] + " ";
            console.log(text1);
            text2 = sentText.split("[OTHER]")[1];
            text3 = sentText.split("[OTHER]")[2];
            $(`#event-${eventId}-height-box`).append(`<p id="height-check-${index}" class="boxtext">${sentText}</p>`);
            $(`#event-${eventId}`).append(`<p id="boxtext-${index}" class='boxtext' style="height: ${$(`#height-check-${index}`).height()+36}px"><span id="boxtext-${index}-1"></span><span class='other' id="boxtext-${index}-2"></span><span id="boxtext-${index}-3"></span></p>`);
            console.log($(`#boxtext-${index}`))
            await typeWriter("", 0, text1,index,`#boxtext-${index}-1`, 1, {text2:{id:`#boxtext-${index}-2`,text:text2},text3:{id:`#boxtext-${index}-3`,text:text3}});
            await typeWriter("", 0, text2,index,`#boxtext-${index}-2`, 20, {text3:{id:`#boxtext-${index}-3`,text:text3}});
            await typeWriter("", 0, text3,index,`#boxtext-${index}-3`, 1);
            loadClickSignifier();
        }
    }else if(sentText.includes("[SHADOWS]")){
        if(sentText.startsWith("[SHADOWS]")){
            sentText = sentText.replace("[SHADOWS]","");
            $(`#event-${eventId}-height-box`).append(`<p id="height-check-${index}" class="boxtext">${sentText}</p>`);
            $(`#event-${eventId}`).append(`<p id="boxtext-${index}" style="height: ${$(`#height-check-${index}`).height()+36}px" class='boxtext shadows'></p>`);
            await typeWriter("", 0, sentText,index,`#boxtext-${index}`, 1);
            loadClickSignifier();
        }else{
            sentText = sentText.replace("[]","");
            text1 = sentText.split("[SHADOWS]")[0] + " ";
            text2 = sentText.split("[SHADOWS]")[1];
            text3 = sentText.split("[SHADOWS]")[2];
            $(`#event-${eventId}-height-box`).append(`<p id="height-check-${index}" class="boxtext">${sentText}</p>`);
            $(`#event-${eventId}`).append(`<p id="boxtext-${index}" style="height: ${$(`#height-check-${index}`).height()+36}px" class='boxtext'><span id="boxtext-${index}-1"></span><span class='shadows' id="boxtext-${index}-2"></span><span id="boxtext-${index}-3"></span></p>`);
            console.log($(`#boxtext-${index}`))
            await typeWriter("", 0, text1,index,`#boxtext-${index}-1`, 1, {text2:{id:`#boxtext-${index}-2`,text:text2},text3:{id:`#boxtext-${index}-3`,text:text3}});
            await typeWriter("", 0, text2,index,`#boxtext-${index}-2`, 1, {text3:{id:`#boxtext-${index}-3`,text:text3}});
            await typeWriter("", 0, text3,index,`#boxtext-${index}-3`, 1);
            loadClickSignifier();
        }
    }else if(sentText.includes("[LOAD]")){
        $("#choice").empty();
        $("#choice").css("color","black");
        ctrlButton = false;
        enterButton = false;
        const component = await load(`/component/${sentText.split("[LOAD]")[1].split("|")[0]}`,{model:{name:sentText.split("[LOAD]")[1].split("|")[1],id:sentText.split("[LOAD]")[1].split("|")[2]}});
        const characterColors = await load(`/colors/${sentText.split("[LOAD]")[1].split("|")[3]}`);
        console.log(characterColors);
        document.documentElement.style.setProperty('--light', characterColors.light);
        document.documentElement.style.setProperty('--dark', characterColors.dark);
        document.documentElement.style.setProperty('--darker', characterColors.darker);
        document.documentElement.style.setProperty('--highlight', characterColors.highlight);
        document.documentElement.style.setProperty('--background', characterColors.background);
        console.log(component);
        $("#choice").append(component);
        $("#choice").append(`<p class='continue-button'>Continue</p>`);
        $(".continue-button").on("click",function(){
            $("#choice-container").css("display","none");
            ctrlButton = true;
            enterButton = true;
        })
        $("#choice-container").css("display","flex");
    }else if(sentText.includes("[NEWLINE]")){
        $(`#event-${eventId}-height-box`).append(`<p id="height-check-${index}" class="boxtext"></p>`);
        for(let x=0; x<sentText.split("[NEWLINE]").length; x++){
            $(`#height-check-${index}`).append(`<p id="height-check-${index}-${x}" class="boxtext nextline">${sentText.split("[NEWLINE]")[x]}</p>`);
        }
        $(`#event-${eventId}`).append(`<p id="boxtext-${index}" style="height: ${$(`#height-check-${index}`).outerHeight(true)}px"></p>`);
        for(let x=0; x<sentText.split("[NEWLINE]").length; x++){
            $(`#boxtext-${index}`).append(`<p id="boxtext-${index}-${x}" class="boxtext nextline"></p>`);
            await typeWriter("", 0, sentText.split("[NEWLINE]")[x], index, `#boxtext-${index}-${x}`, 1);
            if(x==sentText.split("[NEWLINE]").length-1){
                $(`#boxtext-${index}-${x}`).removeClass("nextline");
                loadClickSignifier();
            }
        }
    }else if(sentText.includes("[CHARACTER]")){
        $("#title-box-event").css("transition","500ms");
        $("#title-box-event").css("transform", "translateY(-100%)");
        setTimeout(function(){
            $("#title-box-event").css("transition","0ms");
            $("#title-box-event").css("transform", "translateY(0%)");
        },500)
        player = {};
        player.name = sentText.split("|")[1];
        player.background = "eventPlayer";
        $("head").append($(`<link id="character-style" rel='stylesheet' type='text/css'/>`).attr('href',`/styles/character.css`))
        characterInfo = await load("/component/character",{model:{name:"Characterinfo",id:sentText.split("|")[2]},basicTrue: sentText.split("|")[3],statTrue: sentText.split("|")[4],combatTrue: sentText.split("|")[5],spiritTrue: sentText.split("|")[6]})
        $(`#event-${eventId}`).append(characterInfo);
        document.documentElement.style.setProperty('--light', characterColors.light);
        document.documentElement.style.setProperty('--dark', characterColors.dark);
        document.documentElement.style.setProperty('--darker', characterColors.darker);
        document.documentElement.style.setProperty('--highlight', characterColors.highlight);
        document.documentElement.style.setProperty('--background', characterColors.background);
        states = ["story","event","character",sentText.split("|")[0].split("]")[1]];
        data = [data[0],data[1],{name:"Characterinfo",id:sentText.split("|")[2]},{name:"Characterinfo",id:sentText.split("|")[2]}]
        console.log("GEGEG " + sentText.split("|")[4])
        if(sentText.split("|")[4] == "false"){
            $("#advanced-stat-sheet-button").remove();
        }
        deactivateButtons();
        loadState(3);
        activateButtons();
        loadEvent();
    }else{
        $(`#event-${eventId}-height-box`).append(`<p id="height-check-${index}" class="boxtext">${sentText}</p>`);
        $(`#event-${eventId}`).append(`<p id="boxtext-${index}" style="height: ${$(`#height-check-${index}`).outerHeight(true)+36}px" class="boxtext"></p>`);
        $("#sub-story").scrollTop($("#sub-story").prop("scrollHeight"));
        await typeWriter("", 0, sentText, index, `#boxtext-${index}`, 1) 
        loadClickSignifier();
    }
}

const loadClickSignifier = function(){
    if(index<text.length-1){ 
        $(`#boxtext-${index}`).css("height",`${$(`#height-check-${index}`).outerHeight(true)}px`)  
        console.log(index)
        console.log(text.length)
        $(`#event-${eventId}`).append("<div id='click-signifier'><i class='fas fa-scroll fa-blink'></i></div>")
        $("#click-signifier").css("justify-content","left")
        $("#click-signifier").css("padding-left","25px");
        $("#sub-story").scrollTop($("#sub-story").prop("scrollHeight"));
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

const playSound = function(url){
    if(!document.getElementById(url.replace(/\s+/g, '-'))){
        $("body").append(`<audio id="${url.replace(/\s+/g, '-')}" src="/sounds/${url}.mp3"></audio>`);
    }else{
        $(`#${url.replace(/\s+/g, '-')}`).attr("src",`/sounds/${url}.mp3`)
    }
    let sound = document.getElementById(url.replace(/\s+/g, '-'));
    console.log(sound);
    sound.volume = user.settings.soundVolume;
    sound.play();
}

const loadMusic = async function(url){
    continueEvent = false;
    let repeat = true;
    if(url.startsWith("[NO REPEAT]")){
        url = url.split("[NO REPEAT]")[1];
        repeat = false;
    }
    return new Promise((resolve) =>{
        if(song&&(song!=document.getElementById(url.replace(/\s+/g, '-')))){
            let oldSong = song;
            $(oldSong).animate({volume: 0}, 300);
            setTimeout(function(){
                stopAudio(oldSong);
            },300)
        }
        if(url.includes("none")){
            continueEvent = true;
            resolve();
        }else{
            setTimeout(function(){
                if(!document.getElementById(url.replace(/\s+/g, '-'))){
                    $("audio").attr("src","");
                    if(repeat)
                    $("#story").append(`<audio id="${url.replace(/\s+/g, '-')}" loop src="/sounds/${url}.mp3"></audio>`);
                    else
                    $("#story").append(`<audio id="${url.replace(/\s+/g, '-')}" src="/sounds/${url}.mp3"></audio>`);
                }else{
                    if(document.getElementById(url.replace(/\s+/g, '-')).paused){
                        $(`#${url.replace(/\s+/g, '-')}`).attr("src",`/sounds/${url}.mp3`)
                    }
                }
                song = document.getElementById(url.replace(/\s+/g, '-'));
                console.log(song);
                song.volume = user.settings.musicVolume;
                let played = song.play();
                if(played !== undefined){
                    played.then(_ =>{
                        continueEvent = true;
                        resolve();
                    }).catch(error =>{
                        $('body').on("click", function(){
                            song.play();
                        })
                        continueEvent = true;
                        resolve();
                    })
                }
            },300)
        }
    })
}

const stopAudio = function(song){
    song.pause();
    song.currentTime = 0;
}

const activateTitleClick = function(){
    $("#player-box").on("click", async function(){
        $("#right-arrow-box").click();
    })
}

const deactivateAll = function(){
    deactivateEventClick();
}

const typeWriter = async function(returnString, i, txt, sentIndex, id, speedMod, otherText) {
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
            let timeout = setTimeout(function(){typeWriter(returnString, i, txt, sentIndex, id, speedMod, otherText).then(resolve)}, user.settings.textSpeed)
            if(index!=sentIndex){
                if(otherText){
                    if(otherText.text2){
                        $(otherText.text2.id).text(otherText.text2.text);
                    }
                    if(otherText.text3){
                        $(otherText.text3.id).text(otherText.text3.text);
                    }
                }
                $(`#boxtext-${sentIndex}`).css("height",`${$(`#height-check-${sentIndex}`).outerHeight(true)}px`)  
                $(id).html(txt) 
                clearTimeout(timeout);
            }
        }
    })
}

$("body").on("keydown", function (e) {
    if (e.keyCode == 17) {
        if(enterButton)
            if(continueEvent)
                loadEvent();
    }
})

$("body").on("keypress", function (e) {
    if (e.keyCode == 13) {
        if(ctrlButton)
            if(continueEvent)
                loadEvent();
    }
})

/* window.addEventListener('contextmenu', function(e){
    e.preventDefault();
    if(screen){
        $("#title-box-event").css("visibility","hidden");
        $("#sub-base").css("visibility","hidden");
        $("#settings-button").css("visibility","hidden");
        screen = false;
    }else{
        $("#sub-base").css("visibility","visible");
        $("#title-box-event").css("visibility","visible");
        $("#settings-button").css("visibility","visible");
        screen = true;
    }
}) */
