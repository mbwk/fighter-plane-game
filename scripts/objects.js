function GameEntity()
{
    var ent = {};

    ent.x = 0;
    ent.y = 0;
    ent.speed = 0;
    ent.height = 32;
    ent.width = 32;
    ent.rdy = false;

    /* helper functions */
    ent.upper = function () {
        return ent.y - (ent.height / 2);
    };
    ent.lower = function () {
        return ent.y + (ent.height / 2);
    };
    ent.exleft = function () {
        return ent.x - (ent.width / 2);
    };
    ent.exright = function () {
        return ent.x + (ent.width / 2);
    };
    ent.isrdy = function () {
        return ent.rdy;
    };

    return ent;
}

function PlayerBullet(spr, playerx, playery, playerdmg)
{
    var pbullet = new GameEntity();

    pbullet.x = playerx;
    pbullet.y = playery;
    pbullet.speed = 1024;
    pbullet.height = 32;
    pbullet.width = 16;
    pbullet.damage = playerdmg;

    pbullet.img = spr.imgs.bullet;
    pbullet.rdy = spr.imgs.bullet.rdy;

    pbullet.move = function (modifier) {
        pbullet.y -= (pbullet.speed * modifier);
    };

    return pbullet;
}

function EnemyBullet(spr, enemyx, enemyy, enemydmg)
{
}

function Player(spr, newx, newy)
{
    // var player = {};
    var player = new GameEntity();

    player.x = newx;
    player.y = newy;
    player.speed = 256;
    player.height = 68;
    player.width = 87;
    player.maxhp = 20;
    player.hitpoints = player.maxhp;
    player.damage = 2;

    player.lastfired = 0;
    player.firedelay = 250;

    player.kills = 0;
    player.distance = 0;

    player.sprites = [];
    player.sprites.level = spr.imgs.reisen.level;
    player.sprites.bankr = spr.imgs.reisen.bankr;
    player.sprites.bankl = spr.imgs.reisen.bankl;

    player.img = player.sprites.level;

    player.move = function (direc, modifier) {
        switch (direc) {
            case "up":
                player.y -= (player.speed * 0.7) * modifier;
                break;
            case "down":
                player.y += (player.speed * 1.3) * modifier;
                break;
            case "left":
                player.x -= player.speed * modifier;
                player.img = player.sprites.bankl;
                break;
            case "right":
                player.x += player.speed * modifier;
                player.img = player.sprites.bankr;
                break;
        }
    };

    player.moveto = function (to_x, to_y, modifier) {
        var cvs = document.getElementById("gamecanv");
        var tolerance = 15; // tolerance, prevents "jittering"
        if (player.x < (to_x - tolerance) && player.x < cvs.width - 340 ) {
            player.move("right", modifier);
        }
        if (player.x > (to_x + tolerance) && player.x > 60 ) {
            player.move("left", modifier);
        }
        if (player.y < (to_y - tolerance) && player.y < cvs.height - 60 ) {
            player.move("down", modifier);
        }
        if (player.y > (to_y + tolerance) && player.y > 60 ) {
            player.move("up", modifier);
        }
    };

    player.firesound = new Howl({ urls: ['sounds/shoot.wav']});

    player.fire = function (spspr) {
        player.firesound.play();
        player.lastfired = Date.now();
        var bullet = new PlayerBullet(spspr, player.x, player.y, player.strength);
        return bullet;
    };

    player.offcd = function () {
        var checktime = Date.now();
        if ( (checktime - player.lastfired) > player.firedelay ) {
            return true;
        }
        return false;
    };

    player.level = function () {
        player.img = player.sprites.level;
    };

    return player;
}

/* enemy class, inherited from */
function Enemy(spr)
{
    var enemy = new GameEntity();

    enemy.speed = 128;
    enemy.height = 68;
    enemy.width = 87;
    enemy.hitpoints = 2;
    enemy.damage = 1;

    enemy.img = spr.imgs.enemy;

    enemy.move = function (modifier) {
        enemy.y += (enemy.speed) * modifier;
    };

    return enemy;
}

/* kuomintang plane. most common enemy */
function EnemyKMT(spr, newx, newy)
{
    var kmt = new Enemy(spr);

    kmt.x = newx;
    kmt.y = newy;

    kmt.img = spr.imgs.enemykmt;

    kmt.move = function (modifier) {
        kmt.y += (kmt.speed) * modifier;
    };

    /* sprite */
    return kmt;
}

