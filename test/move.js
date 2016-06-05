import move from '../scripts/move-compiled'

import { assert } from 'chai'

describe('Move check', function(){

  it('should set 2 as a played move on position [1, 1]', function(){
    assert.deepEqual(
      move(
        [ [1, 1, 1], [1, 0, 0], [0, 0, 1] ], 1, 1, 2
      ),
      [ [1, 1, 1], [1, 2, 0], [0, 0, 1] ]
    )
  })

  it('should return same board, if coordinates are out of bounds', function(){
    assert.deepEqual(
      move(
        [ [1, 1, 1], [1, 0, 0], [0, 0, 1] ], 3, 1, 2
      ),
      [ [1, 1, 1], [1, 0, 0], [0, 0, 1] ]
    )
  })

  it('should return same board, if tried mutating board after field is already mutated once', function(){
    assert.deepEqual(
      move(
        [ [1, 1, 1], [1, 1, 0], [0, 0, 1] ], 1, 1, 2
      ),
      [ [1, 1, 1], [1, 1, 0], [0, 0, 1] ]
    )
  })

})
