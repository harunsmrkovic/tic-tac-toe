import game from '../scripts/game'

import { assert } from 'chai'

describe('Game', function(){
  it('should return the same value as passed in', function(){
    var valueToPass = 1
    assert.equal(game(valueToPass), valueToPass)
  })
})
