// everything to do with updating and managing the game state

function GameState(spr)
{
    var cvs = document.getElementById("gamecanv");

    var gmst = {};

    // game states
    gmst.gameover = false;
    gmst.gamemenu = false;
    gmst.gamepaused = false;
    gmst.stage = 0;

    // game entities
    gmst.player = new Player(spr, 255, 450);
    gmst.enemieslist = new Array();
    gmst.playerbullets = new Array();
    gmst.enemybullets = new Array();

    gmst.spawnenemies = function () {
        var stagelength = 800;
        ++gmst.stage;
        var i = 0;
        for (i = 0; i < (gmst.stage + 10) && i < 20; ++i) {
            var x = Math.floor( Math.random() * ( cvs.width - 360 + 1 ));
            var y = Math.floor( Math.random() * ( 50 - stagelength + 1 ) - 1200 );
            gmst.enemieslist.push(new EnemyKMT(spr, x, y));
        }
        console.log("spawned " + i + " kuomintang fighters...");
    }

    // handle mouse + keyboard events
    gmst.keysdown = {};
    gmst.mousepos = { x: 0, y: 0 };
    gmst.mousemovement = false;
    gmst.mouseheld = false;

    gmst.attemptshot = function () {
        if (gmst.player.offcd()) {
            gmst.playerbullets.push( gmst.player.fire(spr) );
        }
    }

    addEventListener("keydown", function (e) {
        gmst.keysdown[e.keyCode] = true;
    }, false);
    addEventListener("keyup", function (e) {
        delete gmst.keysdown[e.keyCode];
    }, false);
    addEventListener("mousemove", function (e) {
        // update globally stored mouse position
        gmst.mousepos = get_mouse_xy(e);
        gmst.mousemovement = true;
    }, false);
    addEventListener("mousedown", function (e) {
        gmst.mouseheld = true;
    }, false);
    addEventListener("mouseup", function (e) {
        gmst.mouseheld = false;
    }, false)

    gmst.moveobjects = function (modifier) {
        var i;
        for (i = gmst.enemieslist.length - 1; i >= 0; --i) {
            //enemy.move(modifier);
            gmst.enemieslist[i].move(modifier);
        }
        for (i = gmst.playerbullets.length - 1; i >= 0; --i) {
            gmst.playerbullets[i].move(modifier);
        }
        for (i = gmst.enemybullets.length - 1; i >= 0; --i) {
            gmst.enemybullets[i].move(modifier);
        }
    };

    gmst.checkbounds = function (attacker, victim) {
        var inleftbound = false, inrightbound = false,
            inbotbound = false, intopbound = false;

        inleftbound = attacker.exright() > victim.exleft();
        inrightbound = attacker.exleft() < victim.exright();
        intopbound = attacker.upper() > victim.lower();
        inbotbound = attacker.lower() < victim.upper();

        if ( (inbotbound && (inleftbound || inrightbound)) || (intopbound && (inleftbound || inrightbound)) ) {
                    return true;
        }
        return false;
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
            gmst.mousemovement = false;
        }
        if (40 in gmst.keysdown && gmst.player.lower() < cvs.height - 16 ) { // down
            // hero.y += (hero.speed * 1.25) * modifier;
            gmst.player.move("down", modifier);
            gmst.mousemovement = false;
        }
        
        // arrow key movement
        if (37 in gmst.keysdown && gmst.player.exleft() > 16 ) { // left
            // hero.x -= hero.speed * modifier;
            gmst.player.move("left", modifier);
            gmst.mousemovement = false;
        } else if (39 in gmst.keysdown && gmst.player.exright() < cvs.width - 300 ) { // right
            // hero.x += hero.speed * modifier;
            gmst.player.move("right", modifier);
            gmst.mousemovement = false;
        } else {
            gmst.player.level();
        }

        if (gmst.mousemovement) {
            gmst.player.moveto(gmst.mousepos.x, gmst.mousepos.y, modifier);
        }

        // fire
        if (32 in gmst.keysdown || gmst.mouseheld) {
            gmst.attemptshot();
        }

        // bring world to life
        //gmst.checkcollisions();
        gmst.moveobjects(modifier);

        if (gmst.enemieslist.length < 1) {
            gmst.spawnenemies();
        }

    };

    return gmst;
}