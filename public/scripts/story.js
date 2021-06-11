const socket = io();
let listenerAdded = false;
let index = -1;
let song;
let soundEffect;
let eventText = [];
let images = story.images;
let ctrlButton = true;
let enterButton = true;
let titleLoaded = false;

$("#cutaway-image").fadeOut()
$("#cutaway-subtitle").fadeOut();

if( /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    $("head").append($("<link rel='stylesheet' type='text/css' />").attr('href',`/styles/mobileStory.css`))
}else{
    $('body').removeAttr("id")
    $('body').append("<section id='background'></section>");
    $("head").append($("<link rel='stylesheet' type='text/css' />").attr('href',`/styles/story.css`)) 
}

document.addEventListener('touchstart', handleTouchStart, false);        
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;                                                        
var yDown = null;

function getTouches(evt) {
  return evt.touches ||             // browser API
         evt.originalEvent.touches; // jQuery
}                                                     

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];                                      
    xDown = firstTouch.clientX;                                      
    yDown = firstTouch.clientY;                                      
};                                                

function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
            console.log("TEST");
            $("#right-arrow-box").click(); 
        } else {
            $("#left-arrow-box").click();
        }                       
    } else {
        if ( yDiff > 0 ) {
            /* up swipe */ 
        } else { 
            /* down swipe */
        }                                                                 
    }
    /* reset values */
    xDown = null;
    yDown = null;                                             
};



window.addEventListener('popstate', (event) => {
    index=-1;
    $("#left-arrow").children().removeClass("invisible")
    eventId = event.state;
    console.log(eventId)
    $("#player-bottom-right").empty();
    $("#player-bottom").empty()
    $("#player-bottom-left").empty();
    $("#gamemaster-bottom").empty();
    loadEventId();
})

const loadNewPage = function(res){
    if(res.startsWith("[GO BACK]")){
        phase = res.split("]")[1].split("|")[0];
        res = res.split("|")[1];
    }
    titleLoaded = false;
    $(".textbox").css("background-color","rgba(0, 0, 0, 0.7)");
    $(".textbox").css("color","white");
    console.log(res);
    $("#left-arrow").children().removeClass("invisible")
    eventId = res;
    if(res.startsWith("[TURN TITLE]")){
        window.history.pushState(res,"",`/story/${story.type}/${res.replace("[TURN TITLE]").split("|")[2]}/${res.replace("[Turn Title]").split("|")[1]}/world`)
        loadTitle(res);
    }else if(res.startsWith("[STORY TITLE]")){
        window.history.pushState(res,"",`/story/${story.type}`)
        loadTitle(res);
    }else if(res.startsWith("[AREA TITLE]")){
        window.history.pushState(res,"",`/story/${story.type}/${res.split("|")[1]}/${res.split("|")[2]}/${res.split("|")[0].replace("[AREA TITLE]","")}`)
        loadTitle(res);
    }else if(res.startsWith("[CHARACTER TITLE]")){
        window.history.pushState(res,"",`/story/${story.type}/${res.split("|")[3]}/${res.split("|")[4]}/${res.split("|")[2]}/${res.split("]")[1].split(" ")[0]}/title`)
        loadTitle(res);
    }else{
        $.ajax({
            method: "GET",
            url: `/story/getEvent/${eventId}`,
            success: function(res){
                if(res.phase)
                window.history.pushState(res._id,"",`/story/${story.type}/${res.season.year}/${res.season.season}/${res.phase}/${res.type}`)
                else
                window.history.pushState(res._id,"",`/story/${story.type}/${res.season.year}/${res.season.season}/${phase}/${res.type}`)
            }
        })
        loadEvent();
    }
    $(".textbox").scrollTop(0);
    $("#player-bottom-right").empty();
    $("#player-bottom-left").empty();
    setTimeout(function(){
        phase = window.location.pathname.split("/")[5];
        if(window.location.pathname.split("/")[7] == "title"){
            phase = window.location.pathname.split("/")[6];
        }
        if(phase=="world"){
        phase = window.location.pathname.split("/")[5] + "Phase";
        }
        $("body").css("pointer-events","auto");
        console.log(phase);
    },500)
}

const loadEventId = function(){
    if(eventId.startsWith("[TURN TITLE]")){
        loadTitle(eventId);
    }else if(eventId.startsWith("[STORY TITLE]")){
        loadTitle(eventId);
    }else if(eventId.startsWith("[AREA TITLE]")){
        loadTitle(eventId);
    }else if(eventId.startsWith("[CHARACTER TITLE]")){
        loadTitle(eventId);
    }else{
        loadEvent();
    }
}

const loadEvent = function(){
    $.ajax({
        method: "GET",
        url: `/story/getEvent/${eventId}`,
        success: function(res){
            $("#player-bottom").empty();
            eventText = [];
            eventText.push("[EMPTYONE]")
            eventText.push(`[TYPE] ~ ${res.type} ~ `)
            eventText.push(`[TITLE]${res.title}`);
            if(res.type==="Alysteria Prologue"){
                eventText.push("[SUBTITLE]Alysteria Prologue - Part 1")
            }
            else if(res.type==="Continent Introduction"||res.type==="Kingdom Introduction"){
                eventText.push("[SUBTITLE]Setting Information")
            }
            else if(res.type==="Arland Prologue"){
                eventText.push("[SUBTITLE]Arland Prologue - Part 1")
            }else if(res.type==="Zachary Duchy Introduction"){
                eventText.push("[SUBTITLE]Zachary Stormchaser - Setting Information")
            }else if(res.type.includes("Zachary Prologue")){
                if(res.type.includes("IV")){
                    eventText.push(`[SUBTITLE]${res.location}, Fall, 2 Years Ago`) 
                }
                else
                eventText.push(`[SUBTITLE]${res.location}, Summer, 2 Years Ago`)
            }else if(res.type=="Malcador Introduction"){
                eventText.push(`[SUBTITLE]${res.location}, Two Hundred Years Ago`)
            }else{
                eventText.push(`[SUBTITLE]${res.location}, ${res.season.season.charAt(0).toUpperCase() + res.season.season.replace(res.season.season.charAt(0),"")} of Year ${res.season.year}`)
            }
            
            eventText.push("[EMPTYTWO]");
            eventText.push(...res.text);
            nextLine();
        }
    })
}

