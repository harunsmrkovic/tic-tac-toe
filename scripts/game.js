import mutate from './mutate'

const game = () => {

  let state = {
    nowPlaying: 0,
    board: [],
    won: false
  }

  let subscribers = []
  const subscribe = (callback) => {
    subscribers.push({ callback })
  }

  const dispatch = (action) => {
    state = mutate(action, state)
    notify(action, state)
  }

  const notify = (action, state) => {
    _.each(subscribers, subscriber => {
      subscriber.callback(action, state)
    })
    return true
  }

  return {
    dispatch,
    subscribe
  }
}

export default game
