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
    }else if(sentText.startsWith("[MUSIC STOP")){
        textLine = false;
        stopAudio(song);
        loadEvent();
    }else if(sentText.startsWith("[SOUND EFFECT]")){
        textLine = false;
        playSound(sentText.split("[SOUND EFFECT]")[1]);
        loadEvent();
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
    }else if(sentText.startsWith("[RETURN FROM IMAGE]")){
        $("#cutaway-image").fadeOut();
        $("#cutaway-subtitle").fadeOut();
        setTimeout(function(){
            $("#cutaway-image-container").css("display","none");
            $("#cutaway-subtitle").css("display","none");
        },500)
    }else if(sentText.includes("[OTHER]")){
        if(sentText.startsWith("[OTHER]")){
            sentText = sentText.replace("[OTHER]","");
            $(`#event-${eventId}`).append(`<p id="boxtext-${index}" class='boxtext other'></p>`);
            await typeWriter("", 0, sentText,index,`#boxtext-${index}`, 20);
            loadClickSignifier();
        }else{
            sentText = sentText.replace("[]","");
            text1 = sentText.split("[OTHER]")[0] + " ";
            text2 = sentText.split("[OTHER]")[1];
            text3 = sentText.split("[OTHER]")[2];
            $(`#event-${eventId}`).append(`<p id="boxtext-${index}" class='boxtext'><span id="boxtext-${index}-1"></span><span class='other' id="boxtext-${index}-2"></span><span id="boxtext-${index}-3"></span></p>`);
            console.log($(`#boxtext-${index}`))
            await typeWriter("", 0, text1,index,`#boxtext-${index}-1`, 1, {text2:{id:`#boxtext-${index}-2`,text:text2},text3:{id:`#boxtext-${index}-3`,text:text3}});
            await typeWriter("", 0, text2,index,`#boxtext-${index}-2`, 20, {text3:{id:`#boxtext-${index}-3`,text:text3}});
            await typeWriter("", 0, text3,index,`#boxtext-${index}-3`, 1);
            loadClickSignifier();
        }
    }else{
        $(`#event-${eventId}`).append(`<p id="boxtext-${index}" class="boxtext"></p>`);
        await typeWriter("", 0, sentText, index, `#boxtext-${index}`, 1)
        loadClickSignifier();
    }
}

const loadClickSignifier = function(){
    if(index<text.length-1){
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
            $("#background").css("background-position", "top");
            url = url.replace("[TOP]","");
        }else{
            $("#background").css("background-position", "center center");
        }
        $("#background").css("background-image", `url('${url}')`);
        resolve();
    })
}

const playSound = function(url){
    if(!document.getElementById(url)){
        $("#story").append(`<audio id="${url}" src="/sounds/${url}.mp3"></audio>`);
    }
    let sound = document.getElementById(url);
    console.log(sound);
    sound.volume = 0.1;
    sound.play();
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

const typeWriter = async function(returnString, i, txt, sentIndex, id, speedMod, otherText) {
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

const closeImages = function(){
    setTimeout(function(){
        $(".textbox").css("transition","0ms");
        $("#cutaway-image-collection").css("transition","0ms");
        $("#top-arrow-box").css("transition","0ms");
    },500)
    $(".textbox").css("transform","translateY(0)")
    $("#cutaway-image-collection").css("transform","translateY(0)");
    $("#top-arrow-box").css("transform","translateY(0)");
    $(".fa-chevron-down").addClass("fa-chevron-up");
    $(".fa-chevron-up").removeClass("fa-chevron-down");
    $("#top-arrow-box").off("click");
    $("#top-arrow-box").on("click",openImages);
}

const openImages = function(){
    $(".textbox").css("transition","500ms");
    $("#cutaway-image-collection").css("transition","500ms");
    $("#top-arrow-box").css("transition","500ms");
    $(".textbox").css("transform","translateY(-90vh)")
    $("#cutaway-image-collection").css("transform","translateY(-90vh)");
    $("#top-arrow-box").css("transform","translateY(-90vh)");
    $(".fa-chevron-up").addClass("fa-chevron-down");
    $(".fa-chevron-down").removeClass("fa-chevron-up");
    $("#top-arrow-box").off("click");
    $("#top-arrow-box").on("click",closeImages);
}

