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
    pbullet.speed = 512;
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

    player.fire = function (spspr) {
        console.log("BANG");
        var bullet = new PlayerBullet(spspr, player.x, player.y, player.strength);
        return bullet;
    };

    player.level = function () {
        player.img = player.sprites.level;
    };

    return player;
}

/* enemy class, inherited from */
function Enemy()
{
    var enemy = new GameEntity();

    enemy.speed = 128;
    enemy.height = 68;
    enemy.width = 87;
    enemy.hitpoints = 2;
    enemy.damage = 1;

    //enemy.img = new Image();
    enemy.rdy = false;
    enemy.img = spritessy.imgs.enemy;
    enemy.rdy = true;

    enemy.move = function (modifier) {
        enemy.y += (enemy.speed) * modifier;
    };

    return enemy;
}

/* kuomintang plane. most common enemy */
function EnemyKMT(newx, newy)
{
    var kmt = new Enemy();

    kmt.x = newx;
    kmt.y = newy;

    //kmt.img = new Image();
    kmt.rdy = false;
    kmt.img = spritessy.imgs.enemykmt;
    kmt.rdy = true;

    kmt.move = function (modifier) {
        kmt.y += (kmt.speed) * modifier;
    };

    /* sprite */
    return kmt;
}

