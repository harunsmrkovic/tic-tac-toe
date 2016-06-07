import mmVal from '../scripts/bot-logic'

import { assert } from 'chai'

describe('Minimax value checks', function() {

  it('should recognize potential row win by X', function(){
    assert.deepEqual(
      mmVal([1, 1, 0, 2, 2, 1, 0, 0, 0], 1, 1),
      1
    )
  });

  it('should recognize potential row win by O', function(){
    assert.deepEqual(
      mmVal([2, 2, 0, 2, 2, 1, 0, 0, 0], 1, 1),
      -1
    )
  });

})