const loadTitle = function(res){
    if(res.startsWith("[STORY")){
        $("#left-arrow").children().addClass("invisible")
    }
    if(res.startsWith("[AREA")){
        eventId = eventId.replace(eventId.split("|")[3],"");
    }
    $("#player-bottom").empty();
    eventText = [];
    eventText.push(res)
    setTimeout(nextLine,100);

}

const stopAudio = function(song){
    song.currentTime = 0;
    song.pause();
    let originalSrc = song.src;
    song.src = "";
    song.src = originalSrc;
}

/* Load New Page */
$("#left-arrow-box").on("click", function(){
    if(song){
        stopAudio(song);
    }
    $("#cutaway-image-collection").empty();
    $("#player-bottom-left").empty();
    $("#player-bottom-right").empty();
    $("body").css("pointer-events","none");
    $("#player-bottom-right").attr("id","player-bottom-left")
    $("#player-bottom").attr("id","player-bottom-right");
    $("#player-bottom-left").attr("id","player-bottom");
    $("#gamemaster-bottom").empty();
    index=-1;
    $.ajax({
        method: "GET",
        url: `/story/navigate/${story._id}/${eventId}/${phase}/left/getId`,
        success: function(res){
            loadNewPage(res);
        }
    })
})
/* Load New Page */
$("#right-arrow-box").on("click", function(){
    if(song){
        stopAudio(song);
    }
    $("#cutaway-image-collection").empty();
    $("#player-bottom-left").empty();
    $("#player-bottom-right").empty();
    $("body").css("pointer-events","none");
    $("#player-bottom-left").attr("id","player-bottom-right")
    $("#player-bottom").attr("id","player-bottom-left");
    $("#player-bottom-right").attr("id","player-bottom");
    $("#gamemaster-bottom").empty();
    index=-1;
    console.log("URL: " + `/story/navigate/${story._id}/${eventId}/${phase}/right/getId`)
    $.ajax({
        method: "GET",
        url: `/story/navigate/${story._id}/${eventId}/${phase}/right/getId`,
        success: function(res){
            loadNewPage(res);
        }
    })
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

$("#top-arrow-box").on("click", openImages);

/* Socket Recievers */
socket.on('nextLine', function (text) {
    eventText.push(text);
    if ($("#user-input").length) {
        $("#user-input").remove();
        listenerAdded = false;
        index--;
    }
})
socket.on('delete', function (sentIndex) {
    $(`#edit-form-${sentIndex}`).remove();
    $(`#boxtext-${sentIndex}`).remove();
    eventText.splice(sentIndex, 1);
    let childIndex = -1;
    $("#player-bottom").children().each(function () {
        childIndex++;
        $(this).attr("id", `boxtext-${childIndex}`);
    });
    childIndex = -1;
    $("#gamemaster-bottom").children().each(function () {
        childIndex++;
        $(this).attr("id", `edit-form-${childIndex}`);
        $(this).unbind("submit");
        $(this).unbind("focusout");
        $(this).unbind("click");
        $(this).focusout(function () {
            let formData = $(this).html().replace(/%/g, 'PERCENT-SIGN');
            let newIndex = parseInt($(this).attr("id").substring(10), 10);
            console.log("newIndex" + newIndex);
            if (formData)
                $.ajax({
                    method: "POST",
                    url: `/story/${eventId}/${newIndex}/${formData}`,
                    success: function (res) {
                        socket.emit('edit', {
                            index: newIndex,
                            res: res
                        });
                    }
                })
            else {
                $.ajax({
                    method: "DELETE",
                    url: `/story/${eventId}/delete/${newIndex}`,
                    success: function (res) {
                        socket.emit('delete', newIndex);
                    }
                })
            }
        })
        $(this).submit(function (event) {
            event.preventDefault();
            $(this).blur;
        })
        $(this).on("click", function (event) {
            event.stopPropagation();
        })
    });
    index--;
})
socket.on('edit', function (sent) {
    console.log(sent.res);
    console.log(sent.index);
    if (sent.res.startsWith("[MUSIC]")) {

    }
    else if (sent.res.startsWith("[SCENE TRANSITION]")) {

    }
    else{
        $(`#boxtext-${sent.index}`).replaceWith(`<p id="boxtext-${sent.index}" class="boxtext">${sent.res}</p>`)
    }
})

const appendGamemasterText = function (text) {
    $("#gamemaster-bottom").append(`<span id="edit-form-${index}" class="edit-input" role="textbox" contenteditable>${text}</span>`); 
    $(`#edit-form-${index}`).on("paste", function(event){
        event.preventDefault();
        let copyText = window.event.clipboardData.getData('text/plain');
        console.log(copyText);
        $(this).text(copyText);
    })
    let sentIndex = index;
    $(`#edit-form-${index}`).focusout(function () {
        let formData = $(this).html().replace(/%/g, 'PERCENT-SIGN');
        console.log(formData);
        console.log("sentIndex" + sentIndex)
        if (formData)
            $.ajax({
                method: "POST",
                url: `/story/${eventId}/${sentIndex}/${formData}`,
                success: function (res) {
                    socket.emit('edit', {
                        index: sentIndex,
                        res: res
                    });
                }
            })
        else {
            $.ajax({
                method: "DELETE",
                url: `/story/${eventId}/delete/${sentIndex}`,
                success: function (res) {
                    socket.emit('delete', sentIndex);
                }
            })
        }
    })
    $(`#edit-form-${index}`).submit(function (event) {
        event.preventDefault();
        $(this).blur;
    })
    $(`#edit-form-${index}`).on("click", function (event) {
        event.stopPropagation();
    })
}

const specialCommand = async function (text) {
    if(text.startsWith("[SOUND EFFECT]")){
        soundEffect = document.getElementById(text.replace('[SOUND EFFECT]',''));
        if(soundEffect){
            $(soundEffect).removeAttr("loop");
            soundEffect.volume = 1;
            soundEffect.play();
        }
        else{
            console.log("INVALID AUDIO FILE")
        }
        $("#player-bottom").append(`<p id="boxtext-${index}" class='boxtext invisible'>${text}</p>`);
        appendGamemasterText(text);
        nextLine();
        return "";
    }
    if (text.startsWith("[MUSIC]")) {
        let repeat;
        if(text.replace("[MUSIC]","").startsWith("[NO REPEAT]")){
            repeat = false;
            text = text.replace("[NO REPEAT]","");
        }else{
            repeat = true;
        }
        if(song){
            $(song).animate({volume: 0}, 300);
            setTimeout(function(){
                stopAudio(song);
            },320)
        }
        setTimeout(function(){
            song = document.getElementById(text.replace('[MUSIC]', ""));
            if(song){
                    song.loop = repeat;
                    song.volume = 0.1;
                    
                    song.play();
            }else{
                console.log("Not a valid audio file!")
            }
        },340)
        $("#player-bottom").append(`<p id="boxtext-${index}" class='boxtext invisible'>${text}</p>`);
        appendGamemasterText(text);
        nextLine();
        return "";
    }
    if(text.startsWith("[MUSIC STOP]")){
        if(song){
            $(song).animate({volume: 0}, 300);
            setTimeout(function(){
                stopAudio(song);
            },300)
        }
        nextLine();
        return "";
    }
    if (text.startsWith("[SCENE TRANSITION]")) {
        let url;
        for (let x = 0; x < images.length; x++) {
            if (images[x].name === text.replace('[SCENE TRANSITION]', "")) {
                url = images[x].url;
                break;
            }
        }
        loadImage(url);
        $("#player-bottom").append(`<p id="boxtext-${index}" class='boxtext invisible'>${text}</p>`);
        appendGamemasterText(text);
        nextLine();
        return "";
    }
    if (text.includes("[OTHER]")){
        appendGamemasterText(text);
        if(text.startsWith("[OTHER]")){
            text = text.replace("[OTHER]","");
            $("#player-bottom").append(`<p id="boxtext-${index}" class='boxtext other'></p>`);
            $(`#boxtext-${index}`).css("visibility","hidden");
            $(`#boxtext-${index}`).text(text);
            $(`#boxtext-${index}`).height($(`#boxtext-${index}`).height());
            if(index<eventText.length-1)
            $("#player-bottom").append("<div id='click-signifier'><i class='fas fa-scroll fa-blink'></i></div>")
            $(".textbox").scrollTop($(".textbox").prop("scrollHeight"));
            $("#gamemaster-box").scrollTop($("#gamemaster-box").prop("scrollHeight"));
            $(`#boxtext-${index}`).text("");
            $(`#boxtext-${index}`).css("visibility","visible");
            await typeWriter("", 0, 4,text,index,`#boxtext-${index}`, 20);
            $("#click-signifier").css("visibility", "visible");
            $(`#boxtext-${index}`).height("auto");
        }else{
            text = text.replace("[]","");
            text1 = text.split("[OTHER]")[0] + " ";
            text2 = text.split("[OTHER]")[1];
            text3 = text.split("[OTHER]")[2];
            $("#player-bottom").append(`<p id="boxtext-${index}" class='boxtext'><span id="boxtext-${index}-1"></span><span class='other' id="boxtext-${index}-2"></span><span id="boxtext-${index}-3"></span></p>`);
            $(`#boxtext-${index}`).css("visibility","hidden");
            $(`#boxtext-${index}-1`).text(text);
            $(`#boxtext-${index}`).height($(`#boxtext-${index}`).height());
            if(index<eventText.length-1)
            $("#player-bottom").append("<div id='click-signifier'><i class='fas fa-scroll fa-blink'></i></div>")
            $(".textbox").scrollTop($(".textbox").prop("scrollHeight"));
            $("#gamemaster-box").scrollTop($("#gamemaster-box").prop("scrollHeight"));
            $(`#boxtext-${index}-1`).text("");
            $(`#boxtext-${index}`).css("visibility","visible");
            console.log($(`#boxtext-${index}`))
            await typeWriter("", 0, 4,text1,index,`#boxtext-${index}-1`, 1, {text2:{id:`#boxtext-${index}-2`,text:text2},text3:{id:`#boxtext-${index}-3`,text:text3}});
            await typeWriter("", 0, 4,text2,index,`#boxtext-${index}-2`, 20, {text3:{id:`#boxtext-${index}-3`,text:text3}});
            await typeWriter("", 0, 4,text3,index,`#boxtext-${index}-3`, 1);
            $("#click-signifier").css("visibility", "visible");
            $(`#boxtext-${index}`).height("auto");
        }
        return "";
    }
    if(text.startsWith("[TYPE]")){
        text = text.replace("[TYPE]","");
        $("#player-bottom").append(`<p class='boxtext eventType'>${text}</p>`);
        nextLine();
        return "";
    }
    if(text.startsWith("[TITLE]")){
        text = text.replace("[TITLE]","");
        $("#player-bottom").append(`<p class='boxtext title'>${text}</p>`);
        nextLine();
        return "";
    }
    if(text.startsWith("[SUBTITLE]")){
        text = text.replace("[SUBTITLE]","");
        $("#player-bottom").append(`<p class='boxtext subtitle'>${text}</p>`);
        nextLine();
        return "";
    }
    if(text.startsWith("[EMPTYONE]")){
        $("#player-bottom").append(`<div class='boxtext big-boy'></div>`);
        setTimeout(function(){
            $(`#boxtext-${index}`).css("transition","500ms");
        },500)
        $(".big-boy").height(($("#player-box").height()/2))
        nextLine();
        return "";
    }
    if(text.startsWith("[EMPTYTWO]")){
        $("#player-bottom").append(`<div id="click-signifier-big" class='boxtext big-boy'><i class="fas fa-scroll fa-blink"></i></div>`);
        setTimeout(function(){
            $(`#click-signifier-big`).css("transition","500ms");
        },500)
        $(".big-boy").height(($("#player-box").height()/2) - $(".eventType").height() - $(".title").height() - $(".subtitle").height())
        eventText.splice(0,5);
        index = index - 5;
        nextLine();
        return "";
    }
    if (text.startsWith("[STARTING IMAGE]")) {
        let url;
        for (let x = 0; x < images.length; x++) {
            if (images[x].name === text.replace('[STARTING IMAGE]', "")) {
                url = images[x].url;
                break;
            }
            if (images[x].name === text.replace('[STARTING IMAGE][TOP]', "")) {
                url = "[TOP]" + images[x].url;
                break;
            }
        }
        loadImage(url);
        $("#player-bottom").append(`<p id="boxtext-${index}" class='boxtext invisible'>${text}</p>`);
        appendGamemasterText(text);
        return "";
    }
    if(text.startsWith("[START]")){
        appendGamemasterText(text);
        $(".big-boy").css("height", "0px")
        $("#click-signifier-big").empty();
        $("#click-signifier-big").removeAttr("id","click-signifier-big");
        setTimeout(function(){
            nextLine();
        },500)
        return "";
    }
    /* TURN TITLE */
    if(text.startsWith("[TURN TITLE]")){
        $("#background").css("background-image", `url(https://aozora.s3.us-east-2.amazonaws.com/1621228479216-Book.jpg)`);
        $("#player-bottom").append(`<div class='boxtext big-boy'></div>`);
        $(".big-boy").height(($("#player-box").height()/2))
        $("#player-bottom").append(`<p class='boxtext turn-title'>Turn ${text.replace("[TURN TITLE]","").split("|")[0]}</p>`);
        $("#player-bottom").append(`<p class='boxtext turn-subtitle'>${text.replace("[TURN TITLE]","").split("|")[1].charAt(0).toUpperCase() + text.replace("[TURN TITLE","").split("|")[1].slice(1)} of Year ${text.replace("[TURN TITLE","").split("|")[2]}</p>`);
        $("#player-bottom").append(`<div class='boxtext big-boy'></div>`);
        $(".big-boy").height(($("#player-box").height()  - $(".turn-title").height() - $(".turn-subtitle").height() - 40)/2)
        return "";
    }
    if(text.startsWith("[STORY TITLE]")){
        $("#background").css("background-image", `url(https://wallpaper-mania.com/wp-content/uploads/2018/09/High_resolution_wallpaper_background_ID_77700604135.jpg)`);
        $("#player-bottom").append(`<div class='boxtext big-boy'></div>`);
        $(".big-boy").height(($("#player-box").height()/2))
        $("#player-bottom").append(`<p class='boxtext story-supertitle'>Not! Conquering High Fantasy</p>`);
        $("#player-bottom").append(`<p class='boxtext story-title'>Legends of Alysteria</p>`);
        $("#player-bottom").append(`<p class='boxtext story-subtitle'>The ${text.replace("[STORY TITLE]","")} Collection</p>`);
        $("#player-bottom").append(`<div class='boxtext big-boy'></div>`);
        $(".big-boy").height(($("#player-box").height() - $(".story-supertitle").height() - $(".story-title").height() - $(".story-subtitle").height() -60)/2)
        return "";
    }
    if(text.startsWith("[AREA TITLE]")){
        $("#background").css("background-image", `url(https://aozora.s3.us-east-2.amazonaws.com/1621228479216-Book.jpg)`);
        $("#player-bottom").append(`<div class='boxtext big-boy'></div>`);
        $("#player-bottom").append(`<section id="title-image"></section>`);
        $("#title-image").css("background-image", `url(${text.split("|")[3]})`)
        $("#title-image").css("background-repeat", `no-repeat`)
        $("#title-image").css("background-size", `contain`)
        $("#title-image").css("background-position", `center`)
        $("#player-bottom").append(`<p class='boxtext turn-title'>${text.replace("[AREA TITLE]","").split("|")[0]}</p>`);
        $("#player-bottom").append(`<p class='boxtext turn-subtitle'>${text.split("|")[2].charAt(0).toUpperCase() + text.split("|")[2].slice(1)} of Year ${text.split("|")[1]}</p>`);
        $("#player-bottom").append(`<p class='boxtext turn-players'></p>`);
        $(".turn-players").append('<div id="turn-players-title">Players</div>');
        $(".turn-players").append('<div id="turn-players-list"></div>');
        for(let x=0; x<text.split("|")[4].split("+").length; x++){
            $("#turn-players-list").append(`<div><div class="turn-player">${text.split("|")[4].split("+")[x]}</div><div class="turn-player" id="character-name-title">${text.split("|")[5].split("+")[x]}</div></div>`)
        }
        $("#player-bottom").append(`<div class='boxtext big-boy'></i></div>`);
        $(".big-boy").height(($("#player-box").height()  - $(".turn-title").height() - $(".turn-subtitle").height() - $("#title-image").height() - $(".turn-players").height() - 100 - $("#turn-players-list").height())/2)
        return "";
    }
    if(text.startsWith("[CUTAWAY IMAGE]")){
        appendGamemasterText(text);
        $("#cutaway-subtitle").css("display","block")
        $("#cutaway-image").css("background-image", `url(${text.replace("[CUTAWAY IMAGE]","").split("|")[0]})`)
        $("#cutaway-image-collection").append(`<section class="cutaway-image-container"><div id="${text.split("|")[1].replace(/<strong>/g,"").replace(/<\/strong>/g,"")}" class='cutaway-image'></div><div class="cutaway-image-subtitle">${text.split("|")[1]}</div></section>`)
        textId = document.getElementById(text.split("|")[1].replace(/<strong>/g,"").replace(/<\/strong>/g,""));
        $(textId).css("background-image", `url(${text.replace("[CUTAWAY IMAGE]","").split("|")[0]})`)
        $(textId).css("background-repeat", `no-repeat`)
        $(textId).css("background-size", `contain`)
        $(textId).css("background-position", `center`)
        $(textId).on("click", function(){
            $("#cutaway-subtitle").css("display","block")
            $("#cutaway-image").css("background-image", `url(${text.replace("[CUTAWAY IMAGE]","").split("|")[0]})`)
            $("#cutaway-image").css("background-repeat", `no-repeat`)
            $("#cutaway-image").css("background-size", `contain`)
            $("#cutaway-image").css("background-position", `center`)
            $("#cutaway-image").fadeIn();
            $("#cutaway-subtitle").html(text.split("|")[1])
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
        $("#cutaway-subtitle").html(text.split("|")[1])
        $("#cutaway-subtitle").fadeIn();
        $("#cutaway-image-container").css("display","flex");
        $("#cutaway-image-container").on("click", function(){
            nextLine();
        })
        return "";
    }
    if(text.startsWith("[RETURN FROM IMAGE]")){
        appendGamemasterText(text);
        $("#cutaway-image").fadeOut();
        $("#cutaway-subtitle").fadeOut();
        setTimeout(function(){
            $("#cutaway-image-container").css("display","none");
            $("#cutaway-subtitle").css("display","none");
        },500)
        return "";
    }
    if(text.startsWith("[CHARACTER TITLE]")){
        $("#background").css("background-image", `url(https://wallpaper-mania.com/wp-content/uploads/2018/09/High_resolution_wallpaper_background_ID_77700604135.jpg)`);
        $("#player-bottom").append(`<div class='boxtext big-boy'></div>`);
        $(".big-boy").height(($("#player-box").height()/2))
        $("#player-bottom").append(`<p class='boxtext story-supertitle'>Legends of Alysteria</p>`);
        $("#player-bottom").append(`<p class='boxtext story-title'>${text.replace("[CHARACTER TITLE]","").split("|")[0]}</p>`);
        $("#player-bottom").append(`<p class='boxtext story-subtitle'>Player: ${text.split("|")[1]}</p>`);
        $("#player-bottom").append(`<p class='boxtext story-subsubtitle'>${text.split("|")[2]}</p>`);
        $("#player-bottom").append(`<div class='boxtext big-boy'></div>`);
        $(".big-boy").height(($("#player-box").height() - $(".story-supertitle").height() - $(".story-title").height() - $(".story-subtitle").height() - $(".story-subsubtitle").height() -80)/2)
        return "";
    }
    if(text.startsWith("[DUCHY]")){
        $("#player-bottom").append(`<section id="duchy"><section id = "duchy-text"><div id="duchy-symbol"></div></section><section id = "duchy-image"></section></section>`)
        let url;
        for (let x = 0; x < images.length; x++) {
            if (images[x].name === text.replace("[DUCHY]","").split("|")[0]) {
                url = images[x].url;
                break;
            }
        }
        $("#duchy-image").css("background-image", `url(${url})`)
        $("#duchy-image").css("background-repeat", `no-repeat`)
        $("#duchy-image").css("background-size", `contain`)
        $("#duchy-image").css("background-position", `center`)
        for (let x = 0; x < images.length; x++) {
            if (images[x].name === (text.replace("[DUCHY]","").split("|")[0]+" Symbol")) {
                url = images[x].url;
                break;
            }
        }
        $("#duchy-symbol").css("background-image", `url(${url})`)
        $("#duchy-symbol").css("background-repeat", `no-repeat`)
        $("#duchy-symbol").css("background-size", `contain`)
        $("#duchy-symbol").css("background-position", `center`)
        $("#duchy-text").append(`<p class="duchy-info-p"><strong>Ruler:</strong> ${text.split("]")[1].split("|")[1]}</p>`)
        $("#duchy-text").append(`<p class="duchy-info-p"><strong>Official Stance:</strong> ${text.split("]")[1].split("|")[2]}</p>`)
        $("#duchy-text").append(`<p class="duchy-info-p"><strong>Diplomatic Relations:</strong> ${text.split("]")[1].split("|")[3]}</p>`)
        $("#duchy-text").append(`<p class="duchy-info-p"><strong>Information Level:</strong> ${text.split("]")[1].split("|")[4]}</p>`)
        $("#duchy-text").append(`<p class="duchy-descript-p"><strong>Description:</strong> ${text.split("]")[1].split("|")[5]}</p>`)
        $("#duchy-symbol").height($("#player-box").height() - $("#duchy-text").height())
        return "";
    }
    if(text.startsWith("[CHARACTER]")){
        loadCharacterAndCss(text);
        return "";
    }
    if(text.startsWith("[PHILOSOPHER]")){
        $("#player-bottom").append(`<p id="boxtext-${index}" class='boxtext philosopher'>${text.replace("[PHILOSOPHER]","")}</p>`);
        appendGamemasterText(text);
        return "";
    }
    if(text.startsWith("[PLAYER ACTION]")){
        $("#choice").empty();
        $("#choice").css("color","white");
        $("#choice-container").css("border-color","white");
        ctrlButton = false;
        enterButton = false;
        let numberOfOptions = parseInt(text.split("|")[2]);
        $("#choice").append(`<p class='choice-title'>${text.split("|")[1]}</p>`)
        $("#choice").append(`<p class='choice-description'>${text.split("|")[0].replace("[PLAYER ACTION]","")}</p>`)
        for(let x=0; x<numberOfOptions; x++){
            if(text.split("|")[x+3].startsWith("[CHOSEN]")){
                $("#choice").append(`<div class='choice-option chosen-option'>${text.split("|")[x+3].replace("[CHOSEN]","")}</div>`)
                $(".chosen-option").on("click",function(){
                    $("#choice-container").css("display","none");
                    ctrlButton = true;
                    enterButton = true;
                })
            }
            else
            $("#choice").append(`<div class='choice-option unchosen-option'>${text.split("|")[x+3]}</div>`)
        }
        $("#choice-container").css("display","flex");
        return "";
    }
    if(text.startsWith("[DISCOVERY]")){
        if(text.replace("[DISCOVERY]","").startsWith("[TRAIT]")){
            $("#choice").empty();
            $("#choice").css("color","black");
            ctrlButton = false;
            enterButton = false;
            $.ajax({
                method: "GET",
                url: `/character/${text.split("|")[1]}/style`,
                success: function(res){
                    $("#appended-style").remove();
                    $("head").append($("<link id='appended-style' rel='stylesheet' type='text/css' />").attr('href',`/styles/characters/${res}.css`))
                }
            })
            $.ajax({
                method: "GET",
                url: `/character/trait/${text.replace("[DISCOVERY][TRAIT]","").split("|")[0]}`,
                success: function(trait){
                    if(trait.type===5){
                        $("#choice").append(`<section class="meta-trait"><section class="trait-type character-big-title character-box-section knowledge-grid-title">New Battle Ability Discovered!</section></section>`)
                    }
                    $(".meta-trait").append(`<section class="meta-trait-content"><section class="trait-name character-box-title character-box-section">${trait.name}</section></section>`)
                    $(".meta-trait-content").append(`<section class="trait-description character-box-content character-box-section">${trait.description}</section>`)
                    $(".meta-trait-content").append(`<section class="trait-effect character-box-content character-box-section"><strong>Effect: </strong>${trait.effect}</section>`)
                    $("#choice").append(`<p class='continue-button'>Continue</p>`)
                    $(".continue-button").on("click",function(){
                        $("#choice-container").css("display","none");
                        ctrlButton = true;
                        enterButton = true;
                    })
                }
            })
        }
        $("#choice-container").css("display","flex");
        return "";
    }
    if(text.startsWith("[BATTLE]")){
        $("#player-box").css("margin-bottom", "55vh");
        $(".textbox").css("transition", "1000ms");
        $(".textbox").css("border-bottom","solid white 2px")
        $(".textbox").css("border-right","solid white 2px")
        $(".textbox").css("border-left","solid white 2px");
        //make promise ajax to load battle
        battle = new Battle(text.split("|")[1],text.split("|")[2]);
        await loadPlayerBox(battle);
        $("#character-image-1").css("background-image",`url(${battle.character1.avatar})`)
        $("#character-image-2").css("background-image",`url(${battle.character2.avatar})`)
        $("#battle-title").text(text.split("|")[0].split("]")[1])
        $("#character-row-1-1").append('<section class = "abilities-container" id = "abilities-container-1-1-2"><section class = "character-subtitle" id = "character-activeAbilities-1">Active Abilities</section><section id = "character-activeAbility-section-1"class="ability-section"></section></section>')
        let count = 1;
        for(let x=0; x<battle.character1.activeAbilities.length; x++){
            if(x>0)
                if(battle.character1.activeAbilities[x].name==battle.character1.activeAbilities[x-1].name){
                    count++;
                    $(`#character-1-activeAbility-${x-count+1}`).text(`${battle.character1.activeAbilities[x].name} x${count}`)
                }else{
                    count = 1;
                    $("#character-activeAbility-section-1").append(`<section id="character-1-activeAbility-${x}" class="ability">${battle.character1.activeAbilities[x].name}</section>`)
                }
            else
            $("#character-activeAbility-section-1").append(`<section id="character-1-activeAbility-${x}" class="ability">${battle.character1.activeAbilities[x].name}</section>`)    
        }
        $("#character-row-1-2").append('<section class = "abilities-container" id = "abilities-container-1-2-1"><section class = "character-subtitle" id = "character-passiveAbilities-1">Passive Abilities</section><section id = "character-passiveAbility-section-1" class="ability-section"></section></section>')
        count = 1;
        for(let x=0; x<battle.character1.passiveAbilities.length; x++){
            if(x>0)
                if(battle.character1.passiveAbilities[x].name==battle.character1.passiveAbilities[x-1].name){
                count++;
                    $(`#character-1-passiveAbility-${x-count+1}`).text(`${battle.character1.passiveAbilities[x].name} x${count}`)
                }else{
                    count = 1;
                    $("#character-passiveAbility-section-1").append(`<section id="character-1-passiveAbility-${x}" class="ability">${battle.character1.passiveAbilities[x].name}</section>`)
                }
            else
            $("#character-passiveAbility-section-1").append(`<section id="character-1-passiveAbility-${x}" class="ability">${battle.character1.passiveAbilities[x].name}</section>`)    
        }
        count = 1;
        $("#character-row-1-2").append('<section class = "abilities-container" id = "abilities-container-1-2-2"><section class = "character-subtitle" id = "character-rerolls-1">Rerolls</section><section id = "character-rerolls-section-1"class="ability-section"></section></section>')
        for(let x=0; x<battle.character1.rerolls.length; x++){
            if(x>0)
                if(battle.character1.rerolls[x].name==battle.character1.rerolls[x-1].name){
                    count++;
                    $(`#character-1-reroll-${x-count+1}`).text(`${battle.character1.rerolls[x].name} x${count}`)
                }else{
                    count = 1;
                    $("#character-rerolls-section-1").append(`<section id="character-1-reroll-${x}" class="ability">${battle.character1.rerolls[x].name}</section>`)
                }
            else
            $("#character-rerolls-section-1").append(`<section id="character-1-reroll-${x}" class="ability">${battle.character1.rerolls[x].name}</section>`)    
        }
        $("#character-row-2-1").append('<section class = "abilities-container" id = "abilities-container-2-1-2"><section class = "character-subtitle" id = "character-activeAbilities-2">Active Abilities</section><section id = "character-activeAbility-section-2"class="ability-section"></section></section>')
        count = 1;
        for(let x=0; x<battle.character2.activeAbilities.length; x++){
            if(x>0)
                if(battle.character2.activeAbilities[x].name==battle.character2.activeAbilities[x-1].name){
                    count++;
                    $(`#character-2-activeAbility-${x-count+1}`).text(`${battle.character2.activeAbilities[x].name} x${count}`)
                }else{
                    count = 1;
                    $("#character-activeAbility-section-2").append(`<section id="character-2-activeAbility-${x}" class="ability">${battle.character2.activeAbilities[x].name}</section>`)
                }
            else
            $("#character-activeAbility-section-2").append(`<section id="character-2-activeAbility-${x}" class="ability">${battle.character2.activeAbilities[x].name}</section>`)    
        }
        $("#character-row-2-2").append('<section class = "abilities-container" id = "abilities-container-2-2-1"><section class = "character-subtitle" id = "character-passiveAbilities-2">Passive Abilities</section><section id = "character-passiveAbility-section-2" class="ability-section"></section></section>')
        count = 1;
        for(let x=0; x<battle.character2.passiveAbilities.length; x++){
            if(x>0)
                if(battle.character2.passiveAbilities[x].name==battle.character2.passiveAbilities[x-1].name){
                count++;
                    $(`#character-2-passiveAbility-${x-count+1}`).text(`${battle.character2.passiveAbilities[x].name} x${count}`)
                }else{
                    count = 1;
                    $("#character-passiveAbility-section-2").append(`<section id="character-2-passiveAbility-${x}" class="ability">${battle.character2.passiveAbilities[x].name}</section>`)
                }
            else
            $("#character-passiveAbility-section-2").append(`<section id="character-2-passiveAbility-${x}" class="ability">${battle.character2.passiveAbilities[x].name}</section>`)    
        }
        $("#character-row-2-2").append('<section class = "abilities-container" id = "abilities-container-2-2-2"><section class = "character-subtitle" id = "character-rerolls-2">Rerolls</section><section id = "character-rerolls-section-2"class="ability-section"></section></section>')
        count = 1;
        for(let x=0; x<battle.character2.rerolls.length; x++){
            if(x>0)
                if(battle.character2.rerolls[x].name==battle.character2.rerolls[x-1].name){
                    count++;
                    $(`#character-2-reroll-${x-count+1}`).text(`${battle.character2.rerolls[x].name} x${count}`)
                }else{
                    count = 1;
                    $("#character-rerolls-section-2").append(`<section id="character-2-reroll-${x}" class="ability">${battle.character2.rerolls[x].name}</section>`)
                }
            else
            $("#character-rerolls-section-2").append(`<section id="character-2-reroll-${x}" class="ability">${battle.character2.rerolls[x].name}</section>`)    
        }
        $("#battle-results").on("click",nextLine);
        return "";
    }
    if(text.startsWith("[BATTLE ROUND]")){
        $("#battle-results").append(`<section class="round">Round ${text.split("]")[1]}</section>`)
    }
    if(text.startsWith("[BATTLE PHASE]")){
        for(let w=2; w<text.split("[").length; w++){
            let subPhase = text.split("[")[w];
            console.log("SUBPHASE" + subPhase)
            let character;
            if(battle.character1.name == subPhase.split("|")[0]){
                character = battle.character1
                opponent = battle.character2
            }else{
                character = battle.character2
                opponent = battle.character1
            }
            for(let x=1; x<subPhase.split("|").length; x++){
                let subSubPhase = subPhase.split("|")[x];
                await loadCombatantFunction(character,subSubPhase);
                if(subSubPhase.split(">")[0]=="defend"){
                    for(let y=0; y<character.activeAbilities.length; y++){
                        if(character.activeAbilities[y].name=="Counter"){
                            let characterRoll = await returnRoll(character)
                            let opponentRoll = await returnRoll(opponent);
                            console.log(characterRoll)
                            console.log(opponentRoll);
                            let difference = parseInt(characterRoll) - parseInt(opponentRoll);
                            console.log("DIFFERENCE:" + difference)
                            if(difference>0){
                                for(let z=0; z<character.modifiers.length; z++){
                                    if(character.modifiers[z].name == "Counter"){
                                        character.modifiers.splice(z,1);
                                        break;
                                    }
                                }
                                character.modifiers.push({name: "Counter", value: difference})
                                console.log(character.modifiers);
                            }
                            break;
                        }
                    }
                }
            }
        }
        return "";
    }
}

const returnRoll = async function(character){
    return new Promise((resolve) =>{
        $.ajax({
            method: "GET",
            url: `/combatant/${character._id}/returnRoll`,
            success: (res) =>{
                resolve(res);
            }
        })
    })
}

const loadCombatantFunction = async function(character,subSubPhase){
    return new Promise((resolve) =>{
        $.ajax({
            method: "GET",
            url: `/combatant/${character._id}/${subSubPhase.split(">")[0]}/${subSubPhase.split(">")[1]}`,
            success: (res) =>{
                console.log("BAT RESULTS" + res);
                $("#battle-results").append(`<section class="phase">${res}</section>`);
                resolve();
            }
        })
    })
}

const loadPlayerBox = async function(battle){
    return new Promise((resolve) =>{
        $("#player-box").before(`<section id='battler'>
                                    <section class='character' id='character-1'>
                                        <section class="character-image" id='character-image-1'></section>
                                        <section class="character-name" id="character-name-2">${battle.character1.name}</section>
                                        <section id="character-info-1" class="character-info">
                                            <section class = "character-row" id = "character-row-1-1">
                                                <section class = "character-stats" id = "character-stats-1">
                                                    <section class = "character-health" id = 'character-health-1'>Health: ${battle.character1.health}/${battle.character1.maxHealth}</section>
                                                    <section class = "character-stamina" id = 'character-stamina-1'>Stamina: ${battle.character1.stamina}/${battle.character1.maxStamina}</section>
                                                </section>
                                            </section>
                                            <section class = "character-row" id = "character-row-1-2">
                                            </section>
                                        </section>
                                    </section>
                                    <section id='battle-results'>
                                        <section id = "battle-title"></section>
                                    </section>
                                    <section id="character-2" class='character'>
                                        <section class='character-image' id='character-image-2'></section>
                                        <section class = "character-name" id = 'character-name-2'>${battle.character2.name}</section>
                                        <section class = "character-info" id = "character-info-2">
                                            <section class = "character-row" id = "character-row-2-1">
                                                <section class = "character-stats" id = "character-stats-2">
                                                    <section class = "character-health" id = 'character-health-2'>Health: ${battle.character2.health}/${battle.character2.maxHealth}</section>
                                                    <section class="character-stamina" id = 'character-stamina-2'>Stamina: ${battle.character2.stamina}/${battle.character2.maxStamina}</section>
                                                </section>
                                            </section>
                                            <section class = "character-row" id = "character-row-2-2">
                                            </section>
                                        </section>
                                    </section>
                                </section>`)
                                        
        setTimeout(function(){
            $(".textbox").css("height","25vh");
            $("#battler").css("transition", "1000ms"),
            $("#battler").css("height","55vh")
            $("#player-box").css("margin-bottom", "0");
            resolve();
        },10);
    })
}

const loadCharacterAndCss = async function(text){
    await loadCharacter(text.split("|")[0]);
    await loadCharacterComponent(text.split("|")[0]);
    $("#character-sheet").height($("#player-box").height()-($(".big-boy").height()*2)-$(".title").height()-$(".eventType").height()-$(".subtitle").height()-75)
    $("#basic-character-sheet-button").on("click", function(){
        loadCharacterBasicSheet(text.split("|")[0]);
    })
    if(text.split("|")[2] == "stat-sheet")
        $("#advanced-stat-sheet-button").removeClass("invisible");
        $("#advanced-stat-sheet-button").on("click", function(){
            loadAdvancedStatSheet(text.split("|")[0]);
        })
    if(text.split("|")[3] == "combat-sheet"){
        $("#combat-character-sheet-button").removeClass("invisible");
        $("#combat-character-sheet-button").on("click", function(){
            loadCombatCharacterSheet(text.split("|")[0]);
        })
    }
    if(text.split("|")[1] == "basic-sheet"){
        await loadCharacterBasicSheet(text.split("|")[0]);
    }
    if(text.split("|")[1] == "stat-sheet"){
        await loadAdvancedStatSheet(text.split("|")[0]);
    }
    if(text.split("|")[1] == "combat-sheet"){
        await loadCombatCharacterSheet(text.split("|")[0]);
    }
    
    $(".textbox").css("background-color",$(".character-box-content").css("background-color"));
}

const loadCharacter = function(text){
    return new Promise((resolve) =>{
        $.ajax({
            method: "GET",
            url: `/character/${text.replace("[CHARACTER]","")}/style`,
            success: function(res){
                $("#appended-style").remove();
                $("head").append($("<link id='appended-style' rel='stylesheet' type='text/css' />").attr('href',`/styles/characters/${res}.css`))
                resolve();
            }
        })
    })
}
const loadCharacterComponent = function(text){
    return new Promise((resolve) =>{
        $.ajax({
            method: "GET",
            url: `/character/${text.replace("[CHARACTER]","")}/component/view`,
            success: function(res){
                $("#player-bottom").append('<section id="character-page"></section>')
                $("#character-page").css("transform","translateY(0%)")
                $(".textbox").css("color","black");
                $("#character-page").html(res);
                resolve();
            }
        })
    })
}
const loadCharacterBasicSheet = function(text){
    return new Promise((resolve) =>{
        $.ajax({
            method: "GET",
            url: `/character/${text.replace("[CHARACTER]","")}/component/basic-sheet/view`,
            success: function(res){
                $("#character-sheet").html(res);
                $(".character-nav-button").addClass("character-nav-button-unselected");
                $("#basic-character-sheet-button").removeClass("character-nav-button-unselected");
                resolve();
            }
        })
    })
}
const loadAdvancedStatSheet = function(text){
    return new Promise((resolve) =>{
        $.ajax({
            method: "GET",
            url: `/character/${text.replace("[CHARACTER]","")}/component/stat-sheet/view`,
            success: function(res){
                $("#character-sheet").html(res);
                $(".character-nav-button").addClass("character-nav-button-unselected");
                $("#advanced-stat-sheet-button").removeClass("character-nav-button-unselected");
                resolve();
            }
        })
    })
}
const loadCombatCharacterSheet = function(text){
    return new Promise((resolve) =>{
        $.ajax({
            method: "GET",
            url: `/character/${text.replace("[CHARACTER]","")}/component/combat-sheet/view`,
            success: function(res){
                $("#character-sheet").html(res);
                $(".character-nav-button").addClass("character-nav-button-unselected");
                $("#combat-character-sheet-button").removeClass("character-nav-button-unselected");
                resolve();
            }
        })
    })
}


const loadImage = function(url){
    if(url.startsWith("[TOP]")){
        $("#background").css("background-position", "top");
        url = url.replace("[TOP]","");
    }else{
        $("#background").css("background-position", "center center");
    }
    $("#background").css("background-image", `url('${url}')`);
}

const addText = function () {
    if (index <= eventText.length) {
        index++;
    }
    if (index == eventText.length) {
        $("#gamemaster-box").after(`<form id="user-input"><input type="text" name="user-input" class="boxtext" action="/story/${eventId}/" method="POST"><input type="submit" value="Submit" id="submit"></form>`)
        if($("#gamemaster-box").hasClass("invisible")){
            $("#user-input").css("display","none");
        }
        return '';
    } else if (index < eventText.length) {
        console.log(eventText[index])
        if (!eventText[index].startsWith("[")) {
            return eventText[index];
        } else {
            return specialCommand(eventText[index]);
        }
    }
    return '';
}

const typeWriter = async function(returnString, i, speed, txt, sentIndex, id, speedMod, otherText) {
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
            if(index==sentIndex+1){
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

const nextLine = async function () {
    $("#click-signifier").remove();
    console.log(index);
    let returnedText = "";
    if (index !== eventText.length) {
        returnedText = addText();
        returnedText = $("#htmlConverter").html(returnedText).html();
    }
    if (returnedText !== "") {
        $("#player-bottom").append(`<p id="boxtext-${index}" class='boxtext'></p>`);
        $(`#boxtext-${index}`).css("visibility","hidden");
        $(`#boxtext-${index}`).text(returnedText);
        $(`#boxtext-${index}`).height($(`#boxtext-${index}`).height());
        if(index<eventText.length-1)
        $("#player-bottom").append("<div id='click-signifier'><i class='fas fa-scroll fa-blink'></i></div>")
        $(".textbox").scrollTop($(".textbox").prop("scrollHeight"));
        $("#gamemaster-box").scrollTop($("#gamemaster-box").prop("scrollHeight"));
        $(`#boxtext-${index}`).text("");
        $(`#boxtext-${index}`).css("visibility","visible");
        await typeWriter("", 0, 4,returnedText,index, `#boxtext-${index}`, 1);
        $("#click-signifier").css("visibility", "visible");
        $(`#boxtext-${index}`).height("auto");
        appendGamemasterText(returnedText);
    }

    if (!listenerAdded) {
        if ($("#user-input").length) {
            $("#user-input").submit(function (event) {
                listenerAdded = false;
                event.preventDefault();
                let formData = $(this).serialize();
                formData = formData.substring(11);
                if (formData) {
                     $.ajax({
                        method: "POST",
                        url: `/story/${eventId}/${formData}`,
                        success: function (res) {
                            socket.emit('nextLine', res);
                            $("#user-input").remove();
                            listenerAdded = false;
                            index--;
                        }
                    }) 
                } else {
                    console.log("Empty");
                    listenerAdded = true;
                }
            })
            listenerAdded = true;
        }
    }
    if(index<eventText.length)
        $(".textbox").scrollTop($(".textbox").prop("scrollHeight"));
        $("#gamemaster-box").scrollTop($("#gamemaster-box").prop("scrollHeight"));
    if(index>2&!titleLoaded){
        titleLoaded = true;
    }

}

$(".textbox").on("click", nextLine);

$("body").on("keydown", function (e) {
    if (e.keyCode == 17) {
        if(enterButton)
        nextLine();
    }
})

$("body").on("keypress", function (e) {
    if (e.keyCode == 13) {
        if(ctrlButton)
        nextLine();
    }
})

$("#gamemaster-tab").on("click", function () {
    $("#gamemaster-box").removeClass("invisible");
    $("#player-box").addClass("invisible");
    $("#player-tab").addClass("unselected");
    $("#gamemaster-tab").removeClass("unselected");
    $("#gamemaster-box").scrollTop($("#gamemaster-box").prop("scrollHeight"));
    $("#user-input").css("display","flex");
})
$("#player-tab").on("click", function () {
    $("#gamemaster-box").addClass("invisible");
    $("#player-tab").removeClass("unselected");
    $("#gamemaster-tab").addClass("unselected");
    $("#player-box").removeClass("invisible");
    $(".textbox").scrollTop($(".textbox").prop("scrollHeight"));
    $("#user-input").css("display","none");
})


window.history.replaceState(eventId,"");
loadEventId();