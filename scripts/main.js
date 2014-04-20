function main()
{
    /* init imgs */
    var spr = new SpritesLoader();
    var snd = new SoundsLoader();

    var gs = new GameState(spr, snd);
    gs.reset();

    var myRenderer = new Renderer(spr);

    var gameloop = function () {
        var now = Date.now();
        var delta = now - then;

        gs.update(delta / 1000);
        myRenderer.render(gs);

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

