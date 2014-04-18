function main()
{
    /* init imgs */
    preloadsprites();

    var bgRdy = false;
    var bgImg = new Image();
    bgImg.onload = function () {
        bgRdy = true;
    };
    bgImg.src = "imgs/testbg.png";

    var player = new Player();
    var enemies = [];
    var playerbullets = [];
    var enemybullets = [];

    // test enemy
    var testenemy = new EnemyKMT(300, 100);

    //game objects
    var enemieskilled = 0;

    // handle keyboard controls
    var keysdown = {};
    addEventListener("keydown", function (e) {
        keysdown[e.keyCode] = true;
    }, false);
    addEventListener("keyup", function (e) {
        delete keysdown[e.keyCode];
    }, false);
    addEventListener("mousemove", function (evt) {
        // update globally stored mouse position
        MOUSEPOS = get_mouse_xy(evt);
    }, false);

    var stage = 0;
    /*
    var newstage = function () {
        ++stage;
        for (var i = 0; i < (stage + 10) && i < 20; ++i) {
            var x = Math.floor( Math.random() * ( 512 - 0 + 1 ));
            var y = Math.floor( Math.random() * ( 0 - 1200 + 1 ) - 1200 );
            enemies.push(new EnemyKMT(x, y));
        }
        enemies.push(new EnemyKMT(300, 100));
    };
    */

    // reset game
    var reset = function () {
        player.x = cvs.width / 2;
        player.y = cvs.height * 0.8;
        //newstage();
    };

    var checkbounds = function (killer, victim) {
        var inleftbound = false, inrightbound = false,
            inbotbound = false, intopbound = false;

        inleftbound = killer.exright > victim.exleft;
        inrightbound = killer.exleft < victim.exright;
        intopbound = killer.upper > victim.lower;
        inbotbound = killer.lower < victim.upper;

        if ( (inbotbound && (inleftbound || inrightbound)) || (intopbound && (inleftbound || inrightbound)) ) {
                    return true;
        }
        return false;
    };

    var checkcollisions = function () {
        // has a bullet gone out of bounds?
        
        for (var pbullet in playerbullets) {
            if (pbullet.lower() < 0) {
                var pindex = playerbullets.indexOf(pbullet);
                playerbullets.splice(pindex, 1);
            }
        }
        
        for (var ebullet in enemybullets) {
            if (ebullet.upper() > cvs.height) {
                var eindex = enemybullets.indexOf(ebullet);
                enemybullets.splice(eindex, 1);
            }
        }

        // has the player had a mid air collision?
        for (var enemy in enemies) {
            if ( checkbounds(enemy, player) ) {
                player.hitby(enemy);
            }
        }

        // has an enemy bullet hit our player?
        for (var bullet in enemybullets) {
            if ( checkbounds(bullet, player) ) {
                player.hitby(bullet);
            }
        }

        
    };

    var moveobjects = function (modifier) {
        for (var enemy in enemies) {
            //enemy.move(modifier);
            enemy.y += enemy.speed * modifier;
        }
        for (var pbullet in playerbullets) {
            pbullet.move(modifier);
        }
        for (var ebullet in enemybullets) {
            ebullet.move(modifier);
        }
    };

    var update = function (modifier) {
        if (38 in keysdown && player.upper() > 36 ) { // up
            // hero.y -= (hero.speed * 0.75) * modifier;
            player.move("up", modifier);
        }
        if (40 in keysdown && player.lower() < cvs.height - 16 ) { // down
            // hero.y += (hero.speed * 1.25) * modifier;
            player.move("down", modifier);
        }
        if (37 in keysdown && player.exleft() > 16 ) { // left
            // hero.x -= hero.speed * modifier;
            player.move("left", modifier);
        } else if (39 in keysdown && player.exright() < gamewidth - 16 ) { // right
            // hero.x += hero.speed * modifier;
            player.move("right", modifier);
        } else {
            player.level();
        }

        // bring world to life
        checkcollisions();
        moveobjects(modifier);
        
    };

    var bglength = 1033;
    var origin = (-1 * bglength) + cvs.height;
    var scroller = origin;
    var delay = 0;
    /* draw */
    var render = function () {
        if (gameover) {
            drawgameover();
        } else if (gamestate) {

            ctx.drawImage(bgImg, 0, scroller);
            scroller += 2;

            if (scroller > 0) {
                scroller = origin;
            }

            // later, check if player is alive first
            draw_img(player);

            for (var enemy in enemies) {
                draw_img(enemy);
                console.log("drawing");
            }
            for (var pbullet in playerbullets) {
                draw_img(pbullet);
            }
            for (var ebullet in enemybullets) {
                draw_img(ebullet);
            }

            writestats(player);

            ++delay;

            if (delay > 25) {
                ++player.distance;
                delay = 0;
            }
        } else if (menustate) {
            drawmenu();
        }
    };

    var gameloop = function () {
        var now = Date.now();
        var delta = now - then;

        update(delta / 1000);
        render();

        then = now;
        requestAnimationFrame(function () {
            gameloop();
        });
    };

    reset();
    var then = Date.now();
    requestAnimationFrame(gameloop);
    //setInterval(init, 1);

}

