const socket = io();
let listenerAdded = false;
let index = -1;
let song;
let soundEffect;
let eventText = [];
let images = story.images;
$("#cutaway-image").fadeOut()
$("#cutaway-subtitle").fadeOut();