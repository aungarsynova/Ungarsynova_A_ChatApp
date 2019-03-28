//initialize an express app and set it up
const express = require('express');
const app = express();
const io = require('socket.io')();

//some config stuff
const port = process.env.PORT || 3000;

//tell our app to use the public folder for static files
app.use(express.static('public'));

//instansiate the only route we need
app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/views/index.html');
});

//create server variable for socket io
const server = app.listen(port, () => {
    console.log(`app is running in the port ${port}`)
});

//plug in the chat app manager package
io.attach(server); 

io.on('connection', function(socket) {
    console.log('a user has connected');
    socket.emit('connected', {sID: `${socket.id}`, message: 'new connection'});

    //listen for incoming messages and the send them to everyone 
    socket.on('chat message', function(msg) {
        console.log('message', msg, 'socket', socket.id);

        //send a message to everyone connected client
        io.emit('chat message', { id: `${socket.id}`, message: msg});
    })

    socket.on('disconnect', function() {
        console.log('a user has disconnected');
    });
});
