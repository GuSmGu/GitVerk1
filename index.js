const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

let innskráðir = 0;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    // hækkum fjölda innskráðra
    innskráðir++;
    // látum alla notendur vita að fjöldi innskráðra hafi breyst
    io.emit('innskráðir breyttust', innskráðir);
    console.log('a user connected');
    socket.on('disconnect', () => {
        // lækkum fjölda innskráðra
        innskráðir--;
        // látum alla notendur vita að fjöldi innskráðra hafi breyst
        io.emit('innskráðir breyttust', innskráðir);
        console.log('user disconnected');
    });
    socket.on('choose_nick', (username) => {
        console.log(username);
        socket.userName = username;
    });
    socket.on('chat message', (msg) => {        
        console.log('message: ' + msg);
        io.emit('chat message', msg, socket.userName);
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});

