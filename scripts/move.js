const move = (board, x, y, player) => {
  x = parseInt(x)
  y = parseInt(y)

  if(typeof board[x] === 'undefined' || typeof board[x][y] === 'undefined') {
    return board
  }

  return board.map((xa, nx) => xa.map((val, ny) => (x === nx && y === ny && !val) ? player : val))
}

export default move
