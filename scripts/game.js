import mutate from './mutate'

const game = () => {

  let state = {
    nowPlaying: 2,
    board: [],
    won: false,
    player: 1
  }

  let subscribers = []
  const subscribe = (callback, actions = []) => {
    subscribers.push({
      callback,
      actions
    })
  }

  const dispatch = (action) => {
    console.info('Dispatching', JSON.stringify(action, null, 2))
    state = mutate(action, state)
    notify(action, state)
  }

  const notify = (action, state) => {
    _.each(subscribers, subscriber => {
      if(!subscriber.actions.length || subscriber.actions.includes(action.type)){
        subscriber.callback(action, state, dispatch)
      }
    })
    return true
  }

  const getState = (child = false) => {
    return (child) ? state[child] : state
  }

  return {
    dispatch,
    subscribe,
    getState
  }
}

export default game
