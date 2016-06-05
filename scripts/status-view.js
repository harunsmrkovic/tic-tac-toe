import _ from 'lodash'
import $ from 'jquery'

// Find the winning fields
const findWinningCoordinates = (won) => {
  switch (won.place) {
    case 'diagonal1':
      return {
        fields: [[0, 0], [1, 1], [2, 2]],
        line: 3
      }
    case 'diagonal2':
      return {
        fields: [[0, 2], [1, 1], [2, 0]],
        line: 4
      }
    case 'horizontal':
      return {
        fields: [[won.line, 0], [won.line, 1], [won.line, 2]],
        line: 2
      }
    case 'vertical':
      return {
        fields: [[0, won.line], [1, won.line], [2, won.line]],
        line: 1
      }
    default:
      return false
  }
}

const renderStatus = ($status) => {
  return (action, { nowPlaying, won, scores }) => {
    // Update colors
    $status.find('.player > .mark').addClass('inactive')
    if(nowPlaying){
      $status.find(`[data-player="${nowPlaying}"] > .mark`).removeClass('inactive')
    }

    // If won cross over the winning combination
    if(won) {
      const { fields, line } = findWinningCoordinates(won)
      _.each(fields, field => {
        $(`.box[data-x="${field[0]}"][data-y="${field[1]}"] .line${line}`).show()
      })
    } else {
      $('.box .line').hide()
    }
  }
}

export default renderStatus
