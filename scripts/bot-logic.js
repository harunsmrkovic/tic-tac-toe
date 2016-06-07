import _ from 'lodash'
import game from './game'
import $ from 'jquery'
import io from 'socket.io-client'
import { cp, wait } from './helpers'

function findAllIndices(arr, val) {
	var inds = [];
	for(var i = 0; i < arr.length; i++) {
		if(arr[i] == val) {
			inds.push(i);
		}
	}

	return inds;
}

const didWin = function(state, symbol) {
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

export default didWin;


const didXWin = function(state) {
	return didWin(state, 1);
}

export default didXWin;

const didOWin = function(state) {
	return didWin(state, 2);
}

export default didOWin;

const isOver = function(state) {
	var emptyFileds = findAllIndices(state, 0);

	return didXWin(state) || didOWin(state) || emptyFileds.length === 0;
}

export default isOver;

// -- for debug
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
var mmVal = function(state, currPlayer, depth) {
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

export default mmVal;

const nextMove = function(state, currPlayer) {
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

export default nextMove;
