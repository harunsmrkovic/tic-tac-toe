import _ from 'lodash'
import game from './game-compiled'
import $ from 'jquery'
import io from 'socket.io-client'
import { cp, wait } from './helpers-compiled'

function findAllIndices(arr, val) {
	var inds = [];
	for(var i = 0; i < arr.length; i++) {
		if(arr[i] == val) {
			inds.push(i);
		}
	}

	return inds;
}

function didWin(state, symbol) {
	if(state[0] === symbol && state[4] === symbol && state[8] === symbol) {
		return true;
	}

	if(state[2] === symbol && state[4] === symbol && state[6] === symbol) {
		return true;
	}

	for(var i = 0; i < 3; i++) {
		if(state[3 * i + 0] === symbol && state[3 * i + 1] === symbol && state[3 * i + 2] === symbol) {
			return true;
		}
	}

	for(var i = 0; i < 3; i++) {
		if(state[0 + i] === symbol && state[3 + i] === symbol && state[6 + i] === symbol) {
			return true;
		}
	}

	return false;
}


function didXWin(state) {
	return didWin(state, 1);
}

function didOWin(state) {
	return didWin(state, 2);
}

function isOver(state) {
	var emptyFileds = findAllIndices(state, 0);

	return didXWin(state) || didOWin(state) || emptyFileds.length === 0;
}

function printBoard(state, depth) {
	for(var i = 0; i < 3; i++) {
		var row = '';
		for(var k = 0; k < depth; k++) {
			row += '\t';
		}
		row += '|';
		for(var j = 0; j < 3; j++) {
			if(state[3 * i + j] === 1) {
				row += ' X ';
			} else if(state[3 * i + j] === 2) {
				row += ' O ';
			} else {
				row += '   ';
			}
		}
		row += '|';
		console.log(row);
	}
	console.log();
}

// x = 1, o = 2, empty = 0
function mmVal(state, currPlayer, depth) {
	// // printBoard(state, depth);

	var isMax = (currPlayer == 1);
	var emptyFields = findAllIndices(state, 0);

	if(isOver(state)) {
		// 0 = draw case
		// console.log('over: ');
		// console.log(state);
		return didXWin(state) ? 1 : (didOWin(state) ? -1 : 0);
	} else {	
		var mmVals = [];

		for(var i = 0; i < emptyFields.length; i++) {
			var value = emptyFields[i];
			var new_state = _.cloneDeep(state);
			
			new_state[value] = currPlayer;
			mmVals.push(mmVal(new_state, (currPlayer == 1) ? 2 : 1, depth + 1));
		}

		var minmax = isMax ? _.max(mmVals) : _.min(mmVals);
		
		return minmax;
	}		
}
 
function nextMove(state, currPlayer) {
	var emptyFields = findAllIndices(state, 0);

	var isMax = (currPlayer == 1);
	var mmVals = [];

	for(var i = 0; i < emptyFields.length; i++) {
		var value = emptyFields[i];
		var new_state = _.cloneDeep(state);
		
		new_state[value] = currPlayer;
		mmVals.push({ ind: emptyFields[i], val: mmVal(new_state, currPlayer, 0) });
	}

	console.log(mmVals);	

	return isMax ? _.maxBy(mmVals, (val) => { return val.val }).ind : _.minBy(mmVals, (val) => { return val.val }).ind;
}

var state = [1, 2, 0, 0, 1, 1, 0, 0, 2];
var player = 2;

// console.log(
// 	mmVal(state, player, 0)
// );

console.log(
	nextMove(state, player)
);

// console.log(isOver([2, 2, 1, 1, 1, 2, 1, 0, 0]))

// printBoard(state, 0);

// console.log(
// 	nextMove(state, player)
// );

// for(var i = 0; i < 8; i++) {
// 	var move = nextMove(state, player);
// 	// console.log(move);

// 	state[move] = player;
// 	player = player == 1 ? 2 : 1;
// 	printBoard(state, 0);
// }

// // ==== sockets ====

// const roomNoMin = 1000
// const roomNoMax = 9999

// // Initialize the game
// const tictac = game({ size: 3 })
// let player = 2

// // Socket
// let socket = io('http://localhost:3000')

// // When the socket sends an update
// const send = (action, state) => {
// 	if(!action.fromSocket) {
// 		socket.emit('update', cp(action, { room: state.room }))
// 	}
// }

// // Action sending
// tictac.subscribe(send, ['MOVE', 'START'])

// const startGame = (room) => {
//   // Initiate game
//   tictac.dispatch({ type: 'INIT', room: room, size: 3 })

//   // Dispatching actions from other players
//   socket.on('update', update => {
//     tictac.dispatch(cp(update, { fromSocket: true }))

//     console.log(tictac.getState());

// 	var move = nextMove(_.flattenDeep(tictac.getState().board), 2);

// 	var move_x = Math.floor(move / 3);
// 	var move_y = move - Math.floor(move / 3) * 3;

// 	console.log('move: ' + move);
// 	console.log('x: ' + move_x);
// 	console.log('y: ' + move_y);

// 	tictac.dispatch({ type: 'MOVE', x: move_x, y: move_y, player });
//   })

//   // Wait for other players to join
//   socket.on('joined', state => {
//     player = 1
//     tictac.dispatch({ type: 'START' })
//   })

//   // Join the room at server
//   socket.emit('join', room)
// }

// const checkGameWon = (action, state) => {
//   const { won } = state
//   if(won) {
//     if(won.player) tictac.dispatch({ type: 'INCREASE_SCORE', winner: won.player })
//     wait(() => {tictac.dispatch({ type: 'INIT', size: 3 })}, 2500)
//   }
// }

// startGame(501);
