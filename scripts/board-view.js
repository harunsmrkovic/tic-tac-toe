import _ from 'lodash'
import $ from 'jquery'

const renderBoard = ($board) => {
  return (action, { board }) => {
    // Update boxes
    const letter = { 0: '', 1: 'X', 2: 'O' }
    return _.flatMap(board, (xa, x) => {
      return xa.map((player, y) => {
        const $field = $(`.box[data-x=${x}][data-y=${y}] .sign`)
        if ($field.length) {
          $field.text(letter[player])
        } else {
          return $board.append(`<div class="box win" data-x="${x}" data-y="${y}"><div class="sign"></div><div class="line line1"></div><div class="line line2"></div><div class="line line3"></div><div class="line line4"></div></div>`)
        }
      })
    })
  }
}

export default renderBoard
