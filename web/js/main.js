
var $player = $(".player");
var $track = $(".track");
var $progress = $(".progress");
var playerWidth = $player.width();

var at = 0;
var total = 100;


function draw(ratio) {
    var w = playerWidth * ratio;
    $progress.width(w + "px");
    console.log("hai");
}

function update() {
    if (at === total)
        at = 0;
    else
        at++;
    draw(at/total);
    setTimeout(update, 100);
}

function init() {
    update();
}

init();