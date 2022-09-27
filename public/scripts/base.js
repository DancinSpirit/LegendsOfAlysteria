let buttons = {};

const deactivateButtons = function(x){
    return new Promise(async function(resolve){
        $("body").off("click");
        if(x==0){
            $("body").off("keydown");
            $("body").off("keypress");
            $Object = $(`#sub-base`)
        }else{
            $Object = $(`#sub-${states[x-1]}`)
        }
        await deactivateLayer($Object);
        resolve();
    })
}

const deactivateLayer = function($Object){
    return new Promise(async function(resolve){
        await $Object.off("click");
        for(let x=0; x<$Object.children().length; x++){
            await deactivateLayer($($Object.children()[x]))
        }
        resolve();
    })
}

var isMobile = false;
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
    isMobile = true;
}

const login = async function(username, password){
    return new Promise((resolve)=>{
        $.ajax({
            method: "POST",
            url: `/login`,
            data: {username, password},
            success: (res)=>{
                user = res.user;
                resolve(res);
            }
        }) 
    })
}

const register = async function(username, password, firstName, lastName){
    return new Promise((resolve)=>{
        $.ajax({
            method: "POST",
            url: `/register`,
            data: {username, password, firstName, lastName},
            success: (res)=>{
                user = res.user;
                resolve(res);
            }
        }) 
    })
}

const logout = async function(){
    return new Promise((resolve)=>{
        $.ajax({
            method: "POST",
            url: `/logout`,
            success: (res)=>{
                user = false;
                resolve(res);
            }
        }) 
    })
}

const loadDatabaseObject = async function(name, id){
    return new Promise((resolve)=>{
        $.ajax({
            method: "GET",
            url: `/data/${name}/${id}`,
            success: (res)=>{
                resolve(res);
            }
        }) 
    })
}

const loadAllDatabaseObjects = async function(name){
    return new Promise((resolve)=>{
        $.ajax({
            method: "GET",
            url: `/data/${name}`,
            success: (res)=>{
                resolve(res);
            }
        }) 
    })
}

const loadDatabaseObjectByProperty = async function(name, property, value){
    return new Promise((resolve)=>{
        $.ajax({
            method: "GET",
            url: `/data/${name}/${property}/${value}`,
            success: (res)=>{
                resolve(res);
            }
        }) 
    })
}

const createDatabaseObject = async function(name,data){
    return new Promise((resolve)=>{
        $.ajax({
            method: "POST",
            url: `/create/${name}`,
            data: data,
            success: (res)=>{
                resolve(res);
            }
        }) 
    })    
}

const updateStory = async function(id,updateType,updateKey, updateValue, settings){
    return new Promise((resolve)=>{
        $.ajax({
            method: "POST",
            url: `/update2/Story/${id}`,
            data: {updateKey: updateKey, updateValue: updateValue ,settings: settings, updateType: updateType},
            success: (res)=>{
                resolve(res);
            }
        }) 
    })
}


const updateDatabaseObject = async function(name,id,data){
    return new Promise((resolve)=>{
        $.ajax({
            method: "POST",
            url: `/update/${name}/${id}`,
            data: data,
            success: (res)=>{
                resolve(res);
            }
        }) 
    })
}

const loadComponent = async function(component, databaseObjects, customData){
    return new Promise((resolve)=>{
        $.ajax({
            method: "POST",
            url: `/component/${component}`,
            data: {databaseObjects: databaseObjects, customData: customData},
            success: (res)=>{
                resolve(res);
            }
        }) 
    })
}

const componentCheck = async function(component){
    if(component.includes("<component>")){
        let components = [];
        for(let y=1; y<component.split("<component>").length; y++){
            components.push(component.split("<component>")[y].split("</component>")[0]);
        }
        for(let y=0; y<components.length; y++){
            let databaseObjects = [];
            let customData = {};
            if(components[y].split("<database>").length>1){
                for(let x=0; x<components[y].split("<database>")[1].split("|").length; x++){
                    databaseObjects.push({name: components[y].split("<database>")[1].split("|")[x].split("=")[0], id: components[y].split("<database>")[1].split("|")[x].split("=")[1].split("</database>")[0]});
                }
            }
            if(components[y].split("<data>").length>1){
                for(let x=0; x<components[y].split("<data>")[1].split("|").length; x++){
                    customData[components[y].split("<data>")[1].split("|")[x].split("=")[0]] = components[y].split("<data>")[1].split("|")[x].split("=")[1].split("</data>")[0];
                }
            }
            if(!databaseObjects.length){
                databaseObjects = false;
            }
            let newComponent = await loadComponent(components[y].split("<database>")[0].split("<data>")[0], databaseObjects, customData); 
            newComponent = await componentCheck(newComponent);
            component = component.replace("<component>" + components[y] + "</component>", newComponent);
        }
    }
    return component;
}

