// everything to do with the render cycle

function Renderer(spr)
{
    var rdr = {};

    rdr.cvs = document.getElementById("gamecanv");
    rdr.ctx = rdr.cvs.getContext("2d");

    rdr.gamewidth = 512;
    rdr.hudwidth = 275;

    // background image

    rdr.bgimg = spr.imgs.seatile;
    rdr.bgimg.width = 66;
    rdr.bgimg.height = 65;

    rdr.origin = -1 * rdr.bgimg.height;
    rdr.scroller = rdr.origin;
    rdr.delay = 0;

    rdr.draw_bg = function ( scroller ) {
        var numvtiles = Math.floor( (rdr.cvs.height / rdr.bgimg.height) + 2);
        var numhtiles = Math.floor( (rdr.gamewidth / rdr.bgimg.width) + 1);
        var i, j;
        for (j = -1; j < numvtiles; ++j) {
            for (i = -1; i < numhtiles; ++i) {
                rdr.ctx.drawImage( rdr.bgimg, i * rdr.bgimg.width, (j * rdr.bgimg.height) + scroller );
            }
        }
    };

    rdr.draw_img = function (object) {
        rdr.ctx.drawImage( object.img, object.x - (object.width / 2), object.y - (object.height / 2) );
    };

    rdr.draw_exp = function (object) {
        var expsx = (object.cycle / 10);
        var expsy = (object.cycle % 10);
        var expswidth = object.width;
        var expsheight = object.height;
        var expx = object.x - 50;
        var expy = object.y - 50;
        var expwidth = 100;
        var expheight = 100;
        rdr.ctx.drawImage ( object.img, expsx, expsy, expswidth, expsheight, expx, expy, expwidth, expheight ); 
    };

    rdr.draw_rotated_img = function (object) {
        rdr.ctx.save();
        rdr.ctx.translate(object.x, object.y);
        rdr.ctx.rotate(Math.PI);
        rdr.ctx.drawImage(object.img, (-1 * object.width), (-1 * object.height) );
        rdr.ctx.restore();
    };

    rdr.writestats = function (player, gs) {
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

        rdr.ctx.strokeText("Stage: " + gs.stage, xstart, ystart + 90);
        rdr.ctx.fillText("Stage: " + gs.stage, xstart, ystart + 90);

        rdr.ctx.fillStyle = "black";
        rdr.ctx.fillRect(xstart, ystart + 115, 250, 10);

        rdr.ctx.fillStyle = "red";

        rdr.ctx.strokeText("RECORD:", xstart, ystart + 150);
        rdr.ctx.fillText("RECORD:", xstart, ystart + 150);

        rdr.ctx.strokeText("Highest kills: " + gs.hikill, xstart, ystart + 180);
        rdr.ctx.fillText("Highest kills: " + gs.hikill, xstart, ystart + 180);

        rdr.ctx.strokeText("Furthest distance: " + gs.hidist, xstart, ystart + 210);
        rdr.ctx.fillText("Furthest distance: " + gs.hidist, xstart, ystart + 210);

        rdr.ctx.strokeText("Highest wave: " + gs.hiwave, xstart, ystart + 240);
        rdr.ctx.fillText("Highest wave: " + gs.hiwave, xstart, ystart + 240);

        rdr.ctx.fillStyle = "rgb(10, 0, 0)";
        rdr.ctx.fillRect(rdr.gamewidth - 5, 0, 10, rdr.cvs.height);
    };

    rdr.render_menustate = function () {
        rdr.ctx.save();
        rdr.ctx.fillStyle = "grey";
        rdr.ctx.strokeStyle = "black";
        rdr.ctx.fillRect( 0, 0, rdr.cvs.width, rdr.cvs.height );
        rdr.ctx.strokeRect( 0, 0, rdr.cvs.width, rdr.cvs.height );

        var alignleft = 150;
        rdr.ctx.font = "24px Helvetica";
        rdr.ctx.fillStyle = "black";
        rdr.ctx.fillText("Welcome to Showa 17!", alignleft, 200);
        rdr.ctx.fillText("Controls: ", alignleft, 250);
        rdr.ctx.fillText("Mouse, wasd keys - movement", alignleft, 300);
        rdr.ctx.fillText("Left mouse button, space bar - shoot", alignleft, 350);
        rdr.ctx.fillText("[P]ause/[U]npause", alignleft, 400);
        rdr.ctx.fillText("[R]eset - also starts the game!", alignleft, 450);
        rdr.ctx.fillText("Try to survive 20 waves!", alignleft, 500);
    };

    rdr.render_gamestate = function (gmst) {
        rdr.draw_bg( rdr.scroller );
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

        for (i = gmst.effects.length - 1; i >= 0; --i) {
            rdr.draw_exp( gmst.effects[i] );
        }
        for (i = gmst.pickups.length - 1; i >= 0; --i) {
            rdr.draw_img( gmst.pickups[i] );
        }

        rdr.draw_img(gmst.player);

        rdr.writestats(gmst.player, gmst);

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
