import game from './scripts/game'
import _ from 'lodash'
import $ from 'jquery'
import io from 'socket.io-client'

// Initialize the game
const tictac = game({ size: 3 })

// Socket
let socket = io('http://localhost:3000');
socket.emit('hello!')

// Render boxes
const render = ($board) => {
  return ({ board }) => {

    // Update boxes
    const letter = { 1: 'X', 2: 'O' }
    return _.flatMap(board, (xa, x) => {
      return xa.map((player, y) => {
        const $field = $(`.box[data-x=${x}][data-y=${y}]`)
        if ($field.length) {
          $field.text(letter[player])
        } else {
          return $board.append(`<div class="box" data-x="${x}" data-y="${y}"></div>`)
        }
      })
    })
  }
}

const send = (state) => {
  console.info('send state', state)
  socket.emit('update', state)
}

// Subscribe
tictac.subscribe(render($('#board')))
tictac.subscribe(send)

const startGame = (room) => {
  tictac.init()

  // Update general UI
  $('#game').show()
  $('#start').hide()

  $('#board .box').on('click', function(){
    tictac.move($(this).attr('data-x'), $(this).attr('data-y'), 1)
  })

  socket.on('update', state => {
    console.log('dolazi emit', state, room)
    render($('#board'))(state)
  })

  socket.on('joined', state => {
    console.warn('joined')
    tictac.start()
  })
}

const startRoom = (room) => {
  tictac.join(room)
  socket.emit('join', room)
  startGame(room)
}

startRoom(1234)

// $('.startBtn').on('click', () => {
//   startRoom()
// })
