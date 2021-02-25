const reset = function(){

}

const character = function(){
    reset();
    $.ajax({
        method: "GET",
        url: window.location.href,
        success: function(res){
            $("#character-page").html(res);
        }
    })
}