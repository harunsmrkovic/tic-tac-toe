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

  const dispatch = (action) => {
    state = reduce(action, state)
    notify(action, state)
  }

  const reduce = (action, state) => {
    switch(action.type) {
      case 'INIT':
        return cp(state, { board: initBoard(size), room: action.room })
      case 'START':
        return cp(state, { nowPlaying: 1 })
      case 'MOVE':
        // Can't move if it's not user's turn to play
        if (action.player !== state.nowPlaying) return state

        // Can't play already played field
        if (state.board[action.x][action.y] > 0) return state

        const board = doMove(state.board, action.x, action.y, state.nowPlaying)
        return cp(state, {
            board,
            won: didWon({ board }),
            nowPlaying: 1+Math.abs(state.nowPlaying-2)
          }
        )
      default:
        return state
    }
  }

  const cp = (state, body) => {
    return Object.assign({}, state, body)
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

  return {
    dispatch,
    subscribe
  }
}

export default game
