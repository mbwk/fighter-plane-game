function main()
{
    /* init imgs */
    preloadsprites();
/*
    while (!spritesloaded()) {
        ctx.font = "18px 'Monospace'";
        ctx.fillStyle = "black";
        ctx.fillText("loading", cvs.width * 0.5, cvs.height * 0.5);
    }
*/
    var bgRdy = false;
    var bgImg = new Image();
    bgImg.onload = function () {
        bgRdy = true;
    };
    bgImg.src = "imgs/background.png";

    var player = new Player();
    var enemies = [];
    enemies.push(new EnemyKMT());
    var enemy = new EnemyKMT();
    var enemy2 = new EnemyKMT();

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

    // reset game
    var reset = function () {
        player.x = cvs.width / 2;
        player.y = cvs.height * 0.8;

        //enemy.x = 32 + (Math.random() * (cvs.width - 128));
        //enemy.y = 32 + (Math.random() * (cvs.width - 128));
        enemy.x = cvs.width * 0.5;
        enemy.y = cvs.height * 0.2;
        console.log("enemy: " + enemy.x + " " + enemy.y);
    };

    var update = function (modifier) {
        if (38 in keysdown && player.upper() > 32 ) { // up
            // hero.y -= (hero.speed * 0.75) * modifier;
            player.move("up", modifier);
        }
        if (40 in keysdown && player.lower() < cvs.height - 32 ) { // down
            // hero.y += (hero.speed * 1.25) * modifier;
            player.move("down", modifier);
        }
        if (37 in keysdown && player.exleft() > 32 ) { // left
            // hero.x -= hero.speed * modifier;
            player.move("left", modifier);
        } else if (39 in keysdown && player.exright() < cvs.width - 32 ) { // right
            // hero.x += hero.speed * modifier;
            player.move("right", modifier);
        } else {
            player.level();
        }

        if (
            player.x <= (enemy.x + 32)
            && enemy.x <= (player.x + 32)
            && player.y <= (enemy.y + 32)
            && enemy.y <= (player.y + 32)
            ) {
                ++enemieskilled;
                reset();
        }
    };
    
    /* draw */
    var render = function () {
        if (bgRdy) {
            ctx.drawImage(bgImg, 0, 0);
        }
        if (player.rdy) {
            //ctx.save();
            //ctx.translate(hero.x, hero.y);
            //ctx.translate(16, 16);
            //ctx.rotate(get_radians_for(hero, MOUSEPOS));
            //ctx.drawImage(player.curimg, player.x, player.y);
            draw_img(player);
            //ctx.restore();
        }
        if (enemy.rdy) {
            console.log("drawing");
            draw_img(enemy);
        }

        // Score
        ctx. fillStyle = "rgb(250, 250, 250)";
        ctx.font = "24px Helvetica";
        ctx.textAlign = "left";
        ctx.textBaseLine = "top";
        ctx.fillText("Monsters caught: " + enemieskilled, 32, 32);
    };

    var init = function () {
        var now = Date.now();
        var delta = now - then;

        update(delta / 1000);
        render();

        then = now;
    };

    reset();
    var then = Date.now();
    setInterval(init, 1);

}

