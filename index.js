import game from './scripts/game'
import _ from 'lodash'
import $ from 'jquery'

const tictac = game({ size: 3 })

const render = ($board) => {
  return ({ board }) => {
    const letter = { 1: 'X', 2: 'O' }
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
}

tictac.subscribe(render($('#board')))
tictac.start()

$('#board .box').on('click', function(){
  tictac.move($(this).attr('data-x'), $(this).attr('data-y'), 1)
})
