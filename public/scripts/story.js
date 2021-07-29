let index = -2;
let click = true;
let song = false;
let ctrlButton = true;
let enterButton = true;

const activateEventClick = function(){
    $("#player-box").on("click", async function(){
        click = true;
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
    }else if(sentText.startsWith("[MUSIC]")){
        textLine = false;
        await loadMusic(sentText.split("[MUSIC]")[1]);
        loadEvent();
    }else if(sentText.includes("[OTHER]")){
        if(sentText.startsWith("[OTHER]")){
            sentText = sentText.replace("[OTHER]","");
            $(`#event-${eventId}`).append(`<p id="boxtext-${index}" class='boxtext other'></p>`);
            await typeWriter("", 0, 4,sentText,index,`#boxtext-${index}`, 20);
        }else{
            sentText = sentText.replace("[]","");
            text1 = sentText.split("[OTHER]")[0] + " ";
            text2 = sentText.split("[OTHER]")[1];
            text3 = sentText.split("[OTHER]")[2];
            $(`#event-${eventId}`).append(`<p id="boxtext-${index}" class='boxtext'><span id="boxtext-${index}-1"></span><span class='other' id="boxtext-${index}-2"></span><span id="boxtext-${index}-3"></span></p>`);
            console.log($(`#boxtext-${index}`))
            await typeWriter("", 0, 4,text1,index,`#boxtext-${index}-1`, 1, {text2:{id:`#boxtext-${index}-2`,text:text2},text3:{id:`#boxtext-${index}-3`,text:text3}});
            await typeWriter("", 0, 4,text2,index,`#boxtext-${index}-2`, 20, {text3:{id:`#boxtext-${index}-3`,text:text3}});
            await typeWriter("", 0, 4,text3,index,`#boxtext-${index}-3`, 1);
        }
    }else{
        $(`#event-${eventId}`).append(`<p id="boxtext-${index}" class="boxtext"></p>`);
        await typeWriter("", 0, 4, sentText, index, `#boxtext-${index}`, 1)
        if(index<text.length-1){
            console.log(index)
            console.log(text.length)
            $(`#event-${eventId}`).append("<div id='click-signifier'><i class='fas fa-scroll fa-blink'></i></div>")
            $("#click-signifier").css("justify-content","left")
            $("#click-signifier").css("padding-left","25px");
            $("#sub-story").scrollTop($("#sub-story").prop("scrollHeight"));
        }
    }
}

const loadBackground = async function(url){
    return new Promise((resolve) =>{
        if(url.includes("[TOP]")){
            $("#background").css("background-position", "top");
            url = url.replace("[TOP]","");
        }else{
            $("#background").css("background-position", "center center");
        }
        $("#background").css("background-image", `url('${url}')`);
        resolve();
    })
}

const loadMusic = async function(url){
    return new Promise((resolve) =>{
        if(song&&(song!=document.getElementById(url))){
            let oldSong = song;
            $(oldSong).animate({volume: 0}, 300);
            setTimeout(function(){
                stopAudio(oldSong);
            },320)
        }
        if(url.includes("none")){
            resolve();
        }else{
            setTimeout(function(){
                if(!document.getElementById(url)){
                    $("#story").append(`<audio id="${url}" loop src="/sounds/${url}.mp3"></audio>`);
                }
                song = document.getElementById(url);
                console.log(song);
                if(song.paused){
                    song.volume = 0.1;
                    song.play();
                }
                resolve();
            },340)
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

const typeWriter = async function(returnString, i, speed, txt, sentIndex, id, speedMod, otherText) {
    $("#sub-story").scrollTop($("#sub-story").prop("scrollHeight"));
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
            let timeout = setTimeout(function(){typeWriter(returnString, i, speed, txt, sentIndex, id, speedMod, otherText).then(resolve)}, speed)
            if(index!=sentIndex){
                if(otherText){
                    if(otherText.text2){
                        $(otherText.text2.id).text(otherText.text2.text);
                    }
                    if(otherText.text3){
                        $(otherText.text3.id).text(otherText.text3.text);
                    }
                }
                $(id).html(txt) 
                $(id).height("auto");
                clearTimeout(timeout);
            }
        }
    })
}

$("body").on("keydown", function (e) {
    if (e.keyCode == 17) {
        if(enterButton)
        loadEvent();
    }
})

$("body").on("keypress", function (e) {
    if (e.keyCode == 13) {
        if(ctrlButton)
        loadEvent();
    }
})

