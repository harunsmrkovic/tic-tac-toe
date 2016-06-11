import doMove from './move'
import didWon from './won'
import initBoard from './initBoard'
import { cp } from './helpers'

const mutate = (action, state) => {
  switch(action.type) {
    case 'INIT':
      return cp(state, {
        board: initBoard(action.size || 3),
        room: action.room ? action.room : state.room,
        won: false,
        blockedIncrease: false
      })
    case 'START':
      return cp(state, {
        player: 2
      })
    case 'MOVE':
      // Can't move if it's not user's turn to play
      if (action.player !== state.nowPlaying) return state

      // Can't play already played field
      if (state.board[action.y][action.x] > 0) return state

      // Can't play if someone won
      if(state.won) return state

      const board = doMove(state.board, action.x, action.y, state.nowPlaying)

      return cp(state, {
          board,
          won: didWon({ board }),
          nowPlaying: 1 + Math.abs(state.nowPlaying-2)
        }
      )
    case 'INCREASE_SCORE':
      const x = state.scores && state.scores[1] ? state.scores[1] : 0
      const o = state.scores && state.scores[2] ? state.scores[2] : 0

      if(state.blockedIncrease) return state

      return cp(state, {
        scores: { 1: (state.won.player === 1) ? x+1 : x, 2: (state.won.player === 2) ? o+1 : o },
        blockedIncrease: true
      })
    default:
      return state
  }
}

export default mutate
