/*
    Misc
 */
;(function($) {

    $(window).load(function() {

        var $img = $(".jenna img")
        var $note = $(".note")
        var $ribbon = $(".ribbon")
        var $logo = $(".logo")
        var ratio = 0.916496945
        var imgw = 0

        function resize() {

            var wh = $(window).height()
            var ww = $(window).width()
            var wr = wh / ww
            var t = 0

            console.log(ratio + " r " + wr)


            if (wr > 1) { // higher height
                var top = wh - ww
                imgw = ww * ratio
                $img.css({
                    height: ww + "px",
                    width: imgw + "px",
                    top: top + "px"
                })
                $note.css({
                    width: (wh / 3) + "px",
                    background: "red",
                    bottom: (wh / 3.75) + "px"
                })
                t = 1 / wr
                $ribbon.css({
                    bottom: (wh / 1.8) + "px",
                    left: (-64 * wr) + "px",
                    transform: "scale(" + t + "," + t + ")"
                })
                $logo.css({
                    width: "70%",
                    left: "10%",
                    top: "7%"
                })
            }
            else { // higher width
                imgw = wh * ratio
                $img.css({
                    height: wh + "px",
                    width: imgw + "px",
                    top: "0"
                })
                $note.css({
                    bottom: 0,
                    width: (ww * 0.4) + "px",
                    background: "blue"
                })
                t = 1.5 * wr
                $ribbon.css({
                    bottom: ((ww * 0.18) + 100) + "px",
                    left: - t * 100 + "px",
                    transform: "scale(" + t + "," + t + ")"
                })
                $logo.css({
                    "max-width": "40%",
                    top: "10%",
                    left: (9/wr) + "%"
                })
                // if (wh < 500) {
                //     $note.css({
                //         width: (wh / 2) + "px",
                //         background: "blue"
                //     })
                // }
                // else {

                // }

            }

            $(".rtop, .ltop").css({
                width: ww - 100 + "px"
            })
            $(".rline, .lline").css({
                height: wh + "px"
            })

            console.log( wh + " " + ww + " -> " + $img.height() + " " + $img.width())
        }

        resize()
        $(window).resize(resize)

        // all this to avoid the pyramid of callbacks
        function step(list, func, timeBetween) {
            function recur(i) {
                if (i == list.length)
                    return;
                else {
                    setTimeout(function() {
                        func.apply(list[i])
                        recur(i+1)
                    }, i*timeBetween)
                }
            }
            recur(0)
        }
        step([$logo, $ribbon, $note, ], function() {
            this.fadeIn(500)
        }, 500)

        // $logo.fadeIn()
        // $note.fadeIn()
        // $ribbon.fadeIn()


    })

}(jQuery));
/*
    Audio player
 */
(function($) {

    $(window).load(function() {

        var playlist, playlistPos // songs, acquired from DOM
        var $audio, audio // audio player
        var player, at, total, updateTrack // audio player + progress
        var $progress, playerWidth, $control, $ribbon, $song // UI stuff

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
            $control.children().removeClass("play").addClass("pause")
            player.play()
        }

        function pause() {
            $song.children().removeClass("pause").addClass("play")
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

            if (playlistPos >= playlist.length - 1)
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
                $song.fadeOut(800, function() {
                    $song.text(song.title)
                    $song.fadeIn(800)
                })
            }

            playSong(song.url)
        }

        function init() {
            console.log("Did init")
            $progress = $(".progress")
            $control = $(".control")
            $ribbon = $(".ribbon")
            $song = $ribbon.find(".song span")
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

    })

}(jQuery));
