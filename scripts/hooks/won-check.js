import { wait } from '../helpers'

const checkGameWon = (action, state, dispatch) => {
  const { won } = state
  if(won) {
    if(won.player) dispatch({ type: 'INCREASE_SCORE', winner: won.player })
    wait(() => { dispatch({ type: 'INIT' }) }, 2500)
  }
}

export default checkGameWon
