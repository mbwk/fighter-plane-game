// everything to do with updating and managing the game state

function GameState(spr)
{
    var cvs = document.getElementById("gamecanv");

    var gmst = {};

    // game states
    gmst.gameover = false;
    gmst.gamemenu = false;
    gmst.gamepaused = false;

    // game entities
    gmst.player = new Player(spr, 255, 450);
    gmst.enemieslist = new Array();
    gmst.playerbullets = new Array();
    gmst.enemybullets = new Array();

    // handle mouse + keyboard events
    gmst.keysdown = {};
    gmst.mousemove = { x: 0, y: 0 };
    gmst.mouseclick = { x: 0, y: 0 };

    addEventListener("keydown", function (e) {
        gmst.keysdown[e.keyCode] = true;
    }, false);
    addEventListener("keyup", function (e) {
        delete gmst.keysdown[e.keyCode];
    }, false);
    addEventListener("mousemove", function (e) {
        // update globally stored mouse position
        gmst.mousemove = get_mouse_xy(e);
    }, false);

    gmst.moveobjects = function (modifier) {
        var i;
        for (i = gmst.enemieslist.length - 1; i >= 0; --i) {
            //enemy.move(modifier);
            gmst.enemieslist[i].y += enemy.speed * modifier;
        }
        for (i = gmst.playerbullets.length - 1; i >= 0; --i) {
            gmst.playerbullets[i].move(modifier);
        }
        for (i = gmst.enemybullets.length - 1; i >= 0; --i) {
            gmst.enemybullets[i].move(modifier);
        }
    };

    gmst.checkcollisions = function () {
        // has a bullet gone out of bounds?
        var i;
        for (i = gmst.playerbullets.length - 1; i >= 0; --i) {
            if (gmst.playerbullets[i].y < 0) {
                gmst.playerbullets.splice(i, 1);
            }
        }
        for (i = gmst.enemybullets.length - 1; i >= 0; --i) {
            if (gmst.enemybullets[i].y > cvs.height) {
                gmst.enemybullets.splice(i, 1);
            }
        }

        // has the player had a mid air collision?
        for (i = gmst.enemieslist.length - 1; i >= 0; --i) {
            if ( gmst.checkbounds(gmst.enemieslist[i], player) ) {
                player.hitby(enemieslist[i]);
                gmst.enemieslist.splice(i, 1);
            }
        }

        // has an enemy bullet hit our player?
        for (i = gmst.enemybullets.length - 1; i >= 0; --i) {
            if ( gmst.checkbounds(gmst.enemybullets[i], player) ) {
                player.hitby(bullet);
            }
        }
    };

    gmst.update = function (modifier) {
        if (38 in gmst.keysdown && gmst.player.upper() > 36 ) { // up
            // hero.y -= (hero.speed * 0.75) * modifier;
            gmst.player.move("up", modifier);
        }
        if (40 in gmst.keysdown && gmst.player.lower() < cvs.height - 16 ) { // down
            // hero.y += (hero.speed * 1.25) * modifier;
            gmst.player.move("down", modifier);
        }
        
        // left or right
        if (37 in gmst.keysdown && gmst.player.exleft() > 16 ) { // left
            // hero.x -= hero.speed * modifier;
            gmst.player.move("left", modifier);
        } else if (39 in gmst.keysdown && gmst.player.exright() < cvs.width - 16 ) { // right
            // hero.x += hero.speed * modifier;
            gmst.player.move("right", modifier);
        } else {
            gmst.player.level();
        }

        // fire
        if (32 in gmst.keysdown) {
            console.log("bang");
            gmst.playerbullets.push( gmst.player.fire(spr) );
        }

        // bring world to life
        //gmst.checkcollisions();
        gmst.moveobjects(modifier);

    };

    return gmst;
}