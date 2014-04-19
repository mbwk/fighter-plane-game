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

    rdr.writestats = function (player) {
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

        rdr.ctx.fillStyle = "rgb(10, 0, 0)";
        rdr.ctx.fillRect(rdr.gamewidth - 5, 0, 10, rdr.cvs.height);
    }

    rdr.render_menustate = function () {
        
    };

    rdr.render_gamestate = function (player, enemies, pbullets, ebullets) {
        rdr.ctx.drawImage(rdr.bgImg, 0, rdr.scroller);
        rdr.scroller += 2;

        if (rdr.scroller > 0) {
            rdr.scroller = rdr.origin;
        }

        // later, check if player is alive first
        rdr.draw_img(player);

        var i;
        for (i = enemies.length - 1; i >= 0; --i) {
            rdr.draw_img(enemies[i]);
        }
        for (i = pbullets.length - 1; i >= 0; --i) {
            rdr.draw_img(pbullets[i]);
        }
        for (i = ebullets.length - 1; i >= 0; --i) {
            rdr.draw_img(ebullets[i]);
        }

        rdr.writestats(player);

        ++rdr.delay;

        if (rdr.delay > 25) {
            ++player.distance;
            rdr.delay = 0;
        }
    };

    rdr.render_gameover = function () {
        
    };

    rdr.render = function(player, enemies, pbullets, ebullets) {
        if (gameover) {
            rdr.render_gameover();
        } else if (menustate) {
            rdr.render_menustate();
        } else {
            // game state
            rdr.render_gamestate(player, enemies, pbullets, ebullets);
        }
    };

    return rdr;
}
