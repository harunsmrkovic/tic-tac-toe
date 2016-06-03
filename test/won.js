import won from '../scripts/won'

import { assert } from 'chai'

describe('Won check', function(){

  it('should say that there is no winner when neither vertical, horizontal nor diagonal line contains the same elements', function(){
    assert.equal(won({ board: [ [1, 0, 1], [1, 0, 0], [0, 0, 1] ] }), false)
  })

  it('should throw an error if board passed contains invalid lengths (should be X * X)', function(){
    assert.throws(function(){ won({ board: [ [1, 0, 1], [1, 0, 0], [0, 0, 1, 4] ] }) }, Error, 'Invalid board')
  })

  it('should say that winner is X on the 1. row horizontal', function(){
    assert.deepEqual(won({ board: [ [1, 1, 1], [1, 0, 0], [0, 0, 1] ] }), { place: 'horizontal', winner: 1, line: 0 })
  })

  it('should say that winner is O on the 2. row vertical', function(){
    assert.deepEqual(won({ board: [ [0, 2, 1], [1, 2, 0], [0, 2, 0] ] }), { place: 'vertical', winner: 2, line: 1 })
  })

  it('should say that winner is X on the diagonal #1', function(){
    assert.deepEqual(won({ board: [ [1, 2, 1], [1, 1, 0], [0, 2, 1] ] }), { place: 'diagonal1', winner: 1 })
  })

  it('should say that winner is O on the diagonal #2', function(){
    assert.deepEqual(won({ board: [ [1, 2, 2], [1, 2, 0], [2, 2, 1] ] }), { place: 'diagonal2', winner: 2 })
  })

  it('should say that winner is X on the 4. row horizontal even if the size is 5', function(){
    assert.deepEqual(won({ board: [ [1, 1, 1, 0, 0], [1, 0, 0, 0, 0], [0, 0, 1, 0, 0], [1, 1, 1, 1, 1], [0, 0, 1, 0, 0] ] }), { place: 'horizontal', winner: 1, line: 3 })
  })

})
