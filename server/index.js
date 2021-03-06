const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
let players = []

server.listen(8080, () => {
  console.log("Server Running on port 8080")
})

io.on('connection', socket => {
  console.log("Player Connected!")

  socket.emit('socketID', { id: socket.id });

  socket.emit('getPlayers', players);

  socket.broadcast.emit('newPlayer', { id: socket.id });

  socket.on('playerMoved', data => {
    data.id = socket.id;
    socket.broadcast.emit('playerMoved', data);

    for (let i = 0; i < players.length; i++) {
        if (players[i].id == data.id) {
            players[i].x = data.x;
            players[i].y = data.y;
        }
    }
  })

  socket.on('disconnect', () => {
    console.log("Player disconnect")
    socket.broadcast.emit('playerDisconnected', { id: socket.id })
    for(let i = 0; i < players.length; i++) {
        if (players[i].id == socket.id) {
            players.splice(i, 1);
        }
    }
  })

  players.push(new player(socket.id, 0, 0))
})

function player(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
}