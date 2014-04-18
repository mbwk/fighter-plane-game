// these sprites are used by several objects on the screen at once
var spritessy = {};
spritessy.imgs = [];

// bullet is shared between player* and enemy* bullet

function preloadsprites()
{
    spritessy.imgs["bullet"] = new Image();
    spritessy.imgs["enemy"] = new Image();
    spritessy.imgs["enemykmt"] = new Image();

    spritessy.imgs["bullet"].rdy = false;
    spritessy.imgs["enemy"].rdy = false;
    spritessy.imgs["enemykmt"].rdy = false;

    spritessy.imgs["bullet"].src = "imgs/bullet.png";
    spritessy.imgs["enemy"].src = "imgs/enemydefault.png";
    spritessy.imgs["enemykmt"].src = "imgs/enemykmt.png";

    for (var i in spritessy.imgs) {
        spritessy.imgs[i].onload = function () {
            spritessy.imgs[i].rdy = true;
        }
    }
}

function spritesloaded()
{
    for (var i in spritessy.imgs) {
        if (spritessy.imgs[i].rdy === false) {
            return false;
        }
    }
    return true;
}

function allspritesready(sprites)
{
    for (var i in sprites) {
        if (sprites[i].reader = false) {
            return false;
        }
    }
    return true;
}

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
    }
    ent.lower = function () {
        return ent.y + (ent.height / 2);
    }
    ent.exleft = function () {
        return ent.x - (ent.width / 2);
    }
    ent.exright = function () {
        return ent.x + (ent.width / 2);
    }
    ent.isrdy = function () {
        return ent.rdy;
    }

    return ent;
}

function PlayerBullet(playerx, playery)
{
    var pbullet = new GameEntity();

    /* member variables */
    pbullet.x = playerx;
    pbullet.y = playery;
    pbullet.speed = 512;
    pbullet.height = 32;
    pbullet.width = 16;
    pbullet.damage = 2;

    pbullet.rdy = spritessy.bullet.rdy;

    pbullet.move = function (modifier) {
        pbullet.y -= (pbullet.speed * modifier);
    }

    return pbullet;
}

function EnemyBullet(enemyx, enemyy, damage)
{
}

function Player()
{
    // var player = {};
    var player = new GameEntity();

    /* member variables */
    player.speed = 256;
    player.height = 64;
    player.width = 86;
    player.hitpoints = 20;

    player.sprites = [];
    player.sprites["level"] = new Image();
    player.sprites["bankr"] = new Image();
    player.sprites["bankl"] = new Image();
    player.sprites["level"].src = "imgs/reisenlevel.png";
    player.sprites["bankr"].src = "imgs/reisenbankr.png";
    player.sprites["bankl"].src = "imgs/reisenbankl.png";
    player.img = player.sprites["level"];
    for (var i in player.sprites) {
        player.sprites[i].onload = function() {
            player.sprites[i].ready = true;
            player.rdy = allspritesready(player.sprites);
        }
    }

    /* member functions */
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
                player.img = player.sprites["bankl"];
                break;
            case "right":
                player.x += player.speed * modifier;
                player.img = player.sprites["bankr"];
                break;
        }
    }

    player.level = function () {
        player.img = player.sprites["level"];
    }
    player.getheight = function () {
        return player.img.height;
    }
    player.getwidth = function () {
        return player.img.width;
    }

    console.log("reisen height: " + player.getheight() + " | width: " + player.getwidth());

    return player;
}

/* enemy class, inherited from */
function Enemy()
{
    var enemy = new GameEntity();

    /* member variables */
    enemy.speed = 128;
    enemy.height = 64;
    enemy.width = 86;
    enemy.hitpoints = 2;

    enemy.img = new Image();
    enemy.rdy = false;
    enemy.img = spritessy.imgs["enemy"];
    console.log(enemy.img.src + " is LOADED.");
    enemy.rdy = true;

    enemy.move = function (modifier) {
        enemy.y += (enemy.speed) * modifier;
    }

    return enemy;
}

/* kuomintang plane. most common enemy */
function EnemyKMT()
{
    var kmt = new Enemy();

    kmt.img = new Image();
    kmt.rdy = false;
    kmt.img = spritessy.imgs["enemykmt"];
    console.log(kmt.img.src + " is LOADED.");
    kmt.rdy = true;


    /* sprite */
    return kmt;
}

