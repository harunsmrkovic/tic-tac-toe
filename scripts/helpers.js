export const cp = (state, body) => {
  return Object.assign({}, state, body)
}

export const wait = (cb, ms) => {
  return window.setTimeout(cb, ms)
}
