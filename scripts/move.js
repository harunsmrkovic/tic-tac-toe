const move = (board, x, y, player) => {
  x = parseInt(x)
  y = parseInt(y)

  if(board[x][y] !== 0) {
    return board
  }

  return board.map((xa, nx) => xa.map((val, ny) => (x === nx && y === ny) ? player : val))
}

export default move
