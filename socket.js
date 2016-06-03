import http from 'http'
import socketio from 'socket.io'

let server = http.createServer()
let io = socketio(server)

io.on('connection', socket => {
  console.log(socket)
  socket.on('update', state => {
    console.log(state)
    if (typeof state.room !== 'undefined') {
      socket.join(state.room)
      socket.broadcast.to(state.room).emit('update', state)
    }
  });

  socket.on('join', room => {
    console.log('join hit', room)
    socket.broadcast.to(room).emit('joined')
  })

  socket.on('disconnect', _ => {})
  socket.on('error', error => console.log(error))
})

server.listen(3000)
