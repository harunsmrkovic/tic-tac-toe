import doMove from './move'
import didWon from './won'
import initBoard from './initBoard'

const mutate = (action, state) => {
  switch(action.type) {
    case 'INIT':
      return cp(state, { board: initBoard(action.size), room: action.room })
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

export default mutate
