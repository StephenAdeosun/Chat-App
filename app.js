const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const app = express();
let server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(__dirname + '/public'));

const user = {}
io.on('connection', (socket) => {
    console.log('New user connected', socket.id);
    // socket.on('chat message', () => {
        
    //     io.to(user[socket.id].roomId).emit('chat message', msg);
    // })
    // socket.on('chat message', (msg) => {
    //     console.log('message: ' + msg);
    //     io.emit('chat message', msg);
    // })

    socket.on('join', (username,phone_number,roomId) => {

            if(user[socket.id]){
                console.log('roomId',user[socket.id].roomId)
                socket.leave(user[socket.id].roomId)
            }
            socket.join(roomId)
            user[socket.id] = {username,phone_number,roomId}
            console.log('user',user)
            socket.emit('chat message', 'Welcome to the chat!')

            // send to to all clients except sender client
            socket.broadcast.to(roomId).emit('chat message', `${username} has joined the chat`)
            // io.to(roomId).emit('chat message', `${username} has joined the chat`)
    })

// send message to all clients in room

socket.on('new message', (data) => {
    const { phone_number,username, roomId} = user[socket.id]
    io.to(roomId).emit("chat message", `${username}:${data}`)
  });



    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });
    // socket.on('createMessage', (message) => {
    //     console.log('createMessage', message);
    //     io.emit('newMessage', {
    //         from: message.from,
    //         text: message.text,
    //         createdAt: new Date().getTime()
    //     });
    // });
    // socket.emit('newMessage', {
    //     from: 'Admin',
    //     text: 'Welcome to the chat app',
    //     createdAt: new Date().getTime()
    // });
    // socket.broadcast.emit('newMessage', {
    //     from: 'Admin',
    //     text: 'New user joined',
    //     createdAt: new Date().getTime()
    // });
});





app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})
app.get('*', (req, res) => {
    res.redirect('/');

})
server.listen(3000, () => {
    console.log('Server is up on port 3000');
})
