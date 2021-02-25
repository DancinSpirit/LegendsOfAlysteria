const reset = function(){

}

const character = function(){
    reset();
    $.ajax({
        method: "GET",
        url: `${window.location.href}/component`,
        success: function(res){
            $("#character-page").html(res);
        }
    })
}