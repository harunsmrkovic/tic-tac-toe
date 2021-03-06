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

import wonCheck from './scripts/hooks/won-check'

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
ws.on('joined', () => { dispatch({ type: 'START' }) })

// Move listeners
ws.on('update', dispatch)

// Rendering
subscribe(renderBoard($board))
subscribe(renderStatus($scoreboard))
subscribe(renderScore($scoreboard), ['INCREASE_SCORE'])

// Hooks
subscribe(wonCheck, ['MOVE'])

// Initialize the game
const startGame = (room) => {
  if(!room || isNaN(room)) room = _.random(config.room.min, config.room.max)
  dispatch({ type: 'INIT', size: 3, room })
  ws.emit('join', room)
}

startGame(window.location.hash && window.location.hash.substr(1))
