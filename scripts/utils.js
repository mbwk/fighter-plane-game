/* canvas and context are global vars
 * the actual canvas is global anyway */
var cvs = document.getElementById("gamecanv");
var ctx = cvs.getContext("2d");

/* some info that is helpful to be known globally */
var MOUSEPOS = { x:0, y:0 };
var MOUSECLICKED = false;
var MOUSECLICKPOS = { x:0, y:0 };

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
    ctx.drawImage(object.img, object.x - (object.width / 2), object.y - (object.height / 2));
}

function writestats(player)
{
        ctx.fillStyle = "rgb(250, 250, 150)";
        ctx.strokeStyle = "rgb(0, 0, 0)";
        ctx.font = "24px Helvetica";
        ctx.textAlign = "left";
        ctx.textBaseLine = "top";

        ctx.strokeText("Kills: " + player.kills, 14, 24);
        ctx.fillText("Kills: " + player.kills, 14, 24);

        ctx.strokeText("Distance: " + player.distance, 154, 24);
        ctx.fillText("Distance: " + player.distance, 154, 24);

        ctx.strokeText("HP: " + player.hitpoints + "/" + player.maxhp, 354, 24);
        ctx.fillText("HP: " + player.hitpoints + "/" + player.maxhp, 354, 24);
}
