const socket = io();
let listenerAdded = false;
let index = -1;
let song;
let soundEffect;
let eventText = [];
let images = story.images;
let ctrlButton = true;
let enterButton = true;
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
    nextLine();
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

const specialCommand = function (text) {
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
            $("#player-bottom").append(`<p id="boxtext-${index}" class='boxtext other'>${text}</p>`);
        }else{
            text = text.replace("[]","");
            text1 = text.split("[OTHER]")[0];
            text2 = text.split("[OTHER]")[1];
            text3 = text.split("[OTHER]")[2];
            $("#player-bottom").append(`<p id="boxtext-${index}" class='boxtext'>${text1}<span class='other'>${text2}</span>${text3}</p>`);
        }
        return "";
    }
    if(text.startsWith("[TYPE]")){
        text = text.replace("[TYPE]","");
        $("#player-bottom").append(`<p id="boxtext-${index}" class='boxtext eventType'>${text}</p>`);
        nextLine();
        return "";
    }
    if(text.startsWith("[TITLE]")){
        text = text.replace("[TITLE]","");
        $("#player-bottom").append(`<p id="boxtext-${index}" class='boxtext title'>${text}</p>`);
        nextLine();
        return "";
    }
    if(text.startsWith("[SUBTITLE]")){
        text = text.replace("[SUBTITLE]","");
        $("#player-bottom").append(`<p id="boxtext-${index}" class='boxtext subtitle'>${text}</p>`);
        nextLine();
        return "";
    }
    if(text.startsWith("[EMPTYONE]")){
        $("#player-bottom").append(`<div id="boxtext-${index}" class='boxtext big-boy'></div>`);
        setTimeout(function(){
            $(`#boxtext-${index}`).css("transition","500ms");
        },500)
        $(".big-boy").height(($("#player-box").height()/2))
        nextLine();
        return "";
    }
    if(text.startsWith("[EMPTYTWO]")){
        $("#player-bottom").append(`<div id="boxtext-${index}" class='boxtext big-boy'></div>`);
        setTimeout(function(){
            $(`#boxtext-${index}`).css("transition","500ms");
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
        setTimeout(function(){
            nextLine();
        },500)
        return "";
    }
    /* TURN TITLE */
    if(text.startsWith("[TURN TITLE]")){
        $("#background").css("background-image", `url(https://aozora.s3.us-east-2.amazonaws.com/1621228479216-Book.jpg)`);
        $("#player-bottom").append(`<div id="boxtext-${index}" class='boxtext big-boy'></div>`);
        $(".big-boy").height(($("#player-box").height()/2))
        $("#player-bottom").append(`<p class='boxtext turn-title'>Turn ${text.replace("[TURN TITLE]","").split("|")[0]}</p>`);
        $("#player-bottom").append(`<p class='boxtext turn-subtitle'>${text.replace("[TURN TITLE]","").split("|")[1].charAt(0).toUpperCase() + text.replace("[TURN TITLE","").split("|")[1].slice(1)} of Year ${text.replace("[TURN TITLE","").split("|")[2]}</p>`);
        $("#player-bottom").append(`<div id="boxtext-${index}" class='boxtext big-boy'></div>`);
        $(".big-boy").height(($("#player-box").height()  - $(".turn-title").height() - $(".turn-subtitle").height() - 40)/2)
        return "";
    }
    if(text.startsWith("[STORY TITLE]")){
        $("#background").css("background-image", `url(https://wallpaper-mania.com/wp-content/uploads/2018/09/High_resolution_wallpaper_background_ID_77700604135.jpg)`);
        $("#player-bottom").append(`<div id="boxtext-${index}" class='boxtext big-boy'></div>`);
        $(".big-boy").height(($("#player-box").height()/2))
        $("#player-bottom").append(`<p class='boxtext story-supertitle'>Not! Conquering High Fantasy</p>`);
        $("#player-bottom").append(`<p class='boxtext story-title'>Legends of Alysteria</p>`);
        $("#player-bottom").append(`<p class='boxtext story-subtitle'>The ${text.replace("[STORY TITLE]","")} Collection</p>`);
        $("#player-bottom").append(`<div id="boxtext-${index}" class='boxtext big-boy'></div>`);
        $(".big-boy").height(($("#player-box").height() - $(".story-supertitle").height() - $(".story-title").height() - $(".story-subtitle").height() -60)/2)
        return "";
    }
    if(text.startsWith("[AREA TITLE]")){
        $("#background").css("background-image", `url(https://aozora.s3.us-east-2.amazonaws.com/1621228479216-Book.jpg)`);
        $("#player-bottom").append(`<div id="boxtext-${index}" class='boxtext big-boy'></div>`);
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
        $("#player-bottom").append(`<div id="boxtext-${index}" class='boxtext big-boy'></div>`);
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
        $("#player-bottom").append(`<div id="boxtext-${index}" class='boxtext big-boy'></div>`);
        $(".big-boy").height(($("#player-box").height()/2))
        $("#player-bottom").append(`<p class='boxtext story-supertitle'>Legends of Alysteria</p>`);
        $("#player-bottom").append(`<p class='boxtext story-title'>${text.replace("[CHARACTER TITLE]","").split("|")[0]}</p>`);
        $("#player-bottom").append(`<p class='boxtext story-subtitle'>Player: ${text.split("|")[1]}</p>`);
        $("#player-bottom").append(`<p class='boxtext story-subsubtitle'>${text.split("|")[2]}</p>`);
        $("#player-bottom").append(`<div id="boxtext-${index}" class='boxtext big-boy'></div>`);
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
        for(let x=0; x<numberOfOptions; x++){
            if(text.split("|")[x+3].startsWith("[CHOSEN]")){
                $("#choice").append(`<p class='choice-option chosen-option'>${text.split("|")[x+3].replace("[CHOSEN]","")}</p>`)
                $(".chosen-option").on("click",function(){
                    $("#choice-container").css("display","none");
                    ctrlButton = true;
                    enterButton = true;
                })
            }
            else
            $("#choice").append(`<p class='choice-option unchosen-option'>${text.split("|")[x+3]}</p>`)
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
}

const loadCharacterAndCss = async function(text){
    await loadCharacter(text.split("|")[0]);
    await loadCharacterComponent(text.split("|")[0]);
    await loadCharacterBasicSheet(text.split("|")[0]);
    if(text.split("|")[1] == "stat-sheet")
    $("#advanced-stat-sheet-button").removeClass("invisible");
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
                $("#basic-character-sheet-button").removeClass("character-nav-button-unselected");
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

const nextLine = function () {
    console.log(index);
    let returnedText = "";
    if (index !== eventText.length) {
        returnedText = addText();
    }
    if (returnedText !== "") {
        $("#player-bottom").append(`<p id="boxtext-${index}" class='boxtext'>${returnedText}</p>`);
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
    $(".textbox").scrollTop($(".textbox").prop("scrollHeight"));
    $("#gamemaster-box").scrollTop($("#gamemaster-box").prop("scrollHeight"));
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