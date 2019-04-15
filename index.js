const port=process.env.PORT || 3000
var express = require('express');
var socket = require('socket.io');

// App setup
var app = express();
var server = app.listen(port, function(){
    console.log('listening for requests on port 4000,');
});

// Static files
app.use(express.static('public'));

// Socket setup & pass server
var io = socket(server);
io.on('connection', (socket) => {
    console.log('made socket connection', socket.id);

    // Handle play event
    socket.on('play', function(data){
        io.sockets.emit('play', data);
    });

    // Handle pause event
    socket.on('pause', function(data){
        io.sockets.emit('pause', data);
    });

    // Handle videoid event
    socket.on('videoid', function(data){
        io.sockets.emit('videoid', data);
    });

});