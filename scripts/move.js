const move = (board, x, y, player) => {
  x = parseInt(x)
  y = parseInt(y)

  if(typeof board[y] === 'undefined' || typeof board[y][x] === 'undefined') {
    return board
  }

  return board.map((ya, ny) => ya.map((val, nx) => (x === nx && y === ny && !val) ? player : val))
}

export default move
