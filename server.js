const express = require("express");
const session = require('express-session');
const fileUpload = require('express-fileupload');
const MongoStore = require('connect-mongo');

const ctrl = require("./controllers");

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
require("dotenv").config()

const PORT = process.env.PORT;

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({extended:true}));
app.use(fileUpload({
    createParentPath: true
}));

app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 * 1
    }  
}));

app.use(async function(req,res,next){
    if(req.session.currentUser){
    app.locals.user = req.session.currentUser;
    }else{
    app.locals.user = {};
    app.locals.user.gamemaster = false;
    if(req.url!="/login"&&req.url!="/register"){
        if(req.url=="/styles/main.css"){

        }else if(req.url=="/login/component"){

        }else if(req.url=="/register/component"){
        
        }else{
            res.redirect("/login");
        }
    }
    }
    next();
}) 

app.use("/character", ctrl.character);
app.use("/story", ctrl.story);
app.use("/combatant", ctrl.combatant)
app.use("/", ctrl.auth)

io.on('connection', (socket) => {
    socket.on('nextLine', (msg)=>{
        io.emit('nextLine', msg);
    })
    socket.on('edit', (info)=>{
        io.emit('edit', info);
    })
    socket.on('delete', (index)=>{
        io.emit('delete', index);
    })
    console.log('User Connected!');
});

http.listen(PORT, function(){
    console.log(`Live at http://localhost:${PORT}/`);
})
