"use strict";

/* canvas and context are global vars
 * the actual canvas is global anyway */
var cvs = document.getElementById("gamecanv");
var ctx = cvs.getContext("2d");

/* some info that is helpful to be known globally */
var MOUSEPOS = { x:0, y:0 };
var MOUSECLICKED = false;
var MOUSECLICKPOS = { x:0, y:0 };

/* interface vars */
var gamewidth = 512;
var hudwidth = 275;

/* game states */
var gameover = false;
var gamestate = true;
var menustate = false;


function get_mouse_xy(evt)
{
    var rect = cvs.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function get_radians(selfx, selfy, otherx, othery)
{
    var diffx = otherx - selfx;
    var diffy = othery - selfy;
    return Math.atan2(diffy, diffx);
}

function get_radians_for(obja, objb)
{
    return get_radians(obja.x + 16, obja.y + 16, objb.x, objb.y);
}

function draw_img(object)
{
    ctx.drawImage(
            object.img,
            object.x - (object.width / 2),
            object.y - (object.height / 2)
            );
}

function writestats(player)
{
    ctx.fillStyle = "#995500";
    ctx.fillRect(gamewidth, 0, hudwidth, cvs.height);

    ctx.fillStyle = "rgb(150, 0, 0)";
    ctx.font = "28px Meiryo";
    ctx.fillText("昭和十七年", gamewidth + 65, 50);

    ctx.fillStyle = "rgb(250, 250, 150)";
    ctx.strokeStyle = "rgb(0, 0, 0)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseLine = "top";

    var ystart = 100;
    var xstart = gamewidth + 15;

    ctx.strokeText("Kills: " + player.kills, xstart, ystart);
    ctx.fillText("Kills: " + player.kills, xstart, ystart);

    ctx.strokeText("Distance: " + player.distance, xstart, ystart + 30);
    ctx.fillText("Distance: " + player.distance, xstart, ystart + 30);

    ctx.strokeText("HP: " + player.hitpoints + "/" + player.maxhp, xstart, ystart + 60);
    ctx.fillText("HP: " + player.hitpoints + "/" + player.maxhp, xstart, ystart + 60);

    ctx.fillStyle = "rgb(10, 0, 0)";
    ctx.fillRect(gamewidth - 5, 0, 10, cvs.height);
}