const loadState = async function(x, animation){
    $("#warp-style").remove();
    $("body").append("<div id='button-blocker'></div>")
    keyButtons = false;
    await deactivateButtons(x);
    if(isMobile){
        if(!$(`#${states[x]}-style`).length){
            $("head").append(`<link id="${states[x]}-style" rel="stylesheet" href="/phone-styles/${states[x]}.css">`)
        }
    }else{
        if(!$(`#${states[x]}-style`).length){
            $("head").append(`<link id="${states[x]}-style" rel="stylesheet" href="/styles/${states[x]}.css">`)
        }
    }
    let component = await loadComponent(states[x],databaseObjects[x],customData[x]);    
    if(component.includes("<background>")){
        let background = component.split("<background>")[1].split("</background>")[0];
        if(background.includes("[TOP]")){
            $("body").css("background-position","top");
        }else{
            $("body").css("background-position","center");
        }
        $("body").css("background-image",`url("${background.replace("[TOP]","")}"`);
    }
    component = await componentCheck(component);
    let previousState;
    if(x==0){
        previousState = "base";
    }else{
        previousState = states[x-1];
    }
    if(animation){
        await animations[animation](previousState,component);
    }else{
        if(component.includes("<animation>")){
            await animations[component.split("<animation>")[1].split("</animation>")[0]](previousState, component);
        }else{
            await animations.left(previousState, component);
        }
    }
    $("#button-blocker").remove();
    keyButtons = true;
}

const loadStates = async function(){
    if(!user.firstName&&(states[1]!="login"&&states[1]!="register")){
        states = ["main","login"];
        databaseObjects = [false,false];
        customData = [false,false];
        window.history.replaceState({states:states,databaseObjects:databaseObjects,customData:customData}, "login", "/main/login");
    }else if(user.firstName&&(states[1]=="login"||states[1]=="register")){
        states = ["main","home"];
        databaseObjects = [false,false];
        customData = [false,false];
        window.history.replaceState({states:states,databaseObjects:databaseObjects,customData:customData}, "home", "/main/home");
    }
    for(let x=0; x<states.length; x++){
        await loadState(x);
    }
}

window.addEventListener('popstate',async function(event){
    if(!user&&(event.state.states[1]!="login"&&event.state.states[1]!="register")){
        event.state.states = ["main","login"];
        event.state.databaseObjects = [false,false];
        event.state.customData = [false,false];
        window.history.replaceState({states:event.state.states,databaseObjects:event.state.databaseObjects,customData:event.state.customData}, "login", "/main/login");
    }else if(user&&(event.state.states[1]=="login"||event.state.states[1]=="register")){
        event.state.states = ["main","home"];
        event.state.databaseObjects = [false,false];
        event.state.customData = [false,false];
        window.history.replaceState({states:event.state.states,databaseObjects:event.state.databaseObjects,customData:event.state.customData}, "home", "/main/home");
    }
    let startingIndex = 0;
    let databaseObjectsSame = true;
    let customDataSame = true;
    let x=0;
    while(x==0){
        if(startingIndex<states.length){
            for(let y=0; y<event.state.databaseObjects[startingIndex].length; y++){
                if(event.state.databaseObjects[startingIndex][y].id != databaseObjects[startingIndex][y].id){
                    databaseObjectsSame = false;
                }
            }
            if(JSON.stringify(event.state.customData[startingIndex])!=JSON.stringify(customData[startingIndex])){
                customDataSame = false;
            }
            if((states[startingIndex]==event.state.states[startingIndex])&&(databaseObjectsSame)&&(customDataSame)){
                startingIndex++;
                x--;
            }
        }
        x++;
    }
    for(let x=startingIndex; x<event.state.states.length; x++){
        states = event.state.states;
        databaseObjects = event.state.databaseObjects;
        customData = event.state.customData;
        await loadState(x);
    }
})

