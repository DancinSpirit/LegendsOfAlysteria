const socket = io();
let listenerAdded = false;
let index = -1;
let song;
let eventText = [];
let images = story.images;

$.ajax({
    method: "GET",
    url: `/story/${eventId}`,
    success: function(res){
        eventText.push("[EMPTYONE]")
        eventText.push(`[TYPE] ~ ${res.type} ~ `)
        eventText.push(`[TITLE]${res.title}`);
        if(res.type==="Alysteria Prologue"){
            eventText.push("[SUBTITLE]Alysteria Prologue - Part 1")
        }
        eventText.push("[EMPTYTWO]");
        eventText.push(...res.text);
        nextLine();
    }
})

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
    console.log("Length: " + $("#player-bottom").children().length)
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
    if (text.startsWith("[MUSIC]")) {
        if(song){
            song.pause();
        }
        song = document.getElementById(text.replace('[MUSIC]', ""));
        if(song){
        song.volume = 0.2;
        song.play();
        }else{
            console.log("Not a valid audio file!")
        }
        $("#player-bottom").append(`<p id="boxtext-${index}" class='boxtext invisible'>${text}</p>`);
        appendGamemasterText(text);
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
        $("body").css("background-image", `url('${url}')`);
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
        $("#player-bottom").append(`<div id="boxtext-${index}" class='boxtext big-boy' style="transition:500ms"></div>`);
        $(".big-boy").height(($("#player-box").height()/2) - $(".eventType").height() - $(".title").height() - $(".subtitle").height())
        nextLine();
        return "";
    }
    if(text.startsWith("[EMPTYTWO]")){
        $("#player-bottom").append(`<div id="boxtext-${index}" class='boxtext big-boy' style="transition:500ms"></div>`);
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
        }
        $("body").css("background-image", `url('${url}')`);
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
        nextLine();
    }
})

$("body").on("keypress", function (e) {
    if (e.keyCode == 13) {
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



