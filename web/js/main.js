/*
    Misc
 */
(function($) {

    window.onload = function() {

        var $img = $(".jenna img")

        ratio = 0.916496945


        function resize() {
            console.log(ratio + " r " + ratio)

            var wh = $(window).height()
            var ww = $(window).width()
            
            if (wh > ww) { // portrait
                $img.css({
                    height: ww + "px",
                    width: (ww*ratio) + "px",
                    top: (wh - ww) + "px"
                })
            }
            else { // landscape or square
                $img.css({
                    height: wh + "px",
                    width: wh * ratio + "px",
                    top: "0"
                })
            }

            console.log( wh + " " + ww + " -> " + $img.height() + " " + $img.width())
        }

        resize()
        $(window).resize(resize)

    }

}(jQuery));
/*
    Audio player
 */
(function($) {

    var playlist, playlistPos // songs, acquired from DOM
    var $audio, audio // audio player
    var player, at, total, updateTrack // audio player + progress
    var $progress, playerWidth, $control, $ribbon // UI stuff

    function draw(ratio) {
        var w = playerWidth * ratio
        $progress.width(w + "px")
    }

    function update() {
        total = player.duration
        if (at === total) {
            at = 0
            clearInterval()
            nextSong()
        }
        else
            at = player.currentTime
        draw(at/total)
    }

    function play() {
        $ribbon.animate({
            left: 0 + "px"
        }, 800)
        $control.children().removeClass("play").addClass("pause");
        player.play()
    }

    function pause() {
        var callback = arguments[0]

        $ribbon.animate({
            left: (-1 * $ribbon.width()) + "px"
        }, 800, function() {
            callback()
        })
        $control.children().removeClass("pause").addClass("play");
        player.pause()
    }

    function togglePause() {
        if (player.paused)
            play()
        else
            pause()
    }

    function playSong(url) {

        $audio = $("<audio id='mediaelement' autoplay='false' src='" + url + "' type='audio/mp3'></audio>")
        audio = $audio[0]

        var el = new MediaElement(audio, {
            startVolume: 1,
            timerRate: 250,
            plugins: ['flash','silverlight'],
            success: function(mediaelement) {
                player = mediaelement
                at = 0
                total = player.duration
                play()
                updateTrack = setInterval(update, 250)
            }
        })

    }

    function nextSong() {

        if (playlistPos >= playlist.length)
            playlistPos = 0
        else
            playlistPos++

        var song = playlist[playlistPos]

        // stop the playing song if we have started one
        if (typeof $audio !== "undefined") {
            pause(function() {
                $(".title-text").text(song.title)
                $(".song").text(song.title)
            })
            $audio.remove()
            playlistPos++
        }
        else {
            $(".title-text").text(song.title)
            $(".song").text(song.title)
        }

        console.log(song)

        playSong(song.url)
    }

    function init() {
        console.log("Did init")
        $progress = $(".progress")
        $control = $(".control")
        $ribbon = $(".ribbon")
        playerWidth = $(".player").width()
        playlistPos = -1
        playlist = []

        $control.on("click", togglePause)

        $(".playlist li").each(function() {
            playlist.push({
                url: $(this).data("url"),
                title: $(this).data("title")
            })
        })
        nextSong()
    }

    init()

}(jQuery));
