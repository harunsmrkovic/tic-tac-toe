import game from './scripts/game'
import _ from 'lodash'
import $ from 'jquery'

const tictac = game({ size: 3 })

const letter = { 1: 'X', 2: 'O' }

const render = (board) => {
  const $board = $('#board')

  return _.flatMap(board, (xa, x) => {
    return xa.map((player, y) => {
      const $field = $(`.box[data-x=${x}][data-y=${y}]`)
      if ($field.length) {
        $field.text(letter[player])
      } else {
        return $board.append(`<div class="box" data-x="${x}" data-y="${y}"></div>`)
      }
    })
  })
}

let board = tictac.start()
render(board)

$('#board .box').on('click', function(){
  board = tictac.move(board, $(this).attr('data-x'), $(this).attr('data-y'), 1)
  if(tictac.won(board)){
    console.warn('WON!!!')
  }
  render(board)
})

// field.click =>render(tictac.applyMove)
