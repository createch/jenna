/*
    Misc
 */
(function($) {

    resize() {
        // firefox fix
        $(".jenna").height($(window).height() + "px")
    }

    resize()
    $(window).resize(resize())

}(jQuery));
/*
    Audio player
 */
(function($) {

    var playlist, playlistPos // songs, acquired from DOM
    var $audio, audio // audio player
    var player, at, total, updateTrack // audio player + progress
    var $progress, playerWidth, $control // UI stuff

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
        $control.children().removeClass("play").addClass("pause");
        player.play()
    }

    function pause() {
        $control.children().removeClass("pause").addClass("play");
        player.pause()
    }

    function togglePause() {
        console.log("toggle")
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
        // stop the playing song if we have started one
        if (typeof $audio !== "undefined") {
            player.pause()
            $audio.remove()
            playlistPos++
        }

        if (playlistPos == playlist.length)
            playlistPos++

        var song = playlist[playlistPos]

        $(".title-text").text(song.title)
        $(".song").text(song.title)

        console.log(song)

        playSong(song.url)
    }

    function init() {
        console.log("Did init")
        $progress = $(".progress")
        $control = $(".control")
        playerWidth = $(".player").width()
        playlistPos = 0 
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