function setCookieStates(){
    setInfinityCookie("origin-states",states);
    setInfinityCookie("origin-databaseObjects",JSON.stringify(databaseObjects));
    setInfinityCookie("origin-customData",JSON.stringify(customData));
}

function getCookieStates(){
    states = convertCookieToArray(getCookie("origin-states"));
    try{
        databaseObjects= JSON.parse(getCookie("origin-databaseObjects"));    
    }catch(e){
        databaseObjects= convertCookieToArray(getCookie("origin-databaseObjects"));    
    }
    try{
        customData = JSON.parse(getCookie("origin-customData"));  
    }catch(e){
        customData = convertCookieToArray(getCookie("origin-customData"));    
    }
}

function setInfinityCookie(name, value){
    document.cookie = name + "=" + value + ";  path=/";
}

function setCookie(name, value) {        
    let date = new Date();        
    date.setTime(date.getTime() + (10 * 1000));        
    const expires = "expires=" + date.toUTCString();        
    document.cookie = name + "=" + value + "; " + expires + "; path=/";
}

function getCookie(name){
    let cookies = document.cookie.split("; ");
    for(let x=0; x<cookies.length; x++){
        if(cookies[x].split("=")[0]==name){
            return cookies[x].split("=")[1];
        }
    }
}

function convertCookieToArray(cookie){
    let array = [];
    for(let x=0; x<cookie.split(",").length; x++){
        array.push(cookie.split(",")[x]);
    }
    return array;
}

function equalArrays(array1,array2){
    if (array1.length === array2.length) {
        return array1.every((element, index) => {
            if (element === array2[index]) {
                return true;
            }
            return false;
        });
      }
      return false;
}

window.onunload = function(){
    setCookie('refreshed',true);
    setCookie('states', states);
    setCookie('databaseObjects', JSON.stringify(databaseObjects));
    setCookie('customData', JSON.stringify(customData));
}

window.onload = function(){
    if(typeof getCookie("refreshed") != "undefined"){
        let stateCookie = convertCookieToArray(getCookie("states"));
        let databaseObjectsCookie = JSON.parse(getCookie("databaseObjects"));    
        let customDataCookie = JSON.parse(getCookie("customData"));
        if(stateCookie[2]=="character"){
            states = ["story","event"];
            databaseObjects = [databaseObjectsCookie[0],databaseObjectsCookie[1]];
            customData = [customDataCookie[0],customDataCookie[1]];
        }else if(equalArrays(stateCookie,states)){
            databaseObjects = databaseObjectsCookie;
            customData = customDataCookie;
        }else{
            window.history.replaceState({states:states,databaseObjects:databaseObjects,customData:customData}, "start", window.location.href); 
        }
    }else{
        window.history.replaceState({states:states,databaseObjects:databaseObjects,customData:customData}, "start", window.location.href);
    } 
    loadStates();
}

String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

/* Quick Sort functions */
function partition(array, start, end, array2){
    const pivot = array[end];
    let pivotIndex = start;
    for(let x=start; x<end; x++){
        if(array[x]>pivot){
            [array[x],array[pivotIndex]] = [array[pivotIndex], array[x]];
            [array2[x],array2[pivotIndex]] = [array2[pivotIndex], array2[x]];
            pivotIndex++;
        }
    }
    [array[pivotIndex], array[end]] = [array[end], array[pivotIndex]];
    [array2[pivotIndex], array2[end]] = [array2[end], array2[pivotIndex]];
    return pivotIndex;
}
function quickSort(array, start, end, array2){
    if(start>=end){
        return;
    }
    if(array2){
        let index = partition(array, start, end, array2);
        quickSort(array, start, index-1, array2);
        quickSort(array, index+1, end, array2);
    }else{
        let index = partition(array, start, end);
        quickSort(array, start, index-1);
        quickSort(array, index+1, end); 
    }

}

