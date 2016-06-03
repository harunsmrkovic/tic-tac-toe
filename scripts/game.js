import didWon from './won'
import doMove from './move'

const game = ({ size }) => {

  let state = {
    nowPlaying: 0,
    board: [],
    won: false
  }

  let subscribers = []
  const subscribe = (callback) => {
    subscribers.push(callback)
  }

  const notify = (state) => {
    _.each(subscribers, subscriber => {
      console.info('New state is', JSON.stringify(state, null, 2))
      subscriber(state)
    })
    return true
  }

  const initBoard = () => {
    return [...Array(size)].map(_ => [...Array(size)].map(_ => 0))
  }

  const init = () => {
    state = Object.assign({}, state,
      {
        board: initBoard(size)
      }
    )
    notify(state)
  }

  const move = (x, y, player) => {
    const board = doMove(state.board, x, y, player)
    state = Object.assign({}, state,
      {
        board,
        won: didWon({ board })
      }
    )
    notify(state)
  }

  const join = (room) => {
    state = Object.assign({}, state,
      {
        room: room
      }
    )
    notify(state)
  }

  const start = () => {
    state = Object.assign({}, state,
      {
        nowPlaying: 1
      }
    )
    notify(state)
  }

  return {
    init,
    move,
    join,
    subscribe,
    start
  }
}

export default game
