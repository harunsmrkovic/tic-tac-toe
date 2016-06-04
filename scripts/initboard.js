const initBoard = (size) => {
  return [...Array(size)].map(_ => [...Array(size)].map(_ => 0))
}

export default initBoard
