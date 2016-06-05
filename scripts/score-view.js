import $ from 'jquery'

const increaseScore = ($status) => {
  return (action, { scores, won }) => {
    $status.find(`[data-player="${won.player}"] > .score`).text(scores[won.player])
  }
}

export default increaseScore
