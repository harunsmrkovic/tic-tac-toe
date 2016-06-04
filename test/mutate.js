import mutate from '../scripts/mutate'

import { assert } from 'chai'

describe('Mutation check', function() {

  it('should return the same state if an action that doesn\'t exist is sent', function(){
    assert.deepEqual(
      mutate(
        { type: 'SHOULDNOTEXIST' },
        { board: [0], nowPlaying: 0 }
      ),
      { board: [0], nowPlaying: 0 }
    )
  })

  it('should return a 3x3 board in a room', function() {
    assert.deepEqual(
      mutate(
        { type: 'INIT', room: 1337, size: 3 },
        {}
      ),
      {
        room: 1337,
        board: [[0,0,0],[0,0,0],[0,0,0]]
      }
    )
  })

  it('should start the game', function() {
    assert.deepEqual(
      mutate(
        { type: 'START' },
        { board: [[0,0,0],[0,0,0],[0,0,0]] }
      ),
      {
        board: [[0,0,0],[0,0,0],[0,0,0]],
        nowPlaying: 1
      }
    )
  })

  it('should play a move by the X player', function() {
    assert.deepEqual(
      mutate(
        { type: 'MOVE', x: 0, y: 0, player: 1 },
        { board: [[0,0,0],[0,0,0],[0,0,0]], nowPlaying: 1 }
      ),
      {
        board: [[1,0,0],[0,0,0],[0,0,0]],
        nowPlaying: 2,
        won: false
      }
    )
  })

  it('should play a move by the O player', function() {
    assert.deepEqual(
      mutate(
        { type: 'MOVE', x: 0, y: 2, player: 2 },
        { board: [[1,1,0],[0,0,0],[0,0,0]], nowPlaying: 2 }
      ),
      {
        board: [[1,1,2],[0,0,0],[0,0,0]],
        nowPlaying: 1,
        won: false
      }
    )
  })

  it('should return the same board if the same move is played', function() {
    assert.deepEqual(
      mutate(
        { type: 'MOVE', x: 0, y: 0, player: 1 },
        { board: [[1,0,0],[0,0,0],[0,0,0]], nowPlaying: 1 }
      ),
      {
        board: [[1,0,0],[0,0,0],[0,0,0]],
        nowPlaying: 1
      }
    )
  })

  it('should return the same board if the it\'s not the player\'s turn to play', function() {
    assert.deepEqual(
      mutate(
        { type: 'MOVE', x: 0, y: 0, player: 1 },
        { board: [[0,0,0],[0,0,0],[0,0,0]], nowPlaying: 2 }
      ),
      {
        board: [[0,0,0],[0,0,0],[0,0,0]],
        nowPlaying: 2
      }
    )
  })

})
