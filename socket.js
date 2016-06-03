import http from 'http'
import socketio from 'socket.io'

let server = http.createServer();
let io = socketio(server);

io.on('connection', socket => {
  console.log(socket)
  socket.on('update', state => {
    console.log(state)
    if (typeof state.room !== 'undefined') {
      console.log('Connected and using ', state.room)
      socket.join(state.room)
      console.log(io.sockets.adapter.rooms[state.room])
      if(state.next === 0 && io.sockets.adapter.rooms[state.room].length == 2) {
        state.next = 1
      }
      socket.broadcast.to(state.room).emit('update', state)
    }
  });
  socket.on('disconnect', _ => {});
  socket.on('error', error => console.log(error))
});
server.listen(3000);
