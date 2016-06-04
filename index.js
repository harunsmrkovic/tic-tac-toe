import game from './scripts/game'
import _ from 'lodash'
import $ from 'jquery'
import io from 'socket.io-client'
import { cp } from './scripts/helpers'

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
  return (action, { board }) => {
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
  return (action, { nowPlaying }) => {
    // Update colors
    if(nowPlaying){
      $status.find(`[data-player="${nowPlaying}"] > .mark`).removeClass('inactive')
    }
    else {
      $status.find('.player > .mark').addClass('inactive')
    }
  }
}

// When the socket sends an update
const send = (action, state) => {
  if(!action.fromSocket) {
    socket.emit('update', cp(action, { room: state.room }))
  }
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
    tictac.dispatch(cp(update, { fromSocket: true }))
  })

  // Wait for other players to join
  socket.on('joined', state => {
    player = 1
    console.log('dosao neko')
    tictac.dispatch({ type: 'START' })
  })

  // Join the room at server
  socket.emit('joinRoom', room)
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
tictac.subscribe(renderStatus($('#scoreboard')))

// Start game at random room
const hashRoom = window.location.hash && window.location.hash.substr(1)
if(hashRoom && !isNaN(hashRoom)){
  startGame(hashRoom)
}
else {
  startGame(_.random(roomNoMin, roomNoMax))
}
