// everything to do with the render cycle

function Renderer()
{
    var rdr = {};

    rdr.cvs = document.getElementById("gamecanv");
    rdr.ctx = rdr.cvs.getContext("2d");

    rdr.gamewidth = 512;
    rdr.hudwidth = 275

    // background image
    rdr.bgRdy = false;
    rdr.bgImg = new Image();
    rdr.bgImg.onload = function () {
        bgRdy = true;
    };
    rdr.bgImg.src = "imgs/testbg.png";

    rdr.bglength = 1033;
    rdr.origin = (-1 * rdr.bglength) + rdr.cvs.height;
    rdr.scroller = rdr.origin;
    rdr.delay = 0;

    rdr.draw_img = function (object) {
        rdr.ctx.drawImage( object.img, object.x - (object.width / 2), object.y - (object.height / 2) );
    };

    rdr.draw_rotated_img = function (object) {
        rdr.ctx.save();
        rdr.ctx.translate(object.x, object.y);
        rdr.ctx.rotate(Math.PI);
        rdr.ctx.drawImage(object.img, (-1 * object.width), (-1 * object.height) );
        rdr.ctx.restore();
    };

    rdr.writestats = function (player, gmstage) {
        rdr.ctx.fillStyle = "#995500";
        rdr.ctx.fillRect(rdr.gamewidth, 0, rdr.hudwidth, rdr.cvs.height);

        rdr.ctx.fillStyle = "rgb(150, 0, 0)";
        rdr.ctx.font = "28px Meiryo";
        rdr.ctx.fillText("昭和十七年", rdr.gamewidth + 65, 50);

        rdr.ctx.fillStyle = "rgb(250, 250, 150)";
        rdr.ctx.strokeStyle = "rgb(0, 0, 0)";
        rdr.ctx.font = "24px Helvetica";
        rdr.ctx.textAlign = "left";
        rdr.ctx.textBaseLine = "top";

        var ystart = 100;
        var xstart = rdr.gamewidth + 15;

        rdr.ctx.strokeText("Kills: " + player.kills, xstart, ystart);
        rdr.ctx.fillText("Kills: " + player.kills, xstart, ystart);

        rdr.ctx.strokeText("Distance: " + player.distance, xstart, ystart + 30);
        rdr.ctx.fillText("Distance: " + player.distance, xstart, ystart + 30);

        rdr.ctx.strokeText("HP: " + player.hitpoints + "/" + player.maxhp, xstart, ystart + 60);
        rdr.ctx.fillText("HP: " + player.hitpoints + "/" + player.maxhp, xstart, ystart + 60);

        rdr.ctx.strokeText("Stage: " + gmstage, xstart, ystart + 90);
        rdr.ctx.fillText("Stage: " + gmstage, xstart, ystart + 90);

        rdr.ctx.fillStyle = "rgb(10, 0, 0)";
        rdr.ctx.fillRect(rdr.gamewidth - 5, 0, 10, rdr.cvs.height);
    }

    rdr.render_menustate = function () {
        
    };

    rdr.render_gamestate = function (gmst) {
        rdr.ctx.drawImage(rdr.bgImg, 0, rdr.scroller);
        rdr.scroller += 2;

        if (rdr.scroller > 0) {
            rdr.scroller = rdr.origin;
        }

        var i;
        for (i = gmst.playerbullets.length - 1; i >= 0; --i) {
            rdr.draw_img(gmst.playerbullets[i]);
        }
        for (i = gmst.enemybullets.length - 1; i >= 0; --i) {
            rdr.draw_rotated_img(gmst.enemybullets[i]);
        }
        for (i = gmst.enemieslist.length - 1; i >= 0; --i) {
            rdr.draw_img(gmst.enemieslist[i]);
        }

        rdr.draw_img(gmst.player);

        rdr.writestats(gmst.player, gmst.stage);

        ++rdr.delay;

        if (rdr.delay > 25) {
            ++gmst.player.distance;
            rdr.delay = 0;
        }
    };

    rdr.render_gameover = function () {
        var xmid = rdr.cvs.width / 2;
        var ymid = rdr.cvs.height / 2;
        rdr.ctx.save();
        rdr.ctx.strokeRect( xmid - 140, ymid - 60, 280, 120);

        rdr.ctx.fillStyle = "rgb(100, 100, 100)";
        rdr.ctx.fillRect( xmid - 140, ymid - 60, 280, 120);

        rdr.ctx.fillStyle = "black";
        rdr.ctx.fillText("Game over!", xmid - 60, ymid - 15 );
        rdr.ctx.fillText("R to reset", xmid - 55, ymid + 15);
        rdr.ctx.restore();
    };

    rdr.render_pause = function () {
        var xmid = rdr.cvs.width / 2;
        var ymid = rdr.cvs.height / 2;
        rdr.ctx.save();
        rdr.ctx.strokeRect( xmid - 140, ymid - 60, 280, 120);

        rdr.ctx.fillStyle = "rgb(100, 100, 100)";
        rdr.ctx.fillRect( xmid - 140, ymid - 60, 280, 120);

        rdr.ctx.fillStyle = "black";
        rdr.ctx.fillText("Paused", xmid - 40, ymid - 15 );
        rdr.ctx.fillText("U to unpause", xmid - 70, ymid + 15);
        rdr.ctx.restore();
    };

    rdr.render = function(gmst) {
        if (gmst.gameover) {
            rdr.render_gameover();
        } else if (gmst.gamemenu) {
            rdr.render_menustate();
        } else if (gmst.gamepaused) {
            rdr.render_pause();
        } else {
            // game state
            rdr.render_gamestate(gmst);
        }
    };

    return rdr;
}
