/* game states */
var gameover = false;
var menustate = false;


function get_mouse_xy(evt)
{
    var rect = document.getElementById("gamecanv").getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function get_radians(selfx, selfy, otherx, othery)
{
    var diffx = otherx - selfx;
    var diffy = othery - selfy;
    return Math.atan2(diffy, diffx);
}

function get_radians_for(obja, objb)
{
    return get_radians(obja.x + 16, obja.y + 16, objb.x, objb.y);
}
