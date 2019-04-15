// Make connection
// var socket = io.connect('http://localhost:4000');
var socket = io.connect('https://syncvideoplayer.herokuapp.com/');


var play = document.getElementById('play'),
pause = document.getElementById('pause'),
searchbar = document.getElementById('searchbar'),
resultarea = document.getElementById('resultarea');
$('#pause').hide();
$('#play').hide();

//play video
var player,
    time_update_interval = 0;
function initialize(){
    clearInterval(time_update_interval);
    
}

//search video
searchbtn.addEventListener('click',function(){
//   console.log(searchbar.value); 
  
  var urlString = "https://www.googleapis.com/youtube/v3/search?part=snippet&q="+searchbar.value+"&type=video&key=AIzaSyBHO2dkGc8FEjKb7QRadas5xhF3AHnYX8A";
  
  $.ajax({
    url: urlString,
    success: (result, status, xhr) => {
      
      results = result.items;
      resultarea.innerHTML = "";

      results.forEach((video) => {
//         console.log(video.snippet.title);
        resultarea.innerHTML += '<div id='+video.id.videoId+'><img src=\"'+video.snippet.thumbnails.default.url+'\" id='+video.id.videoId+'><span>'+
        video.snippet.title+'</span></div>'
        
      });      
      
    },
    error: (xhr, status, err) => {
      console.log("Failed to fetch data");
    }
  });

});

//select video
var vid_id ='';
resultarea.addEventListener('click',function(event){
//   console.log(event.target.id)
  socket.emit('videoid',event.target.id);
  resultarea.innerHTML = "";

});

//listen on selected video
socket.on('videoid', function(data){

  //load youtube iframe
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  resultarea.innerHTML = "";

  // console.log("selected video "+data);
  vid_id = data;  
  if(player){
    player.destroy();
    player = new YT.Player('video-placeholder', {
      width: 600,
      height: 400,
      videoId: vid_id,  
      // playerVars: {
      //   color: 'white',
      //   playlist: 'taJ60kskkns,FG0fTKAqZ5g,dTp72sci8CA'
      // },    
      events: {
          onReady: initialize,
          onStateChange: statechange
      }
    });
  } 
    
  $('#pause').show();
  $('#play').show(); 
  
});


function onYouTubeIframeAPIReady() {
    player = new YT.Player('video-placeholder', {
        width: 600,
        height: 400,
        videoId: vid_id,
        // playerVars: {
        //     color: 'white',
        //     playlist: 'taJ60kskkns,FG0fTKAqZ5g,dTp72sci8CA'
        // },
        events: {
            onReady: initialize,
            onStateChange: statechange
        }
    });
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
//   console.log(event.data)
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
//   console.log("play video");
  player.playVideo();
  player.seekTo(data);
});

socket.on('pause', function(data){
//   console.log("pause video");
  player.pauseVideo();
});





