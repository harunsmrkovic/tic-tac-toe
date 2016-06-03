import didWon from './won'

const game = ({ size }) => {

  const initBoard = () => {
    return [...Array(size)].map(_ => [...Array(size)].map(_ => 0))
  }

  const start = () => {
    return initBoard(size)
  }

  const move = (board, x, y, player) => {
    x = parseInt(x)
    y = parseInt(y)

    if(board[x][y] !== 0) {
      return board
    }

    return board.map((xa, nx) => xa.map((val, ny) => (x === nx && y === ny) ? player : val))
  }

  const won = (board) => {
    return didWon({ board })
  }

  return {
    start,
    move,
    won
  }
}

export default game
