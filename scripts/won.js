import _ from 'lodash'

const won = ({ board }) => {

  if(_.filter(board, row => row.length !== board.length).length > 0){
    throw new Error('Invalid board')
  }

  const isDiagonal = (x, y) => (x + y === board.length - 1)

  let x = 0;
  let o = 0;

  let crossed = {
    horizontal: { x, o },
    vertical: { x, o },
    diagonal1: { x, o },
    diagonal2: { x,  o }
  }

  let winner = false

  for(var i = 0; i < board.length; i++){
    crossed.horizontal = { x, o }
    crossed.vertical = { x, o }

    if(board[i][i] === 1) crossed.diagonal1.x++
    if(board[i][i] === 2) crossed.diagonal1.o++

    if(isDiagonal(i, board.length - i - 1) && board[i][board.length - i - 1] === 1) crossed.diagonal2.x++
    if(isDiagonal(i, board.length - i - 1) && board[i][board.length - i - 1] === 2) crossed.diagonal2.o++

    for(var j = 0; j < board.length; j++){
       if(board[i][j] === 1) crossed.horizontal.x++
       if(board[i][j] === 2) crossed.horizontal.o++

       if(board[j][i] === 1) crossed.vertical.x++
       if(board[j][i] === 2) crossed.vertical.o++
    }

    _.each(crossed, (line, place) => {
      if(line.x === board.length || line.o === board.length){
        winner = {
          place,
          player: (line.x === board.length) ? 1 : 2
        }

        if(['horizontal', 'vertical'].includes(place)){
          _.extend(winner, { line: i })
        }
      }
    })
  }

  console.log(!winner, board, !board.filter((row) => row.includes(0)).length)
  if(!winner && !board.filter((row) => row.includes(0)).length) {
    return { player: false }
  }

  return winner;
}

export default won
