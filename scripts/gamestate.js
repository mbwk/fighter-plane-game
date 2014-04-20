// everything to do with updating and managing the game state

function GameState(spr, snd)
{
    var cvs = document.getElementById("gamecanv");

    var gmst = {};

    gmst.reset = function () {
        // game states
        gmst.gameover = false;
        gmst.gamemenu = false;
        gmst.gamepaused = false;
        gmst.stage = 0;

        // game entities
        gmst.player = new Player(spr, snd, 255, 450);
        gmst.enemieslist = new Array();
        gmst.playerbullets = new Array();
        gmst.enemybullets = new Array();
    };

    gmst.spawnenemies = function () {
        var stagelength = 2000;
        ++gmst.stage;
        var i = 0;
        for (i = 0; i < (gmst.stage + 10) && i < 24; ++i) {
            var x = Math.random() * ( (cvs.width - 360) + 40 );
            var y = Math.random() * ( -1 * stagelength);
            gmst.enemieslist.push(new EnemyKMT(spr, snd, x, y));
        }

        if (gmst.stage < 3) {
            return;
        }

        /* from waves 3 and forward, grumman joins the enemy waves */

        for (i = 0; i < (gmst.stage + 2) && i < 16; ++i) {
            var x = Math.random() * ( (cvs.width - 360) + 40);
            var y = Math.random() * (-1 * stagelength);
            gmst.enemieslist.push(new EnemyUSN(spr, snd, x, y));
        }
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

    gmst.removedead = function (modifier) {
        var i = 0;
        for (i = gmst.enemieslist.length - 1; i >= 0; --i) {
            if (gmst.enemieslist[i].hitpoints < 1) {
                gmst.enemieslist.splice(i, 1);
                ++gmst.player.kills;
            }
        }
    };

    gmst.enemydecisions = function (modifier) {
        var i = 0;
        for (i = gmst.enemieslist.length - 1; i >= 0; --i) {
            if ( gmst.enemieslist[i].specialaction(gmst, modifier) ) {
                gmst.enemybullets.push( gmst.enemieslist[i].fire(spr) );
            }
        }
    };

    gmst.moveobjects = function (modifier) {
        var i;
        for (i = gmst.enemieslist.length - 1; i >= 0; --i) {
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

        inleftbound = attacker.exright() >= victim.exleft();
        inrightbound = attacker.exleft() <= victim.exright();
        intopbound = attacker.upper() + 20 <= victim.lower();
        inbotbound = attacker.lower() - 20 >= victim.upper();

        return (inleftbound && inrightbound && intopbound && inbotbound);
    };

    gmst.checkcollisions = function () {
        // has a bullet gone out of bounds?
        var i;
        var j;
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

        // has an enemy gone out of bounds?
        for (i = gmst.enemieslist.length - 1; i >= 0; --i) {
            if (gmst.enemieslist[i].y > cvs.height + 80) {
                gmst.enemieslist.splice(i, 1);
            }
        }

        // has the player had a mid air collision?
        for (i = gmst.enemieslist.length - 1; i >= 0; --i) {
            if ( gmst.checkbounds(gmst.enemieslist[i], gmst.player) ) {
                ++gmst.player.kills;
                gmst.player.hitby(gmst.enemieslist[i]);
                gmst.enemieslist[i].explode();
                gmst.enemieslist.splice(i, 1);
            }
        }

        // has an enemy bullet hit our player?
        for (i = gmst.enemybullets.length - 1; i >= 0; --i) {
            if ( gmst.checkbounds(gmst.enemybullets[i], gmst.player) ) {
                gmst.player.hitby(gmst.enemybullets[i]);
                gmst.enemybullets.splice( i, 1 );
                break;
            }
        }

        // has one our player's bullets hit an enemy?
        for (i = gmst.playerbullets.length - 1; i >= 0; --i) {
            for (j = gmst.enemieslist.length - 1; j >= 0; --j) {
                if ( gmst.checkbounds(gmst.playerbullets[i], gmst.enemieslist[j]) ) {
                    gmst.enemieslist[j].hitby( gmst.playerbullets[i] );
                    gmst.playerbullets.splice( i, 1 );
                    break;
                }
            }
        }
    };

    gmst.update = function (modifier) {

        if (gmst.gameover) {
            if (82 in gmst.keysdown) {
                gmst.reset();
            }
            return;
        }
        if (gmst.gamemenu) {
            return;
        }
        if (gmst.gamepaused) {
            if (85 in gmst.keysdown) {
                gmst.gamepaused = false;
            }
            return;
        }

        if (87 in gmst.keysdown && gmst.player.upper() > 36 ) { // up
            // hero.y -= (hero.speed * 0.75) * modifier;
            gmst.player.move("up", modifier);
            gmst.mousemovement = false;
        }
        if (83 in gmst.keysdown && gmst.player.lower() < cvs.height - 16 ) { // down
            // hero.y += (hero.speed * 1.25) * modifier;
            gmst.player.move("down", modifier);
            gmst.mousemovement = false;
        }
        
        // arrow key movement
        if (65 in gmst.keysdown && gmst.player.exleft() > 16 ) { // left
            // hero.x -= hero.speed * modifier;
            gmst.player.move("left", modifier);
            gmst.mousemovement = false;
        } else if (68 in gmst.keysdown && gmst.player.exright() < cvs.width - 300 ) { // right
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

        if (80 in gmst.keysdown) {
            gmst.gamepaused = true;
        }

        // bring world to life
        gmst.removedead();
        gmst.checkcollisions();
        gmst.enemydecisions(modifier);
        gmst.moveobjects(modifier);

        if (gmst.enemieslist.length < 1) {
            gmst.spawnenemies();
        }

        if (gmst.player.hitpoints < 1) {
            gmst.gameover = true;
        }

    };

    return gmst;
}
