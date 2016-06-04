import didWon from './won'
import doMove from './move'

const game = ({ size }) => {

  let state = {
    nowPlaying: 0,
    board: [],
    won: false
  }

  let subscribers = []
  const subscribe = (callback, actions = []) => {
    subscribers.push({
      callback,
      actions
    })
  }

  const notify = (action, state) => {
    _.each(subscribers, subscriber => {
      if(!subscriber.actions.length || subscriber.actions.includes(action)){
        console.info('Notify about new state:', JSON.stringify(state, null, 2))
        subscriber.callback(state)
      }
    })
    return true
  }

  const initBoard = () => {
    return [...Array(size)].map(_ => [...Array(size)].map(_ => 0))
  }

  const init = (room) => {
    state = Object.assign({}, state,
      {
        board: initBoard(size),
        room
      }
    )
    notify('INIT', state)
  }

  const move = (x, y, player) => {
    console.log(player, state.nowPlaying, player === state.nowPlaying)
    if (player === state.nowPlaying) {
      const board = doMove(state.board, x, y, state.nowPlaying)
      state = Object.assign({}, state,
        {
          board,
          won: didWon({ board }),
          nowPlaying: 1+Math.abs(state.nowPlaying-2)
        }
      )
      notify('MOVE', state)
    }
  }

  const join = (room) => {
    state = Object.assign({}, state,
      {
        room: room
      }
    )
    notify('JOIN', state)
  }

  const update = (newState) => {
    state = Object.assign({}, newState)
    notify('UPDATE', state)
  }

  const start = () => {
    state = Object.assign({}, state,
      {
        nowPlaying: 1
      }
    )
    notify('START', state)
  }

  return {
    init,
    move,
    join,
    subscribe,
    start,
    update
  }
}

export default game
