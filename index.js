import game from './scripts/game'
import _ from 'lodash'
import $ from 'jquery'
import io from 'socket.io-client'

// Initialize the game
const tictac = game({ size: 3 })
let player = 2

// Socket
let socket = io('http://localhost:3000');

// Render boxes
const render = ($board) => {
  return ({ board, nowPlaying }) => {
    // Update text
    const status = ['Waiting for other player...', 'X is on the move', 'O is on the move']
    $('#status').html(status[nowPlaying])

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
  if(state.nowPlaying !== player)
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
    tictac.move($(this).attr('data-x'), $(this).attr('data-y'), player)
  })

  socket.on('update', state => {
    console.log('dolazi emit', state, room)
    // render($('#board'))(state)
    tictac.update(state)
  })

  socket.on('joined', state => {
    console.warn('joined')
    player = 1
    tictac.start()
  })
}

const startRoom = (room) => {
  tictac.join(room)
  startGame(room)
  socket.emit('join', room)
}

startRoom(1234)

// $('.startBtn').on('click', () => {
//   startRoom()
// })
