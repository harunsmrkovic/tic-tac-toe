import http from 'http'
import socketio from 'socket.io'

let server = http.createServer()
let io = socketio(server)

io.on('connection', socket => {
  socket.on('update', action => {
    console.log('Received action', JSON.stringify(action), 'broadcasting to Room #', action.room)
    if (typeof action.room !== 'undefined') {
      socket.broadcast.to(action.room).emit('update', action)
    }
  });

  socket.on('join', room => {
    console.log('Room is ', room)
    socket.join(room)
    socket.broadcast.to(room).emit('joined')
  })

  socket.on('disconnect', _ => {})
  socket.on('error', error => console.log(error))
})

server.listen(3000)
