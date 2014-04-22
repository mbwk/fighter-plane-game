function Explosion(spr, newx, newy)
{
    var exp = {};
    exp.x = newx;
    exp.y = newy;
    exp.height = 100;
    exp.width = 100;

    var rndsel = Math.floor( Math.random() * spr.imgs.explosions.length );
    exp.img = spr.imgs.explosions[rndsel];

    exp.cycle = 0;

    exp.finished = function () {
        ++exp.cycle;
        if (exp.cycle <= 50) {
            return false;
        }
        return true;
    };

    return exp;
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
    var ebullet = new GameEntity();

    ebullet.x = enemyx;
    ebullet.y = enemyy;
    ebullet.speed = 512;
    ebullet.height = 32;
    ebullet.width = 12;
    ebullet.damage = enemydmg;

    ebullet.img = spr.imgs.bullet;
    ebullet.rdy = spr.imgs.bullet.rdy;

    ebullet.move = function (modifier) {
        ebullet.y += (ebullet.speed * modifier);
    };

    return ebullet;
}

function Player(spr, snd, newx, newy)
{
    // var player = {};
    var player = new GameEntity();

    player.x = newx;
    player.y = newy;
    player.speed = 320;
    player.height = 68;
    player.width = 87;
    player.maxhp = 30;
    player.hitpoints = 30;
    player.damage = 3;

    player.lastfired = 0;
    player.firedelay = 100;

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

    player.heal = function (extra_amount) {
        var healamt = 0;
        healamt = Math.floor( (player.maxhp - player.hitpoints) / 4 );
        healamt += extra_amount;
        player.hitpoints += healamt;
        if (player.hitpoints > player.maxhp) {
            var tmp = player.maxhp;
            ++player.maxhp;
            player.hitpoints = tmp;
        }
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
        if ( enemy.y > 0 && (checktime - enemy.lastfired) > enemy.firedelay ) {
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
        return false;
    };

    enemy.fire = function (spspr) {
        var selection = Math.floor(Math.random() * enemy.shootsounds.length);
        enemy.shootsounds[selection].play();
        enemy.lastfired = Date.now();
        var bullet = new EnemyBullet(spspr, enemy.x, enemy.y, enemy.damage);
        return bullet;
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

    kmt.specialaction = function (gs, modifier) {
        if (kmt.y + 20 > gs.player.y) {
            kmt.speed += 10;
        }
        if (kmt.y + 300 > gs.player.y && kmt.y < gs.player.y ) {
            if (kmt.x + 40 > gs.player.x && kmt.x - 40 < gs.player.x) {
                return kmt.offcd();
            }
        }
        return false;
    };

    return kmt;
}

function EnemyUSN(spr, snd, newx, newy)
{
    var usn = new Enemy(spr, snd);

    usn.x = newx;
    usn.y = newy;
    usn.damage = 4;
    usn.speed -= 50;

    usn.sprites = {};

    usn.sprites.level = spr.imgs.enemyusn.level;
    usn.sprites.bankl = spr.imgs.enemyusn.bankl;
    usn.sprites.bankr = spr.imgs.enemyusn.bankr;

    usn.firedelay -= 300;

    usn.img = usn.sprites.level;

    usn.level = function () {
        usn.img = usn.sprites.level;
    };

    usn.bank = function (direc, modifier) {
        switch (direc) {
            case "left":
                usn.x -= usn.speed * modifier;
                usn.img = usn.sprites.bankl;
                break;
            case "right":
                usn.x += usn.speed * modifier;
                usn.img = usn.sprites.bankr;
                break;
        }
    };

    usn.specialaction = function (gs, modifier) {
        if (usn.y + 50 > gs.player.y) {
            usn.speed += 5;
            usn.bank("right", modifier);
            return false;
        }
        if (usn.y < 0) {     // do nothing if you havent reached the battle
            return false;
        }
        if (!usn.offcd()) {
            if (usn.x + 40 >= gs.player.x && usn.x < gs.player.x && usn.x > 50 ) {
                usn.bank("left", modifier);
            } else if (usn.x - 40 <= gs.player.x && usn.x > gs.player.x && usn.x < 460) {
                usn.bank("right", modifier);
            } else {
                usn.level();
            }
            return false;
        }

        usn.level();
        if (usn.x + 40 > gs.player.x && usn.x - 40 < gs.player.x) {
            return usn.offcd();
        }

        if (usn.x + 30 <= gs.player.x) {
            usn.bank("right", modifier);
        } else if (usn.x - 30 >= gs.player.x) {
            usn.bank("left", modifier);
        } else {
            usn.level();
        }
        return false;
    };

    return usn;
}

function EnemyP38(spr, snd, newx, newy) {
    var p38 = new Enemy(spr, snd);

    p38.x = newx;
    p38.y = newy;
    p38.height = 120;
    p38.width = 170;
    p38.speed = 128;
    p38.img = spr.imgs.enemyp38;
    p38.hitpoints = 30;
    p38.damage = 15;

    return p38;
}

function HealthPickup(spr, newx, newy) {
    var hpu = new GameEntity();

    hpu.x = newx;
    hpu.y = newy;
    hpu.speed = 512;
    hpu.height = 50;
    hpu.width = hpu.height;
    hpu.amount = Math.floor( Math.random() * 5 );

    hpu.img = spr.imgs.healthpickup;

    hpu.move = function (modifier) {
        hpu.y += (hpu.speed) * modifier;
    }

    return hpu;
}

