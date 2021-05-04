const express = require("express");
const router = express.Router();
const db = require("../models");
const bcrypt = require("bcryptjs");

/* Home Page Routing */
router.get("/", function(req,res){
    if(req.session.currentUser){
        if(req.session.currentUser.gamemaster){
            res.render("main",{state: "gamemasterHub"});
        }else{
            res.render("main",{state: "playerHome"});
        }
    }else{
        res.redirect("login");
    }
})

/* Register */
router.post("/register", async function(req, res){
    const foundUser = await db.User.findOne({username: req.body.username});
    if(foundUser) return res.send("This username already exists!");
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    req.body.password = hash;
    req.body.avatar = "/images/avatar_placeholder.png";
    req.body.bio = "This user hasn't written a bio yet!";
    const newUser = await db.User.create(req.body);
    console.log(newUser);
    req.session.currentUser = newUser;
    return res.send("Registration Successful!");
})

/* Login */
router.post("/login", async function(req, res){
    const foundUser = await db.User.findOne({username: req.body.username});
    if(!foundUser) return res.send({displayText: "That username doesn't exist!"})
    const match = await bcrypt.compare(req.body.password, foundUser.password);
    if(!match) return res.send({displayText: "Password Invalid"});
    req.session.currentUser = foundUser;
    if(foundUser.gamemaster)
    return res.send("Welcome Gamemaster!");
    else
    return res.send("Login Successful!");
})

/* Login Page */
router.get("/login", async function(req, res){
        res.render("main",{state: "login"});
})
    /* Login Component */
    router.get("/login/component", async function(req,res){
        res.render("components/login")
    })

/* Register Page */
router.get("/register", async function(req, res){
        res.render("main",{state: "register"});
})
    /* Register Component */
    router.get("/register/component", async function(req,res){
        res.render("components/register")
    })


module.exports = router;