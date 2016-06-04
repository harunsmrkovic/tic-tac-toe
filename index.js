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
    console.log('called', board)
    // Update boxes
    const letter = { 0: '', 1: 'X', 2: 'O' }
    return _.flatMap(board, (xa, x) => {
      return xa.map((player, y) => {
        const $field = $(`.box[data-x=${x}][data-y=${y}] .sign`)
        if ($field.length) {
          $field.text(letter[player])
        } else {
          return $board.append(`<div class="box win" data-x="${x}" data-y="${y}"><div class="sign"></div><div class="line line1"></div><div class="line line2"></div><div class="line line3"></div><div class="line line4"></div></div>`)
        }
      })
    })
  }
}

const renderStatus = ($status) => {
  return (action, { nowPlaying, won, scores }) => {
    // Update colors
    $status.find('.player > .mark').addClass('inactive')
    if(nowPlaying){
      $status.find(`[data-player="${nowPlaying}"] > .mark`).removeClass('inactive')
    }

    // If won cross over the winning combination
    if(won) {
      const { fields, line } = findWinningCoordinates(won)
      _.each(fields, field => {
        $(`.box[data-x="${field[0]}"][data-y="${field[1]}"] .line${line}`).show()
      })
    } else {
      $('.box .line').hide()
    }
  }
}

const increaseScore = ($status) => {
  return (action, { scores, won }) => {
    $status.find(`[data-player="${won.player}"] > .score`).text(scores[won.player])
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

// Find the winning fields
const findWinningCoordinates = (won) => {
  switch (won.place) {
    case 'diagonal1':
      return {
        fields: [[0, 0], [1, 1], [2, 2]],
        line: 3
      }
    case 'diagonal2':
      return {
        fields: [[0, 2], [1, 1], [2, 0]],
        line: 4
      }
    case 'horizontal':
      return {
        fields: [[won.line, 0], [won.line, 1], [won.line, 2]],
        line: 2
      }
    case 'vertical':
      return {
        fields: [[0, won.line], [1, won.line], [2, won.line]],
        line: 1
      }
    default:
      return false
  }
}

const nextGame = (action, state) => {
  const { won } = state
  if(won && player == 1) {
    if(won.player) tictac.dispatch({ type: 'INCREASE_SCORE', winner: won.player })
    setTimeout(() => {
      tictac.dispatch({ type: 'INIT', size: 3 })
    }, 5000)
  }
}

const markMe = ($status) => {
  return () => {
    $status.find(`.player[data-player="${player}"]`).addClass('me')
  }
}

// Game rendering
tictac.subscribe(render($('#board')))

// Action sending
tictac.subscribe(send)

// Status rendering
tictac.subscribe(renderStatus($('#scoreboard')))

// Winner checker
tictac.subscribe(nextGame, ['MOVE'])

// Scoreboard increaser
tictac.subscribe(increaseScore($('#scoreboard')), ['INCREASE_SCORE'])

// Set current user border
tictac.subscribe(markMe($('#scoreboard')), ['START'])

// Start game at random room
const hashRoom = window.location.hash && window.location.hash.substr(1)
if(hashRoom && !isNaN(hashRoom)){
  startGame(hashRoom)
}
else {
  startGame(_.random(roomNoMin, roomNoMax))
}
