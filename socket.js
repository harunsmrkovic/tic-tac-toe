import http from 'http'
import socketio from 'socket.io'

let server = http.createServer();
let io = socketio(server);

io.on('connection', socket => {
  socket.on('event', data => {
    if (typeof data.type === 'undefined')
      return

    let { state, next } = data
    if (typeof state.room !== 'undefined') {
      if (data.type == 'connect') {
        socket.join(state.room)
        if(next == 0 && io.sockets.clients(state.room).length == 2) {
          next = 1
        }
      }

      socket.emit(state, state.room)
    }
  });
  socket.on('disconnect', _ => {});
});
server.listen(3000);
