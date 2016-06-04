import http from 'http'
import socketio from 'socket.io'

let server = http.createServer()
let io = socketio(server)

io.on('connection', socket => {
  socket.on('update', state => {
    if (typeof state.room !== 'undefined') {
      socket.broadcast.to(state.room).emit('update', state)
    }
  });

  socket.on('joinRoom', room => {
    console.log('Room is ', room)
    socket.join(room)
    socket.broadcast.to(room).emit('joined')
  })

  socket.on('disconnect', _ => {})
  socket.on('error', error => console.log(error))
})

server.listen(3000)
