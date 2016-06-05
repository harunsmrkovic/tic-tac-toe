import game from './scripts/game'
import _ from 'lodash'
import $ from 'jquery'
import io from 'socket.io-client'
import { cp, wait } from './scripts/helpers'

import renderBoard from './scripts/board-view'
import renderStatus from './scripts/status-view'
import renderScore from './scripts/score-view'

const roomNoMin = 1000
const roomNoMax = 9999

// Initialize the game
const tictac = game({ size: 3 })
let player = 2

// Socket
let socket = io('http://localhost:3000')

const $joinRoom = $('#join-room')

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
    if(!tictac.getState('won')){
      tictac.dispatch({ type: 'MOVE', x: $(this).attr('data-x'), y: $(this).attr('data-y'), player })
    }
  })

  // Dispatching actions from other players
  socket.on('update', update => {
    tictac.dispatch(cp(update, { fromSocket: true }))
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

const markMe = ($status) => {
  return () => {
    $status.find(`.player[data-player="${player}"]`).addClass('me')
  }
}

const checkGameWon = (action, state) => {
  const { won } = state
  if(won) {
    if(won.player) tictac.dispatch({ type: 'INCREASE_SCORE', winner: won.player })
    wait(() => {tictac.dispatch({ type: 'INIT', size: 3 })}, 2500)
  }
}

// Game rendering
tictac.subscribe(renderBoard($('#board')))

// Status rendering
tictac.subscribe(renderStatus($('#scoreboard')))

// Action sending
tictac.subscribe(send, ['MOVE', 'START'])

// Winner checker
tictac.subscribe(checkGameWon, ['MOVE'])

// Scoreboard increaser
tictac.subscribe(renderScore($('#scoreboard')), ['INCREASE_SCORE'])

// Set current user border
tictac.subscribe(markMe($('#scoreboard')), ['START'])

// Start game at random room
const initGame = ((hashRoom) => {
  if(hashRoom && !isNaN(hashRoom)){
    startGame(hashRoom)
  }
  else {
    startGame(_.random(roomNoMin, roomNoMax))
  }
})(window.location.hash && window.location.hash.substr(1))
