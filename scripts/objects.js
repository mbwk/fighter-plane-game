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

function Player(spr, snd, newx, newy)
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
    player.damage = 3;

    player.lastfired = 0;
    player.firedelay = 200;

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

    player.shootsounds = snd.shoot;

    player.fire = function (spspr) {
        var selection = Math.floor(Math.random() * player.shootsounds.length);
        player.shootsounds[selection].play();
        player.lastfired = Date.now();
        var bullet = new PlayerBullet(spspr, player.x, player.y, player.damage);
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

    player.hitsounds = snd.hit;

    player.hitby = function (attacker) {
        var selection = Math.floor(Math.random() * player.hitsounds.length);
        player.hitsounds[selection].play();
        player.hitpoints -= attacker.damage;
    };

    return player;
}

/* enemy class, inherited from */
function Enemy(spr, snd)
{
    var enemy = new GameEntity();

    enemy.speed = 128;
    enemy.speed = Math.floor( Math.random() * ( 256 - 168 ) + 168 );
    enemy.height = 68;
    enemy.width = 87;
    enemy.hitpoints = 8;
    enemy.damage = 1;

    enemy.img = spr.imgs.enemy;

    enemy.move = function (modifier) {
        enemy.y += (enemy.speed) * modifier;
    };

    enemy.shootsounds = snd.shoot;
    enemy.hitsounds = snd.hit;
    enemy.explodesounds = snd.explode;
    enemy.lastfired = 0;
    enemy.firedelay = 2000;

    enemy.offcd = function () {
        var checktime = Date.now();
        if ( (checktime - player.lastfired) > player.firedelay ) {
            return true;
        }
        return false;
    };

    enemy.specialaction = function (gs, modifier) {
        // this member function is meant to be overridden by subclasses of enemies
        // to provide variation in enemy behaviour
        


        // the return value of this function must be a bool
        // it is used to decided whether to call the fire function
        // return false to never fire, else plug in the offcd() function
        return enemy.offcd();
    };

    enemy.fire = function (spspr) {
        var selection = Math.floor(Math.random() * player.shootsounds.length);
        enemy.shootsounds[selection].play();
        enemy.lastfired = Date.now();
        var bullet = new EnemyBullet(spspr, enemy.x, enemy.y, enemy.damage);
    };

    enemy.explode = function () {
        var selection = Math.floor(Math.random() * enemy.explodesounds.length);
        enemy.explodesounds[selection].play();
    };

    enemy.hitby = function (attacker) {
        var selection = Math.floor(Math.random() * enemy.hitsounds.length);
        enemy.hitsounds[selection].play();
        enemy.hitpoints -= attacker.damage;
        if (enemy.hitpoints < 1) {
            enemy.explode();
        }
    };



    return enemy;
}

/* kuomintang plane. most common enemy */
function EnemyKMT(spr, snd, newx, newy)
{
    var kmt = new Enemy(spr, snd);

    kmt.x = newx;
    kmt.y = newy;
    kmt.damage = 2;

    kmt.img = spr.imgs.enemykmt;
/*
    kmt.specialaction = function (gs, modifier) {
    };
*/
    return kmt;
}

function EnemyUSN(spr, snd, newx, newy)
{
    var usn = new Enemy(spr, snd);

    usn.x = newx;
    usn.y = newy;

    usn.sprites = {};

    usn.sprites.level = spr.imgs.enemyusn.level;
    usn.sprites.bankl = spr.imgs.enemyusn.bankl;
    usn.sprites.bankr = spr.imgs.enemyusn.bankr;

    usn.img = usn.sprites.level;

    usn.specialaction = function (gs, modifier) {
    };

    return usn;
}

