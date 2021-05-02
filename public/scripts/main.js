const load = async function(newState){
    await reset();
    if(newState === "character" ){
        await character();
        newState = "characterBasic";
    }
        if(newState === "characterBasic"){
            characterBasic();
        }
        if(newState === "characterCombat"){
            characterCombat();
        }
    if(newState === "editCharacter"){
        await editCharacter();
        newState = "editCharacterBasic";
    }
        if(newState === "editCharacterBasic"){
            editCharacterBasic();
        }
    if(newState === "login"){
        login();
    }
    if(newState === "register"){
        register();
    }
    state = newState;
}

load(state);


$("#login-button").on("click", function(){
    load("login");
})
$("#register-button").on("click", function(){
    load("register");
})

$("#login-form").on("submit", function(e){
    e.preventDefault();
    const formData = $(this).serialize();
    $.ajax({
        method: "POST",
        url: "/login",
        data: formData,
        success: function (res) {
          $("#response-message").html(res);
          if (res === "Login Successful!") {
            /* Change Page State */
          } else {
            /* Error */
          }
        }
      })
})

$("#registration-form").submit(function (e) {
    e.preventDefault();
    const formData = $(this).serialize();
    $.ajax({
      method: "POST",
      url: "/register",
      data: formData,
      success: function (res) {
        $("#response-message").html(res);
        if (res === "Registration Successful!") {
          /* Change Page State */
        } else {
          /* Error */
        }
      }
    })
  })