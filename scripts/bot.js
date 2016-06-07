import _ from 'lodash'
import game from './game'
import $ from 'jquery'
import io from 'socket.io-client'
import { cp, wait } from './helpers'
import mmVal from './bot-logic'
import nextMove from './bot-logic'

// ==== sockets ====

const roomNoMin = 1000
const roomNoMax = 9999

// Initialize the game
const tictac = game({ size: 3 })
let player = 2

// Socket
let socket = io('http://localhost:3000')

// When the socket sends an update
const send = (action, state) => {
	if(!action.fromSocket) {
		socket.emit('update', cp(action, { room: state.room }))
	}
}


// Action sending
tictac.subscribe(send, ['MOVE', 'START'])

const startGame = (room) => {
  // Initiate game
  tictac.dispatch({ type: 'INIT', room: room, size: 3 })

  // Dispatching actions from other players
  socket.on('update', update => {
    tictac.dispatch(cp(update, { fromSocket: true }))

    console.log(tictac.getState());

	var move = nextMove(_.flattenDeep(tictac.getState().board), 2);

	var move_x = Math.floor(move / 3);
	var move_y = move - Math.floor(move / 3) * 3;

	console.log('move: ' + move);
	console.log('x: ' + move_x);
	console.log('y: ' + move_y);

	tictac.dispatch({ type: 'MOVE', x: move_x, y: move_y, player });
  })

  // Wait for other players to join
  socket.on('joined', state => {
    player = 1
    tictac.dispatch({ type: 'START' })
  })

  // Join the room at server
  socket.emit('join', room)
}

const checkGameWon = (action, state) => {
  const { won } = state
  if(won) {
    if(won.player) tictac.dispatch({ type: 'INCREASE_SCORE', winner: won.player })
    wait(() => {tictac.dispatch({ type: 'INIT', size: 3 })}, 2500)
  }
}

startGame(501);
