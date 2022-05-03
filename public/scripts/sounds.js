let song = false;
let continueEvent = true;

const playSound = function(url){
    if(!document.getElementById(url.replace(/\s+/g, '-'))){
        $("body").append(`<audio id="${url.replace(/\s+/g, '-')}" src="/sounds/${url}.mp3"></audio>`);
    }else{
        $(`#${url.replace(/\s+/g, '-')}`).attr("src",`/sounds/${url}.mp3`)
    }
    let sound = document.getElementById(url.replace(/\s+/g, '-'));
    console.log(sound);
    sound.volume = user.settings.soundVolume;
    return new Promise(res=>{
        sound.play()
        sound.onended = res
    })
}

const loadMusic = async function(url){
    continueEvent = false;
    song.onended = function(){};
    let repeat = true;
    if(url.startsWith("[NO REPEAT]")){
        url = url.split("[NO REPEAT]")[1];
        repeat = false;
    }
    if(url.includes("Intro")){
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
                if($(song).attr("id").includes("Intro")){
                    song.onended = function(){
                        loadMusic($(song).attr("id").replace("-Intro","").replaceAll("-"," "))
                    }
                }
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