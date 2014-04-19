function main()
{
    /* init imgs */
    var spr = new SpritesLoader();
    var gs = new GameState(spr);
    var myRenderer = new Renderer();

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
    
    var gameloop = function () {
        var now = Date.now();
        var delta = now - then;

        gs.update(delta / 1000);
        myRenderer.render(gs.player, gs.enemieslist, gs.playerbullets, gs.enemybullets);

        then = now;
        requestAnimationFrame(function () {
            if (spr.allReady()) {
                gameloop();
            }
        });
    };

    var then = Date.now();
    requestAnimationFrame(gameloop);
    //setInterval(init, 1);

}

