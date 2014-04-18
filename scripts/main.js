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

    /* game objects */
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

    var newstage = function () {
        ++stage;
        for (var i = 0; i < (stage + 10) && i < 20; ++i) {
            var x = Math.floor( Math.random() * ( 512 - 0 + 1 ));
            var y = Math.floor( Math.random() * ( 0 - 1200 + 1 ) - 1200 );
            enemies.push(new EnemyKMT());
        }
    }

    // reset game
    var reset = function () {
        player.x = cvs.width / 2;
        player.y = cvs.height * 0.8;

        //enemy.x = 32 + (Math.random() * (cvs.width - 128));
        //enemy.y = 32 + (Math.random() * (cvs.width - 128));
    };

    var checkbounds = function (killer, victim) {
        var inleftbound = false, inrightbound = false,
            inbotbound = false, intopbound = false;
        inleftbound = killer.exright() > victim.exleft();
        inrightbound = killer.exleft() < victim.exright();
        intopbound = killer.upper() > victim.lower();
        inbotbound = killer.lower() < victim.upper();

        if ( (inbotbound && (inleftbound || inrightbound))
                || (intopbound (inleftbound || inrightbound)) ) {
                    return true;
        }
        return false;
    }

    var checkcollisions = function () {
        // has a bullet gone out of bounds?
        
        for (var bullet in playerbullets) {
            if (bullet.lower() < 0) {
                var index = playerbullets.indexOf(bullet);
                playerbullets.splice(bullet, 1);
            }
        }
        
        for (var bullet in enemybullets) {
            if (bullet.upper() > cvs.height) {
                var index = enemybullets.indexOf(bullet);
                enemybullets.splice(index, 1);
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

        
    }

    var moveobjects = function () {
        for (var enemy in enemies) {
            enemy.move();
        }
        for (var bullet in playerbullets) {
            bullet.move();
        }
        for (var bullet in enemybullets) {
            bullet.move();
        }
    }

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
        } else if (39 in keysdown && player.exright() < cvs.width - 16 ) { // right
            // hero.x += hero.speed * modifier;
            player.move("right", modifier);
        } else {
            player.level();
        }

        // bring world to life
        checkcollisions();
        moveobjects();
        
    };

    var scroller = -550;
    var delay = 0;
    /* draw */
    var render = function () {
        ctx.drawImage(bgImg, 0, scroller);
        scroller += 2;
        if (scroller > 0) {
            scroller = -550;
        }

        // later, check if player is alive first
        draw_img(player);

        for (var enemy in enemies) {
            draw_img(enemy);
        }
        for (var bullet in playerbullets) {
            draw_img(bullet);
        }
        for (var bullet in enemybullets) {
            draw_img(bullet);
        }

        writestats(player);

        ++delay;

        if (delay > 25) {
            ++player.distance;
            delay = 0;
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

