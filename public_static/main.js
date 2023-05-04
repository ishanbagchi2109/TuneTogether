// Cloud Major Project - Syncing with socket
var roomname = prompt("Enter Room Name ");
document.getElementById("roomName").textContent = roomname;

$(function () {

    var socket = io();
    socket.emit('subscribe',roomname);
    var audio = document.getElementById('myaudio');
    $('#load').click(function () {
       audio.load();
       $('#load').html('Loading...');
    });
    function loaded() {
        $('#load').html('Loaded.');
    }
    audio.addEventListener('canplay',loaded,false);

    $.getJSON("songs.json", function(data) {
        var songs = data.songs;
        
        var $songList = $('#songList');
        $.each(songs, function(index, song) {
          $songList.append('<li id="song' + index + '">' + song.name + '</li>');
        });
        
        $.each(songs, function(index, song) {
          $('#song' + index).click(function() {
            $('#myaudio').html('<source src="' + song.src + '" class="audio-source">');
            $('#load').click();
            $('#pause').click();
            socket.emit('song' + index, roomname);
          });
        });
      });
  

    $('#play').click(function () {
        console.log("play");
        $('#play').removeClass('show');
        $('#play').addClass('hide');
        $('#pause').removeClass('hide');
        $('#pause').addClass('show');
        socket.emit("play", {times: audio.currentTime, room : roomname});
    });
    $('#pause').click(function () {
        console.log("pause");
        $('#pause').removeClass('show');
        $('#pause').addClass('hide');
        $('#play').removeClass('hide');
        $('#play').addClass('show');
        socket.emit("pause", {times: audio.currentTime, room : roomname});
    });
    socket.on("first", function (data) {
        audio.ontimeupdate = function () {
            socket.emit("where", {times: audio.currentTime, room : roomname});
        };
    });

    socket.on("current", function (data) {
        var diff = audio.currentTime - data;
        if (diff < 0 || diff > 2) {
            audio.currentTime = data;
        }
    });
    socket.on("playsong", function (data) {
        audio.currentTime = data;
        audio.play();
        $('#play').removeClass('show');
        $('#play').addClass('hide');
        $('#pause').removeClass('hide');
        $('#pause').addClass('show');
    });
    socket.on("pausesong", function (data) {
        audio.currentTime = data;
        audio.pause();
        $('#pause').removeClass('show');
        $('#pause').addClass('hide');
        $('#play').removeClass('hide');
        $('#play').addClass('show');
    });
});