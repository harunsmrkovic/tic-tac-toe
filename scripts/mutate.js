import doMove from './move'
import didWon from './won'
import initBoard from './initBoard'
import { cp } from './helpers'

const mutate = (action, state) => {
  switch(action.type) {
    case 'INIT':
      return cp(state, {
        board: initBoard(action.size),
        room: action.room ? action.room : state.room,
        won: false
      })
    case 'START':
      return cp(state, {
        nowPlaying: 1
      })
    case 'MOVE':
      // Can't move if it's not user's turn to play
      if (action.player !== state.nowPlaying) return state

      // Can't play already played field
      if (state.board[action.x][action.y] > 0) return state

      const board = doMove(state.board, action.x, action.y, state.nowPlaying)

      return cp(state, {
          board,
          won: didWon({ board }),
          nowPlaying: 1 + Math.abs(state.nowPlaying-2)
        }
      )
    case 'INCREASE_SCORE':
      const x = state.scores && state.scores.x ? state.scores.x : 0
      const o = state.scores && state.scores.o ? state.scores.o : 0
      return cp(state, {
        scores: { x: (state.won.winner === 1) ? x+1 : x, o: (state.won.winner === 2) ? o+1 : o }
      })
    default:
      return state
  }
}

export default mutate
