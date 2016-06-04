import game from './scripts/game'
import _ from 'lodash'
import $ from 'jquery'
import io from 'socket.io-client'

const roomNoMin = 1000
const roomNoMax = 9999

// Initialize the game
const tictac = game({ size: 3 })
let player = 2

// Socket
let socket = io('http://localhost:3000')

const $joinRoom = $('#join-room')

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
  // Initiate game
  tictac.dispatch({ type: 'INIT', room: room, size: 3 })

  // Add event listener for playing
  $('#board .box').on('click', function(){
    tictac.dispatch({ type: 'MOVE', x: $(this).attr('data-x'), y: $(this).attr('data-y'), player })
  })

  // Dispatching actions from other players
  socket.on('update', update => {
    tictac.dispatch(update)
  })

  // Wait for other players to join
  socket.on('joined', state => {
    player = 1
    tictac.dispatch({ type: 'START' })
  })

  // Join the room at server
  socket.emit('join', room)
  window.location.hash = room
  $joinRoom.val(room)
}

// Joining room
$joinRoom.on('keyup', (e) => {
  const roomNo = $(e.target).val()
  if(_.inRange(roomNo, roomNoMin, roomNoMax)){
    startGame(roomNo)
  }
})

// Game rendering
tictac.subscribe(render($('#board')))

// Action sending
tictac.subscribe(send, ['INIT', 'MOVE', 'JOIN', 'START'])

// Status rendering
tictac.subscribe(renderStatus($('#status')), ['MOVE', 'JOIN'])

// Start game at random room
const hashRoom = window.location.hash && window.location.hash.substr(1)
if(hashRoom && !isNaN(hashRoom)){
  startGame(hashRoom)
}
else {
  startGame(_.random(roomNoMin, roomNoMax))
}
