import _ from 'lodash'
import $ from 'jquery'
import io from 'socket.io-client'

import { cp, wait } from './scripts/helpers'

import config from './config'
const { socket, room } = config

import game from './scripts/game'
import renderBoard from './scripts/board-view'
import renderStatus from './scripts/status-view'
import renderScore from './scripts/score-view'

// Socket Connection
const ws = io(socket.url)

// DOM consts
const $board = $('#board')
const $scoreboard = $('#scoreboard')

// Load game
const { dispatch, subscribe, getState } = game()

// UI
$('#board').on('click', '.box', (e) => {
  const { room, player, won } = getState()
  if(!won){
    const box = $(e.target)
    const action = { type: 'MOVE', x: box.attr('data-x'), y: box.attr('data-y'), player, room }
    dispatch(action)
    ws.emit('update', action)
  }
})

// Join listeners
ws.on('joined', () => {
  dispatch({ type: 'START' })
})

// Move listeners
ws.on('update', (move) => {
  dispatch(move)
})

// Rendering
subscribe(renderBoard($board))
subscribe(renderStatus($scoreboard))
subscribe(renderScore($scoreboard))

// Initialize the game
const startGame = (room) => {
  if(!room || isNaN(room)) room = _.random(roomNoMin, roomNoMax)
  dispatch({ type: 'INIT', size: 3, room })
  ws.emit('join', room)
}

startGame(window.location.hash && window.location.hash.substr(1))
