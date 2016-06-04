import mutate from './mutate'

const game = () => {

  let state = {
    nowPlaying: 0,
    board: [],
    won: false
  }

  let subscribers = []
  const subscribe = (callback, actions = []) => {
    subscribers.push({
      callback,
      actions
    })
  }

  const dispatch = (action) => {
    state = mutate(action, state)
    notify(action, state)
  }

  const notify = (action, state) => {
    _.each(subscribers, subscriber => {
      if(!subscriber.actions.length || subscriber.actions.includes(action.type)){
        subscriber.callback(action, state)
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
