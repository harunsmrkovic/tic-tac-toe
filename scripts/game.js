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
      if(!subscriber.actions.length || subscriber.actions.includes(action)){
        console.info('Notify about new state:', JSON.stringify(state, null, 2))
        subscriber.callback(state)
      }
    })
    return true
  }

  return {
    dispatch,
    subscribe
  }
}

export default game
