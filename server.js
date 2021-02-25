const express = require("express");
const session = require('express-session');
const fileUpload = require('express-fileupload');
const MongoStore = require('connect-mongo').default;
const db = require("./models");

const ctrl = require("./controllers");

const app = express();
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

app.listen(PORT, function(){
    console.log(`Live at http://localhost:${PORT}/`);
})