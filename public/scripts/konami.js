$("html").on("keydown", function (e) {
    if (e.keyCode == 38) {
       konamiCode();
    }
})

let konamiCode = function(){
    $("html").off("keydown")
    $("html").on("keydown", function (e) {
        if (e.keyCode == 38) {
            $("html").off("keydown")
            $("html").on("keydown", function (e) {
                if (e.keyCode == 40) {
                    $("html").off("keydown")
                    $("html").on("keydown", function (e) {
                        if (e.keyCode == 40) {
                            $("html").off("keydown")
                            $("html").on("keydown", function (e) {
                                if (e.keyCode == 37) {
                                    $("html").off("keydown")
                                    $("html").on("keydown", function (e) {
                                        if (e.keyCode == 39) {
                                            $("html").off("keydown")
                                            $("html").on("keydown", function (e) {
                                                if (e.keyCode == 37) {
                                                    $("html").off("keydown")
                                                    $("html").on("keydown", function (e) {
                                                        if (e.keyCode == 39) {
                                                            $("html").off("keydown")
                                                            activateKonami();
                                                            $("html").on("keydown", function(e){
                                                                if(e.keyCode == 38){
                                                                    konamiCode();
                                                                }
                                                            })
                                                        }else{
                                                            konamiCode();
                                                        }
                                                    })
                                                }else{
                                                    konamiCode();
                                                }
                                            })
                                        }else{
                                            konamiCode();
                                        }
                                    })
                                }else{
                                    konamiCode();
                                }
                            })
                        }else{
                            konamiCode();
                        }
                    })
                }else{
                    konamiCode();
                }
            })
        }else{
            $("html").on("keydown", function(e){
                if(e.keyCode == 38){
                    konamiCode();
                }
            })
        }
    })
}

let activateKonami = function(){
    $("body").css("transition","1000ms");
    $("body").css("transform","rotate(360deg)");
    setTimeout(function(){
        $("body").css("transition","0ms");
        $("body").css("transform","unset");
    },1000)
}