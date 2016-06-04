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

const renderStatus = ($status) => {
  return ({ nowPlaying }) => {
    // Update text
    const status = ['Waiting for other player...', 'X is on the move', 'O is on the move']
    $status.text(status[nowPlaying])
  }
}

const send = (state) => {
  socket.emit('update', state)
}



const startGame = (room) => {
  tictac.init(room)

  // Update general UI
  $('#game').show()
  $('#start').hide()

  $('#board .box').on('click', function(){
    tictac.move($(this).attr('data-x'), $(this).attr('data-y'), player)
  })

  socket.on('update', state => {
    tictac.update(state)
  })

  socket.on('joined', state => {
    player = 1
    tictac.start()
  })

  socket.emit('join', room)
}

// Subscribes
// Game rendering
tictac.subscribe(render($('#board')))

// Action sending
tictac.subscribe(send, ['INIT', 'MOVE', 'JOIN', 'START'])

// Status rendering
tictac.subscribe(renderStatus($('#status')))

startGame(1234)
