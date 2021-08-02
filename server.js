const express = require("express");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const app = express();
const db = require("./models");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const PORT = process.env.PORT;

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({extended:true}));

/* Auth Session */
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

/* Auth */
app.use(async function(req,res,next){
    if(req.session.currentUser){
        req.session.currentUser = await db.User.findById(req.session.currentUser._id);
        app.locals.game = await db.Game.findById('610705a3f252e8aec6989328')
        console.log(app.locals.game)
        app.locals.user = req.session.currentUser;
    }else{
        app.locals.user = false;
    }
    if(req.session.currentPlayer){
        req.session.currentPlayer = await db.Player.findById(req.session.currentPlayer._id);
        app.locals.player = req.session.currentPlayer;
    }else{
        app.locals.player = false;
    }
    next();
}) 

/* Home Page Loading */
app.get("/", function(req,res){
    res.render('base',{states: ["start"],data: [{}]});
})

/* Component Loading */
app.post("/component/:component", async function(req,res){
    let model = {};
    let url = `components/${req.params.component.toLowerCase()}`;
    if(req.body.model){
        console.log(`db.${req.body.model.name}.findById('${req.body.model.id}')`)
        model = await eval(`db.${req.body.model.name}.findById('${req.body.model.id}')`)
    }
    if(req.params.component.includes(">")){
        url = `components/${req.params.component.split(">")[0].toLowerCase()}`;
        for(let x=1; x<req.params.component.split(">").length; x++){
            model[req.params.component.split(">")[x].split("=")[0]] = req.params.component.split(">")[x].split("=")[1];
        }
    }
    console.log("Model: " + model);
    res.render(url, model);
})

/* Model Updating */
app.post("/update/:model/:id", async function(req,res){
    let model = req.params.model.charAt(0).toUpperCase() + req.params.model.slice(1);
    let foundModel = await eval(`db.${model}.findByIdAndUpdate('${req.params.id}',${JSON.stringify(req.body)})`);
    res.send(foundModel);
})

/* Page Loading */
app.get("/*", function(req, res){
    let states = [];
    let data = [];
    for(let x=1; x<req.url.split("/").length; x++){
        if(req.url.split("/")[x].includes("%7C")){
            let model = {};
            model.name = req.url.split("/")[x].split("%7C")[1].split("=")[0].charAt(0).toUpperCase() + req.url.split("/")[x].split("%7C")[1].split("=")[0].slice(1); 
            model.id = req.url.split("/")[x].split("%7C")[1].split("=")[1];
            data.push(model)
            states.push(req.url.split("/")[x].split("%7C")[0]);
        }else{
            states.push(req.url.split("/")[x]);
            data.push({});
        }
    }
    res.render('base',{states: states, data: data});
})

/* Login */
app.post("/login", async function(req, res){
    const foundUser = await db.User.findOne({username: req.body.username});
    if(!foundUser) return res.send({displayText: "That username doesn't exist!"})
    const match = await bcrypt.compare(req.body.password, foundUser.password);
    if(!match) return res.send({displayText: "Password Invalid"});
    req.session.currentUser = foundUser;
    if(foundUser.gamemaster)
    return res.redirect("/");
    else
    return res.redirect("/");
})

/* Register */
app.post("/register", async function(req, res){
    const foundUser = await db.User.findOne({username: req.body.username});
    if(foundUser) return res.send("This username already exists!");
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    req.body.password = hash;
    req.body.avatar = "/images/avatar_placeholder.png";
    req.body.bio = "This user hasn't written a bio yet!";
    req.body.gamemaster = false;
    req.body.settings = {pageSpeed: 1000, textSpeed: 50, musicVolume: .1, soundVolume: .1};
    const newUser = await db.User.create(req.body);
    console.log(newUser);
    req.session.currentUser = newUser;
    return res.redirect("/")
})

/* Logout */
app.post("/logout", async function(req,res){
    req.session.currentUser = false;
    req.session.currentPlayer = false;
    return res.redirect("/main/login")
})

app.listen(PORT, function(){
    console.log(`Live at http://localhost:${PORT}/`);
})