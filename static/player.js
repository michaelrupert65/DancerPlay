$(document).ready(function(){
    var players = {};
    var currentPlayerId = -1;
    var currentPlayerState = false;
    var totalCount = playlist.length;
    console.log(`totalCount ${totalCount}`);

    const $typeselect = $('#type-select');

    // The <iframe> (and video player) will replace this <div> tag.
    createHTMLVideoPlayers();

    function createHTMLVideoPlayers(){
        $('.container-sm').empty();
        playlist.forEach(function(id, index){
            $('.container-sm').append(`
                <body>
                    <div class="youTube" id="player${index}">
                    </div>
                </body>
            `);
        })

        // create the YouTube video iframes
        window.YT.ready(onYouTubeIframeAPIReady);
    }

    // This function creates an <iframe> (and YouTube player)
    function onYouTubeIframeAPIReady() {
        playlist.forEach(function(id, index){
            players[`player${index}`] = new YT.Player(`player${index}`, {
                height: '300',
                width: '500',
                videoId: id,
                playerVars: {
                    'autoplay': 0
                },
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        });
    }

    // The API will call this function when the video player is ready.
    function onPlayerReady(event) {
        // Let the first player start to play the video when player is ready.
        if(event.target.h.id == 'player0') {
            console.log(event.target)
            event.target.playVideo();
            currentPlayerId = 0;
            currentPlayerState = true;
            updatePlayBtn(true);
        }
    }
        

    // The API calls this function when the player's state changes.
    // Three states are handled in the function.
    // This function prevent multiple players play at the same time.
    // It also update the play/pause button icons and player state.
    function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.ENDED) {
            currentPlayerId++;
            players[`player${currentPlayerId}`].playVideo();
            updatePlayBtn(true);
        }

        if(event.data == YT.PlayerState.PAUSED) {
            if(event.target.h.id === `player${currentPlayerId}`) {
                currentPlayerState = false;
                updatePlayBtn(false);
            }
        }

        if(event.data == YT.PlayerState.PLAYING) {
            if(event.target.h.id != `player${currentPlayerId}`) {
                players[`player${currentPlayerId}`].pauseVideo();
            }
            currentPlayerId = event.target.h.id.replace(/^\D+/g, '');
            currentPlayerState = true;
            updatePlayBtn(true);
        }
    }

    /************ PLAYLIST CONTROL EVENTS ************/
    /*Toggle between playing and pausing video*/
    $('#play-pause').on('click', function(e){
        e.preventDefault();
        console.log(currentPlayerState);
        if (currentPlayerState){ //if playing, pause video
            pauseVideo();
            updatePlayBtn(false);
        }
        else {//if paused, play video
            playVideo();
            updatePlayBtn(true);
        }
    })

    $('#play-pre').on('click', function(e){
        e.preventDefault();
        pauseVideo();
        playPrevVideo();
    });

    $('#play-next').on('click', function(e){
        e.preventDefault();
        pauseVideo();
        playNextVideo();
    });

    /*Plays video*/
    function playVideo(){
        var key = `player${currentPlayerId}`;
        console.log(`play ${key}`);
        players[key].playVideo();
    }

    /*Pauses video*/
    function pauseVideo(){
        var key = `player${currentPlayerId}`;
        console.log(`pause ${key}`);
        players[key].pauseVideo();
    }

    /*Play the previous video, unless it's the first, 
    then play the last video*/
    function playPrevVideo(){
        if (currentPlayerId == 0){
            currentPlayerId = totalCount-1;
        } else {
            currentPlayerId--;
        }
        playVideo();
    }

    /*Play the next video, unless it's the last, 
    then play the 1st video*/
    function playNextVideo(){
        console.log(currentPlayerId);
        if (currentPlayerId == (totalCount-1)){
            currentPlayerId = 0;
        } else {
            currentPlayerId++;
        }
        playVideo();
    }

    /*Updates glyphicon displayed in the playlistControls
    depending on if the video is playing or paused */
    function updatePlayBtn(playing){
        if (playing){ //change to playing state
            //show the play glyphicon in the playlistControls
            $('#play-pause span')
                .removeClass('glyphicon-play')
                .addClass('glyphicon-pause');
        }
        else { //change to pause state
            //show the pause glyphicon in the playlistControls 
            $('#play-pause span')
                .removeClass('glyphicon-pause')
                .addClass('glyphicon-play');
        }
    }



    /*******************Set style and type options *************/
    $('#style-select').change(function(){
        // 0: Ballet  1: Latin  2: Ballroom  3:Hip Hop

        var option = this.selectedIndex;
        var types;
        if(option === 0) {
            types = ["Barre", "Centre"];
        }
        else if(option === 1) {
            types = ["Rumba", "Cha Cha Cha", "Samba", "Paso Doble", "Jive"];
        }
        else if(option === 2) {
            types = ["Waltz", "Foxtrot", "Viennese Waltz", "Quickstep", "Tango"];
        }
        else if(option === 3) {
            types = ["Locking", "Hip-hop", "Popping", "House", "Breaking"];
        }

        $typeselect.html("");
        types.forEach(function(item) {
            $typeselect.append("<option>" + item + "</option>");
        });
    });

    function setTypeOptions(style){
        console.log(style);

       var types;
       if(style === 'Ballet') {
            types = ["Barre", "Centre"];
       }
       else if(style === 'Latin') {
            types = ["Rumba", "Cha Cha Cha", "Samba", "Paso Doble", "Jive"];
       }
       else if(style === 'Ballroom') {
            types = ["Waltz", "Foxtrot", "Viennese Waltz", "Quickstep", "Tango"];
       }
       else if(style === 'Hip Hop') {
            types = ["Locking", "Hip-hop", "Popping", "House", "Breaking"];
       }
       $typeselect.html("");
       types.forEach(function(item) {
           $typeselect.append("<option>" + item + "</option>");
       });
    }

    setTypeOptions(style);
});