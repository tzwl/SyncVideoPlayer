// Make connection
var socket = io.connect('http://localhost:4000');

var play = document.getElementById('play'),
pause = document.getElementById('pause');

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

//play video
var player,
    time_update_interval = 0;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('video-placeholder', {
        width: 600,
        height: 400,
        videoId: 'Xa0Q0J5tOP0',
        playerVars: {
            color: 'white',
            playlist: 'taJ60kskkns,FG0fTKAqZ5g'
        },
        events: {
            onReady: initialize,
            onStateChange: statechange
        }
    });
}

function initialize(){

    clearInterval(time_update_interval);

}


// Playback
var flag = false;
play.addEventListener('click',function(){
  socket.emit('play',player.getCurrentTime());

});

pause.addEventListener('click',function(){
  socket.emit('pause');
  flag = false;

});

function statechange(event){
  console.log(event.data)
  if(event.data == 1 && !flag){
    socket.emit('play',player.getCurrentTime());
    flag = true;
  } 
  else if(event.data==2){
    socket.emit('pause');
    flag = false;
  }  

}

// Listen for events
socket.on('play', function(data){
  console.log("play video");
  player.playVideo();
  player.seekTo(data);
});

socket.on('pause', function(data){
  console.log("pause video");
  player.pauseVideo();
});





